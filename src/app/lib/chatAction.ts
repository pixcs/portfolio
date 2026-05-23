"use server";

import { connectToDB } from "@/app/lib/connectToDB";
import {
  AdminInfoModel,
  AboutMeModel,
  WorkExperience,
  ProjectModel,
  SkillsContentModel,
} from "@/app/models/models";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type PortfolioSections = {
  ownerName:       string;
  identity:        string;
  background:      string;
  skills:          string;
  work:            string;
  projects:        string;
  projectImageMap: Record<string, string>;
  workImageMap:    Record<string, string>;
};

// Config
const CACHE_TTL          = 10 * 60 * 1000;
const MIN_REQUEST_GAP_MS = 10_000;
const AI_TIMEOUT_MS      = 8_000;  // safely under Vercel's 10s limit
const MAX_HISTORY        = 3;
const MAX_TOKENS         = 250;

const portfolioCache  = new Map<string, { data: PortfolioSections; ts: number }>();
const lastRequestTime = new Map<string, number>();

// INTENT DETECTION
type SectionKey = "background" | "skills" | "work" | "projects";

const INTENT_PATTERNS: Record<SectionKey, RegExp> = {
  background: /\b(about|yourself|who are you|background|tell me|introduce|bio|personal)\b/i,
  skills:     /\b(skill|tech|stack|know|language|framework|tool|experience with|proficient)\b/i,
  work:       /\b(work|job|company|employer|experience|career|position|role|hired|employment)\b/i,
  projects:   /\b(project|portfolio|built|created|made|app|website|demo|github)\b/i,
};

function detectSections(userMessage: string): SectionKey[] {
  const msg = userMessage.trim().toLowerCase();

  // STRICT GREETING / INTRO CHECK
  const isGreetingOrIntro =
    /^(hi|hello|hey|yo|good\s*morning|good\s*evening)\b/.test(msg) ||
    /^i'?m\s+\w+/.test(msg) ||              // "I'm Patrick"
    /^im\s+\w+/.test(msg);                  // "Im Patrick"

  if (isGreetingOrIntro) {
    return ["background"];
  }

  // NORMAL INTENT MATCHING
  const matched = (Object.keys(INTENT_PATTERNS) as SectionKey[]).filter(
    (key) => INTENT_PATTERNS[key].test(msg)
  );

  return matched.length ? matched : ["background"];
}

async function fetchPortfolioData(userId: string) {
  await connectToDB();

  const [info, about, workExp, projects, skills] = await Promise.all([
    AdminInfoModel.findOne({ userId }).lean(),
    AboutMeModel.findOne({ userId }).lean(),
    WorkExperience.find({ userId }).lean(),
    ProjectModel.find({ userId }).lean(),
    SkillsContentModel.findOne({ userId }).lean(),
  ]);
  return {
    info,
    about,
    workExp:  workExp  ?? [],
    projects: projects ?? [],
    skills:   skills?.enabledSkills ?? [],
  };
}

async function getPortfolioSections(userId: string): Promise<PortfolioSections> {
  const cached = portfolioCache.get(userId);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const { info, about, workExp, projects, skills } = await fetchPortfolioData(userId);

  const projectImageMap: Record<string, string> = {};
  const workImageMap:    Record<string, string> = {};

  const identityParts: string[] = [];
  if (info) {
    identityParts.push(`Name: ${info.name}`);
    if (info.about)         identityParts.push(`Summary: ${info.about}`);
    if (info.address)       identityParts.push(`Location: ${info.address}`);
    if (info.status)        identityParts.push(`Status: ${info.status}`);
    if (info.email)         identityParts.push(`Email: ${info.email}`);
    if (info.contactNumber) identityParts.push(`Phone: ${info.contactNumber}`);
    if (info.githubUrl)     identityParts.push(`GitHub: ${info.githubUrl}`);
    if (info.linkedUrl)     identityParts.push(`LinkedIn: ${info.linkedUrl}`);
    if (info.resumeUrl)     identityParts.push(`Resume: ${info.resumeUrl}`);
  }

  const backgroundParts: string[] = [];
  if (about?.paragraphs?.length)
    backgroundParts.push(`Background:\n${about.paragraphs.join("\n")}`);
  if (about?.quickFacts?.length)
    backgroundParts.push(`Quick Facts:\n${about.quickFacts.map((f: string) => `- ${f}`).join("\n")}`);

  let skillsSection = "";
  if (skills.length) {
    const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
      (acc[s.category] ??= []).push(s.name);
      return acc;
    }, {});
    skillsSection = `Skills:\n${Object.entries(byCategory)
      .map(([cat, names]) => `  ${cat}: ${names.join(", ")}`)
      .join("\n")}`;
  }

  let workSection = "";
  if (workExp.length) {
    const lines = workExp.map((w) => {
      if (w.companyLogo) workImageMap[w.companyName] = w.companyLogo;
      const parts = [`${w.companyName} — ${w.position} (${w.range})`];
      if (w.tasks?.length)
        parts.push(w.tasks.slice(0, 3).map((t: string) => `  • ${t}`).join("\n"));
      return parts.join("\n");
    });
    workSection = `Work Experience:\n${lines.join("\n\n")}`;
  }

  let projectsSection = "";
  if (projects.length) {
    const lines = projects.map((p) => {
      if (p.projectImage) projectImageMap[p.projectName] = p.projectImage;
      const parts = [`${p.projectName}: ${p.description}`];
      if (p.toolsAndTech?.length) parts.push(`Tech: ${p.toolsAndTech.join(", ")}`);
      if (p.projectUrl)           parts.push(`URL: ${p.projectUrl}`);
      return parts.join(" | ");
    });
    projectsSection = `Projects:\n${lines.join("\n")}`;
  }

  const result: PortfolioSections = {
    ownerName:       info?.name ?? "the developer",
    identity:        identityParts.join("\n"),
    background:      backgroundParts.join("\n\n"),
    skills:          skillsSection,
    work:            workSection,
    projects:        projectsSection,
    projectImageMap,
    workImageMap,
  };

  portfolioCache.set(userId, { data: result, ts: Date.now() });
  return result;
}

function assembleContext(sections: PortfolioSections, needed: SectionKey[]): string {
  const parts = [sections.identity];
  for (const key of needed) {
    const content = sections[key];
    if (content) parts.push(content);
  }
  return parts.filter(Boolean).join("\n\n");
}

async function callGroq(messages: object[]): Promise<string> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:       "llama-3.3-70b-versatile",
        messages,
        max_tokens:  MAX_TOKENS,
        temperature: 0.7,
        top_p:       0.9,
        stream:      false,
      }),
    });

    if (!res.ok) {
      const status = res.status;
      if (status === 429) throw new Error("RATE_LIMIT");
      if (status === 401 || status === 403) throw new Error("INVALID_API_KEY");
      if (status >= 500) throw new Error("AI_SERVER_ERROR");
      throw new Error("CHAT_ERROR");
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "I couldn't generate a response.";

  } catch (error: any) {
    const isTimeout = error.name === "AbortError" || error.code === "ERR_CANCELED";
    if (isTimeout) throw new Error("AI_TIMEOUT");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function sendChatMessage(
  messages:         ChatMessage[],
  portfolioContext: string,
  userId:           string,
  ownerName:        string,
): Promise<string> {
  const now  = Date.now();
  const last = lastRequestTime.get(userId) ?? 0;

  if (now - last < MIN_REQUEST_GAP_MS) {
    const waitSecs = Math.ceil((MIN_REQUEST_GAP_MS - (now - last)) / 1000);
    throw new Error(`COOLDOWN:${waitSecs}`);
  }

  lastRequestTime.set(userId, now);

  const systemMessage = {
  role: "system",
  content: `You are ${ownerName}'s AI portfolio assistant.

    Your job is to help visitors learn about ${ownerName}'s:
    - background
    - skills
    - work experience
    - projects
    - tech stack
    - achievements

    Behavior rules:
    - Be friendly, professional, concise, and enthusiastic.
    - Only use the portfolio data provided below.
    - Never invent information, projects, skills, companies, experience, or images.
    - If information is unavailable, politely say you do not have that information.
    - Do not guess or assume missing details.

    Important interpretation rules:
    - Casual messages like "Hi", "Hello", "I'm Patrick", "How are you", or introductions are NOT project names, company names, or image requests.
    - Never interpret normal conversation text as portfolio entities.
    - Only mention projects, companies, or skills that explicitly exist in the portfolio data.
    - Only reference project images if the project explicitly has an image.
    - Only reference company/work images if they explicitly exist.
    - If no image exists, simply say:
      "I don't have an image available for that."

    Formatting rules:
    - Always format URLs as markdown links: [label](url)
    - For GitHub links use: [GitHub Profile](url)
    - For LinkedIn links use: [LinkedIn](url)
    - For resumes use: [View Resume](url)
    - For project links use: [Project Name](url)

    Response style:
    - Use **bold** for names, roles, technologies, and important highlights.
    - Use bullet points for lists of skills, tools, tasks, or achievements.
    - Keep answers clean and readable.
    - Avoid overly long responses unless the user asks for details.

    Portfolio data:
    ${portfolioContext}`,
  };

  try {
      return await callGroq([systemMessage, ...messages.slice(-MAX_HISTORY)]);
  } catch (err) {
      lastRequestTime.delete(userId);
    throw err;
  }
}

export async function handleChat(
  messages: ChatMessage[],
  userId:   string,
): Promise<{
  reply:           string;
  projectImageMap: Record<string, string>;
  workImageMap:    Record<string, string>;
}> {
  try {
    const sections        = await getPortfolioSections(userId);
    const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";
    const neededSections  = detectSections(lastUserMessage);
    const context         = assembleContext(sections, neededSections);

    const reply = await sendChatMessage(messages, context, userId, sections.ownerName);

    return {
      reply,
      projectImageMap: neededSections.includes("projects") ? sections.projectImageMap : {},
      workImageMap:    neededSections.includes("work")     ? sections.workImageMap    : {},
    };
  } catch (error: any) {
      console.error("AI Chat Error:", error.message);

    if (
      error.message?.startsWith("COOLDOWN:") ||
      error.message === "RATE_LIMIT"          ||
      error.message === "AI_TIMEOUT"          ||
      error.message === "AI_SERVER_ERROR"     ||
      error.message === "INVALID_API_KEY"
    ) throw error;

    throw new Error("CHAT_ERROR");
  }
}
