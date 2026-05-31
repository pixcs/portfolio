"use server";

import { Fragment } from "react";
import { notFound } from "next/navigation";
import { getSession } from "@/app/lib/action";
import NavAndDrawerLayout from "@/app/components/navlayout/NavAndDrawerLayout";
import Introduction from "@/app/components/introduction/Introduction";
import About from "@/app/components/about/About";
import Skills from "@/app/components/skills/Skills";
import Experience from "@/app/components/experienceComponent/Experience";
import Project from "@/app/components/projectComponent/Project";
import Contact from "@/app/components/contact/Contact";
import AIChatAssistant from "@/app/components/chat/AIChatAssistant";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminInfoModel, SkillItem, WorkExpSchema } from "@/app/models/models";
import mongoose from "mongoose";
import type { Metadata } from "next";
import Link from "next/link";
import { GoHome } from "react-icons/go";

type Props = {
    params: Promise<{ id: string }>;
};

// Per-user metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { id } = await params;

        if (!mongoose.isValidObjectId(id)) {
        return { title: "DevFolio" };
        }

        await connectToDB();

        const info = await AdminInfoModel.findOne({
        userId: new mongoose.Types.ObjectId(id),
        }).lean();

        const meta = info?.metadata;

        const iconUrl =
        typeof meta?.icons === "string" && meta.icons.trim().length > 0
            ? meta.icons.trim()
            : "/favicon.ico";

        return {
        title: meta?.title || info?.name || "DevFolio",
        description: meta?.description || info?.about || "",
        icons: {
            icon: iconUrl,
            shortcut: iconUrl,
            apple: iconUrl,
        },
        };
    } catch (error) {
        console.error("Metadata error:", error);
        return {
        title: "DevFolio",
        icons: { icon: "/favicon.ico" },
        };
    }
}

export default async function UserPortfolio({ params }: Props) {
    const { id } = await params;
    const seconds = 60;

    // ── All fetches in parallel ───────────────────────────────────────
    const [session, userRes, infoRes, aboutRes, skillsRes, workExpRes, projectsRes] =
        await Promise.all([
        getSession(),
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/users/${id}`, {
            next: { revalidate: seconds },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/admin-info/${id}`, {
            next: { revalidate: seconds },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/about/${id}`, {
            next: { revalidate: seconds },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/skills/${id}`, {
            next: { revalidate: seconds },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience/user/${id}`, {
            next: { revalidate: seconds },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project?userId=${id}`, {
            next: { revalidate: seconds },
        }),
        ]);

    if (!userRes.ok) notFound();

    // ── Parse all responses in parallel ──────────────────────────────
    const [{ user }, infoData, aboutData, skillsData, workExpData, projectsData] =
        await Promise.all([
            userRes.json(),
            infoRes.ok     ? infoRes.json()     : Promise.resolve({ info: null }),
            aboutRes.ok    ? aboutRes.json()    : Promise.resolve({ about: null }),
            skillsRes.ok   ? skillsRes.json()   : Promise.resolve({ enabledSkills: [] }),
            workExpRes.ok  ? workExpRes.json()  : Promise.resolve({ workExp: [] }),
            projectsRes.ok ? projectsRes.json() : Promise.resolve({ projects: [] }),
        ]);

    const info: AdminInfo | null     = infoData.info            ?? null;
    const about: AboutMeInfo | null  = aboutData.about          ?? null;
    const enabledSkills: SkillItem[] = skillsData.enabledSkills ?? [];
    const workExp: WorkExpSchema[]   = workExpData.workExp      ?? [];
    const projects: Project[]        = projectsData.projects    ?? [];

    return (
        <Fragment>
            <NavAndDrawerLayout
                session={session}
                profileUserId={user._id}
                title={user.title}
            />

            {/* ── Fixed home button — left center ── */}
            <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 group">
                <Link
                    href="/"
                    aria-label="Go back to home page"
                    className="
                        flex items-center justify-center
                        w-10 h-10 rounded-full
                        bg-white/80 dark:bg-slate-800/80
                        backdrop-blur-md
                        border border-gray-200/60 dark:border-slate-700/50
                        shadow-md
                        text-gray-600 dark:text-slate-300
                        hover:scale-110 hover:shadow-lg
                        hover:text-slate-900 dark:hover:text-white
                        transition-all duration-200 ease-out
                    "
                >
                    <GoHome size={18} />
                </Link>

                {/* Tooltip */}
                <div className="
                    pointer-events-none
                    absolute left-12 top-1/2 -translate-y-1/2
                    px-2.5 py-1.5 rounded-md
                    bg-slate-900 dark:bg-white
                    text-white dark:text-slate-900
                    text-xs font-medium whitespace-nowrap
                    shadow-md
                    opacity-0 scale-95 -translate-x-1
                    group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0
                    transition-all duration-200 ease-out
                ">
                    Go back to home page
                    {/* Arrow */}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-white" />
                </div>
            </div>

            <main>
                <Introduction
                    session={session}
                    profileUserId={user._id}
                    info={info}
                />
                <About
                    session={session}
                    profileUserId={user._id}
                    about={about}
                />
                <Skills
                    session={session}
                    profileUserId={user._id}
                    enabledSkills={enabledSkills}
                />
                <Experience
                    session={session}
                    profileUserId={user._id}
                    workExp={workExp}
                />
                <Project
                    session={session}
                    profileUserId={user._id}
                    projects={projects}
                />
                <Contact
                    session={session}
                    profileUserId={user._id}
                    info={info}
                />
                <AIChatAssistant
                    profileUserId={user._id}
                    username={user.username}
                />
            </main>

            <footer>
                <p className="text-sm md:text-base flex items-center justify-center dark:text-gray-400 px-8 py-6">
                    © {new Date().getFullYear()} | All rights reserved ❤️ {user.title}
                </p>
            </footer>
        </Fragment>
    );
}
