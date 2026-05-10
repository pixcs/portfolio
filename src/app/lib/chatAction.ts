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

async function fetchAdminEmail(userId: string): Promise<string | null> {
  await connectToDB();

  const admin = await AdminModel
    .findById(userId)
    .select("email")
    .lean();

  return admin?.email || null;
}

async function fetchPortfolioData(userId: string): Promise<PortfolioData> {
  const base = process.env.NEXT_PUBLIC_API_URI;

  const [infoRes, aboutRes, skillsRes, workRes, projectsRes] =
    await Promise.all([
      fetch(`${base}/api/admin-info/${userId}`,           { cache: "no-store" }),
      fetch(`${base}/api/about/${userId}`,                { cache: "no-store" }),
      fetch(`${base}/api/skills/${userId}`,               { cache: "no-store" }),
      fetch(`${base}/api/work-experience/user/${userId}`, { cache: "no-store" }),
      fetch(`${base}/api/project/user/${userId}`,         { cache: "no-store" }),
    ]);

  const [infoData, aboutData, skillsData, workData, projectsData] =
    await Promise.all([
      infoRes.ok ? infoRes.json() : null,
      aboutRes.ok ? aboutRes.json() : null,
      skillsRes.ok ? skillsRes.json() : null,
      workRes.ok ? workRes.json() : null,
      projectsRes.ok ? projectsRes.json() : null,
    ]);

  return {
    info: infoData?.info ?? null,
    about: aboutData?.about ?? null,
    skills: skillsData?.enabledSkills ?? [],
    workExp: workData?.workExp ?? [],
    projects: projectsData?.projects ?? [],
  };
}

async function buildPortfolioContext(userId: string): Promise<PortfolioContext> {
  const { info, about, workExp, projects, skills } =
    await fetchPortfolioData(userId);

  const email = await fetchAdminEmail(userId);

  if (!info) {
    return {
      context: "No information available.",
      projectImageMap: {},
      workImageMap: {},
    };
  }

  const sections: string[] = [];
  const projectImageMap: Record<string, string> = {};
  const workImageMap: Record<string, string> = {};

  // Basic info
  sections.push(`${info.name} is a software developer.`);

  if (email) sections.push(`Email: ${email}`);
  if (info.about) sections.push(`About: ${info.about}`);
  if (info.address) sections.push(`Location: ${info.address}`);

  // Skills 
  if (skills?.length) {
    sections.push(
      `Skills:\n${skills
        .map((s) => `- ${s.name} (${s.category})`)
        .join("\n")}`
    );
  }

  // About
  if (about?.paragraphs?.length) {
    sections.push(`Background:\n${about.paragraphs.join("\n")}`);
  }

  // Work
  if (workExp.length) {
    const workLines = workExp.map((w) => {
      if (w.companyLogo) workImageMap[w.companyName] = w.companyLogo;

      return [
        `Company: ${w.companyName}`,
        `Position: ${w.position}`,
        `Period: ${w.range}`,
        w.tasks?.length
          ? `Responsibilities:\n${w.tasks.map((t) => `- ${t}`).join("\n")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
    });

    sections.push(`## Work Experience\n\n${workLines.join("\n\n---\n\n")}`);
  }

  // Projects
  if (projects.length) {
    const projectLines = projects.map((p) => {
      if (p.projectImage) projectImageMap[p.projectName] = p.projectImage;

      return [
        `Project: ${p.projectName}`,
        `Description: ${p.description}`,
        p.toolsAndTech?.length
          ? `Tech: ${p.toolsAndTech.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
    });

    sections.push(`## Projects\n\n${projectLines.join("\n\n---\n\n")}`);
  }

  return {
    context: sections.join("\n\n"),
    projectImageMap,
    workImageMap,
  };
}

async function sendChatMessage(
  messages: ChatMessage[],
  portfolioContext: string
): Promise<string> {
  const systemMessage = {
    role: "system",
    content: `You are a helpful portfolio assistant.

      Here is information about this developer:

      ${portfolioContext}

      Only answer using the provided information.
      If unsure, say you don't know.`,
  };

  const response = await axios.request({
    method: "POST",
    url: process.env.DEEPSEEK_AI_URI,
    headers: {
      "x-rapidapi-key":  process.env.DEEPSEEK_AI_RAPID_API_KEY,
      "x-rapidapi-host": process.env.DEEPSEEK_AI_RAPID_API_HOST,
      "Content-Type":    "application/json",
    },
    data: {
      messages: [systemMessage, ...messages],
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 1024,
      web_access: false,
    },
  });

  const data = response.data;
  return (
    data?.result                          ||
    data?.choices?.[0]?.message?.content  ||
    data?.message                         ||
    "I couldn't generate a response. Please try again."
  );
}

export async function handleChat(
  messages: ChatMessage[],
  userId?: string
): Promise<{ 
  reply: string; 
  projectImageMap: Record<string, string>;
  workImageMap: Record<string, string>;
}> {
  const id = userId || "666b094dab43a459a391d327";

  try {
    const { context, projectImageMap, workImageMap } = await buildPortfolioContext(id);
    const reply = await sendChatMessage(messages, context);

    const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";
    const userLower = lastUserMessage.toLowerCase();

    const showProjects =
      /\b(project|projects|portfolio|built|developed|created|show me)\b/i.test(userLower);

    const showWork =
      /\b(experience|work experience|company|companies|employment|job|jobs|role|roles)\b/i.test(userLower);

    return {
      reply,
      projectImageMap: showProjects ? projectImageMap : {},
      workImageMap:    showWork     ? workImageMap    : {},
    };
  } catch (error) {
    console.error("AI Chat Error:", error);
    throw new Error("Failed to get AI response.");
  }
}