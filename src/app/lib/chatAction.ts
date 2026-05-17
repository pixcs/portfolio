"use server";

import axios from "axios";
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

// ── Config ──────────────────────────────────────────────
const CACHE_TTL          = 5 * 60 * 1000;
const MIN_REQUEST_GAP_MS = 10_000;
const AI_TIMEOUT_MS      = 25_000;  // DeepSeek via RapidAPI is slow — give it 25 s
const MAX_RETRIES        = 1;       // retry once on timeout/5xx
const MAX_HISTORY        = 4;

const portfolioCache  = new Map<string, { data: PortfolioSections; ts: number }>();
const lastRequestTime = new Map<string, number>();

// ─────────────────────────────────────────────────────────
// INTENT DETECTION
// ─────────────────────────────────────────────────────────
type SectionKey = "background" | "skills" | "work" | "projects";

const INTENT_PATTERNS: Record<SectionKey, RegExp> = {
  background: /\b(about|yourself|who are you|background|tell me|introduce|bio|personal)\b/i,
  skills:     /\b(skill|tech|stack|know|language|framework|tool|experience with|proficient)\b/i,
  work:       /\b(work|job|company|employer|experience|career|position|role|hired|employment)\b/i,
  projects:   /\b(project|portfolio|built|created|made|app|website|demo|github)\b/i,
};

function detectSections(userMessage: string): SectionKey[] {
  const matched = (Object.keys(INTENT_PATTERNS) as SectionKey[]).filter(
    (key) => INTENT_PATTERNS[key].test(userMessage)
  );
  return matched.length ? matched : ["background"];
}

// ─────────────────────────────────────────────────────────
// FETCH + BUILD SECTIONS
// ─────────────────────────────────────────────────────────
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

  // ── identity ─────────────────────────────────────────
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

  // ── background ───────────────────────────────────────
  const backgroundParts: string[] = [];
  if (about?.paragraphs?.length)
    backgroundParts.push(`Background:\n${about.paragraphs.join("\n")}`);
  if (about?.quickFacts?.length)
    backgroundParts.push(`Quick Facts:\n${about.quickFacts.map((f: string) => `- ${f}`).join("\n")}`);

  // ── skills ───────────────────────────────────────────
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

  // ── work ─────────────────────────────────────────────
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

  // ── projects ─────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// ASSEMBLE CONTEXT — only what the query needs
// ─────────────────────────────────────────────────────────
function assembleContext(sections: PortfolioSections, needed: SectionKey[]): string {
  const parts = [sections.identity];
  for (const key of needed) {
    const content = sections[key];
    if (content) parts.push(content);
  }
  return parts.filter(Boolean).join("\n\n");
}

// ─────────────────────────────────────────────────────────
// AI CALL — DeepSeek via RapidAPI, with retry
// ─────────────────────────────────────────────────────────
async function callDeepSeek(payload: object, attempt = 0): Promise<string> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response: any = await axios({
      method:  "POST",
      url:     process.env.DEEPSEEK_AI_URI,
      signal:  controller.signal,
      headers: {
        "x-rapidapi-key":  process.env.DEEPSEEK_AI_RAPID_API_KEY,
        "x-rapidapi-host": process.env.DEEPSEEK_AI_RAPID_API_HOST,
        "Content-Type":    "application/json",
      },
      data: payload,
    });

    return (
      response.data?.result ||
      response.data?.choices?.[0]?.message?.content ||
      response.data?.message ||
      "I couldn't generate a response."
    );
  } catch (error: any) {
    const isTimeout = error.name === "AbortError" || error.code === "ERR_CANCELED";
    const status    = error?.response?.status;

    // Retry once on timeout or 5xx
    if ((isTimeout || (status >= 500)) && attempt < MAX_RETRIES) {
      console.warn(`DeepSeek attempt ${attempt + 1} failed (${isTimeout ? "timeout" : status}), retrying...`);
      await new Promise((r) => setTimeout(r, 2000)); // 2 s back-off
      return callDeepSeek(payload, attempt + 1);
    }

    if (isTimeout)                        throw new Error("AI_TIMEOUT");
    if (status === 429)                   throw new Error("RATE_LIMIT");
    if (status === 401 || status === 403) throw new Error("INVALID_API_KEY");
    if (status >= 500)                    throw new Error("AI_SERVER_ERROR");

    throw new Error("CHAT_ERROR");
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
    role:    "system",
    content: `You are ${ownerName}'s personal portfolio assistant — friendly, warm, and genuinely excited to talk about their work.

Your personality:
- Conversational and approachable, not robotic
- Enthusiastic when talking about projects and skills (but not over the top)
- Use natural language like "Oh, great question!" or "I'd love to tell you about..."
- Keep answers concise but human — like a friend talking about someone they admire
- If you don't know something, say "Hmm, I'm not sure about that one!" instead of a stiff "I don't know"

Only use the information below. Never make things up.

--- Portfolio Data ---
${portfolioContext}
---------------------

Remember: you're representing ${ownerName}, so be proud and personable about their work! 🚀`,
  };

  const payload = {
    messages:    [systemMessage, ...messages.slice(-MAX_HISTORY)],
    temperature: 0.7,
    top_p:       0.9,
    max_tokens:  400,
    web_access:  false,
  };

  try {
    return await callDeepSeek(payload);
  } catch (err) {
    // Clear cooldown so user can retry immediately after a real error
    lastRequestTime.delete(userId);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────
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

    const showProjects = neededSections.includes("projects");
    const showWork     = neededSections.includes("work");

    return {
      reply,
      projectImageMap: showProjects ? sections.projectImageMap : {},
      workImageMap:    showWork     ? sections.workImageMap    : {},
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
