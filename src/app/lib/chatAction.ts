"use server";

import axios from "axios";
import { 
  AdminInfoSchema, 
  AboutContentSchema, 
  WorkExpSchema, 
  ProjectSchema 
} from "../models/models";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel, SkillItem } from "@/app/models/models";

type PortfolioData = {
  info: AdminInfoSchema | null;
  about: AboutContentSchema | null;
  workExp: WorkExpSchema[];
  projects: ProjectSchema[];
  skills: SkillItem[];
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type PortfolioContext = {
  context: string;
  projectImageMap: Record<string, string>;
  workImageMap: Record<string, string>;
};

// ── Portfolio context cache (5 min TTL) ──────────────────────────────
const portfolioCache = new Map<string, { data: PortfolioContext; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

// ── Per-user last-request timestamp — enforces minimum gap ───────────
// Free RapidAPI plans typically allow ~1 req/sec or ~50 req/day.
// We enforce a 10s minimum between requests per user to stay safe.
const lastRequestTime = new Map<string, number>();
const MIN_REQUEST_GAP_MS = 10_000; // 10 seconds between AI calls per user

async function fetchAdminEmail(userId: string): Promise<string | null> {
  await connectToDB();
  const admin = await AdminModel.findById(userId).select("email").lean();
  return admin?.email || null;
}

async function fetchPortfolioData(userId: string): Promise<PortfolioData> {
  const base = process.env.NEXT_PUBLIC_API_URI;

  const [infoRes, aboutRes, workRes, projectsRes, skillsRes] = await Promise.all([
    fetch(`${base}/api/admin-info/${userId}`,           { cache: "no-store" }),
    fetch(`${base}/api/about/${userId}`,                { cache: "no-store" }),
    fetch(`${base}/api/work-experience/user/${userId}`, { cache: "no-store" }),
    fetch(`${base}/api/project/user/${userId}`,         { cache: "no-store" }),
    fetch(`${base}/api/skills/${userId}`,               { cache: "no-store" }),
  ]);

  const [infoData, aboutData, workData, projectsData, skillsData] = await Promise.all([
    infoRes.ok     ? infoRes.json()     : null,
    aboutRes.ok    ? aboutRes.json()    : null,
    workRes.ok     ? workRes.json()     : null,
    projectsRes.ok ? projectsRes.json() : null,
    skillsRes.ok   ? skillsRes.json()   : null,
  ]);

  return {
    info:     infoData?.info            ?? null,
    about:    aboutData?.about          ?? null,
    workExp:  workData?.workExp         ?? [],
    projects: projectsData?.projects    ?? [],
    skills:   skillsData?.enabledSkills ?? [],
  };
}

async function buildPortfolioContext(userId: string): Promise<PortfolioContext> {
  const cached = portfolioCache.get(userId);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  const { info, about, workExp, projects, skills } = await fetchPortfolioData(userId);
  const email = await fetchAdminEmail(userId);

  if (!info) return { context: "No information available.", projectImageMap: {}, workImageMap: {} };

  const sections: string[] = [];
  const projectImageMap: Record<string, string> = {};
  const workImageMap: Record<string, string> = {};

  sections.push(`${info.name} is a software developer.`);
  if (info.profileUrl)    sections.push(`Profile Image: ![Profile](${info.profileUrl})`);
  if (info.about)         sections.push(`About: ${info.about}`);
  if (info.address)       sections.push(`Location: ${info.address}`);
  if (info.status)        sections.push(`Current status: ${info.status}`);
  if (email)              sections.push(`Email: ${email}`);
  if (info.contactNumber) sections.push(`Contact: ${info.contactNumber}`);
  if (info.githubUrl)     sections.push(`GitHub: ${info.githubUrl}`);
  if (info.linkedUrl)     sections.push(`LinkedIn: ${info.linkedUrl}`);
  if (info.facebookUrl)   sections.push(`Facebook: ${info.facebookUrl}`);
  if (info.resumeUrl)     sections.push(`Resume: ${info.resumeUrl}`);

  if (about?.paragraphs?.length) {
    sections.push(`Background:\n${about.paragraphs.join("\n")}`);
  }
  if (about?.quickFacts?.length) {
    sections.push(`Quick facts:\n${about.quickFacts.map((f) => `- ${f}`).join("\n")}`);
  }
  if (about?.profileImages?.length) {
    sections.push(
      `Profile Photos:\n${about.profileImages.map((url) => `![Photo](${url})`).join("\n")}`
    );
  }

  if (skills.length) {
    const byCategory = skills.reduce<Record<string, string[]>>((acc, skill) => {
      (acc[skill.category] ??= []).push(skill.name);
      return acc;
    }, {});
    const skillLines = Object.entries(byCategory)
      .map(([cat, names]) => `${cat}: ${names.join(", ")}`)
      .join("\n");
    sections.push(`## Skills\n\n${skillLines}`);
  }

  if (workExp.length) {
    const workLines = workExp.map((w) => {
      if (w.companyLogo) workImageMap[w.companyName] = w.companyLogo;
      return [
        `Company: ${w.companyName}`,
        `Position: ${w.position}`,
        `Period: ${w.range}`,
        w.companyUrl ? `Company Website: ${w.companyUrl}` : "",
        w.tasks?.length
          ? `Responsibilities:\n${w.tasks.map((t) => `  - ${t}`).join("\n")}`
          : "",
      ].filter(Boolean).join("\n");
    });
    sections.push(`## Work Experience\n\n${workLines.join("\n\n---\n\n")}`);
  }

  if (projects.length) {
    const projectLines = projects.map((p) => {
      if (p.projectImage) projectImageMap[p.projectName] = p.projectImage;
      return [
        `Project Name: ${p.projectName}`,
        `Description: ${p.description}`,
        p.projectUrl ? `Live URL: ${p.projectUrl}` : "",
        p.toolsAndTech?.length
          ? `Technologies Used: ${p.toolsAndTech.join(", ")}`
          : "",
      ].filter(Boolean).join("\n");
    });
    sections.push(`## Projects\n\n${projectLines.join("\n\n---\n\n")}`);
  }

  const result: PortfolioContext = {
    context: sections.join("\n\n"),
    projectImageMap,
    workImageMap,
  };

  portfolioCache.set(userId, { data: result, ts: Date.now() });
  return result;
}

async function sendChatMessage(
  messages: ChatMessage[],
  portfolioContext: string,
  userId: string
): Promise<string> {

  // TEMPORARILY DISABLE COOLDOWN FOR TESTING
  // const MIN_REQUEST_GAP_MS = 0;

  // ── Cooldown Guard ─────────────────────────────────────────────
  const now = Date.now();
  const last = lastRequestTime.get(userId) ?? 0;
  const elapsed = now - last;

  if (elapsed < MIN_REQUEST_GAP_MS) {
    const waitSecs = Math.ceil((MIN_REQUEST_GAP_MS - elapsed) / 1000);

    console.log("[COOLDOWN BLOCKED]", {
      userId,
      elapsed,
      waitSecs,
    });

    throw new Error(`COOLDOWN:${waitSecs}`);
  }

  // Prevent duplicate simultaneous requests
  lastRequestTime.set(userId, now);

  const systemMessage = {
    role: "system",
    content: `
You are a helpful portfolio assistant.

Here is information about this developer:

${portfolioContext}

Only answer using the provided information.
If unsure, say you don't know.
`,
  };

  try {

    console.log("[AI REQUEST STARTED]");

    const response = await axios({
      method: "POST",
      url: process.env.DEEPSEEK_AI_URI,

      timeout: 30000,

      headers: {
        "x-rapidapi-key": process.env.DEEPSEEK_AI_RAPID_API_KEY,
        "x-rapidapi-host": process.env.DEEPSEEK_AI_RAPID_API_HOST,
        "Content-Type": "application/json",
      },

      data: {
        messages: [systemMessage, ...messages],

        temperature: 0.7,
        top_p: 0.9,

        max_tokens: 1024,

        web_access: false,
      },
    });

    console.log("[AI SUCCESS]", response.status);

    const data = response.data;

    console.log("[AI RESPONSE DATA]", data);

    return (
      data?.result ||
      data?.choices?.[0]?.message?.content ||
      data?.message ||
      "I couldn't generate a response."
    );

  } catch (error: any) {

    const status = error?.response?.status;
    const data = error?.response?.data;

    console.error("[AI ERROR STATUS]", status);
    console.error("[AI ERROR DATA]", data);
    console.error("[AI ERROR MESSAGE]", error?.message);

    // Allow retry if request failed
    lastRequestTime.delete(userId);

    // ── Proper Error Handling ─────────────────────────────

    if (status === 429) {
      throw new Error("RATE_LIMIT");
    }

    if (status === 401 || status === 403) {
      throw new Error("INVALID_API_KEY");
    }

    if (status >= 500) {
      throw new Error("AI_SERVER_ERROR");
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("AI_TIMEOUT");
    }

    throw new Error("CHAT_ERROR");
  }
}

export async function handleChat(
  messages: ChatMessage[],
  userId: string
): Promise<{ 
  reply: string; 
  projectImageMap: Record<string, string>;
  workImageMap: Record<string, string>;
}> {
  try {
    const { context, projectImageMap, workImageMap } = await buildPortfolioContext(userId);
    const reply = await sendChatMessage(messages, context, userId);

    const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";
    const userLower = lastUserMessage.toLowerCase();

    const showProjects =
      /\b(project|projects|portfolio|built|developed|created|show me)\b/i.test(userLower);
    const showWork =
      /\b(experience|work experience|company|companies|employment|job|jobs|role|roles)\b/i.test(userLower);

    let filteredProjectImageMap: Record<string, string> = {};
    if (showProjects) {
      const mentionedProject = Object.keys(projectImageMap).find((name) =>
        userLower.includes(name.toLowerCase())
      );
      filteredProjectImageMap = mentionedProject
        ? { [mentionedProject]: projectImageMap[mentionedProject] }
        : projectImageMap;
    }

    let filteredWorkImageMap: Record<string, string> = {};
    if (showWork) {
      const mentionedCompany = Object.keys(workImageMap).find((name) =>
        userLower.includes(name.toLowerCase())
      );
      filteredWorkImageMap = mentionedCompany
        ? { [mentionedCompany]: workImageMap[mentionedCompany] }
        : workImageMap;
    }

    return { reply, projectImageMap: filteredProjectImageMap, workImageMap: filteredWorkImageMap };

  } catch (error: any) {

    console.error("AI Chat Error:", error);

    if (
      error?.message === "RATE_LIMIT" ||
      error?.message === "INVALID_API_KEY" ||
      error?.message === "AI_SERVER_ERROR" ||
      error?.message === "AI_TIMEOUT" ||
      error?.message?.startsWith("COOLDOWN:")
    ) {
      throw error;
    }

    throw new Error("CHAT_ERROR");
  }
}
