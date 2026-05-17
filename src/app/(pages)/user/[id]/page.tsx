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
import { AdminInfoModel } from "@/app/models/models";
import mongoose from "mongoose";
import type { Metadata } from "next";

type Props = {
    params: { id: string };
};

// ── Per-user metadata ─────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        await connectToDB();

        const { id } = params;

        if (!mongoose.isValidObjectId(id)) {
            return { title: "DevFolio" };
        }

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

// ── Page ──────────────────────────────────────────────────────────────
export default async function UserPortfolio({ params }: Props) {
    const session = await getSession();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/${params.id}`,
        { cache: "no-store" }
    );

    if (!res.ok) notFound();

    const { user } = await res.json();
    console.log('User id:', user);

    return (
        <Fragment>
            <NavAndDrawerLayout session={session} />
            <main>
                <Introduction
                    session={session}
                    profileUserId={user._id}
                />
                <About
                    session={session}
                    profileUserId={user._id}
                />
                <Skills
                    session={session}
                    profileUserId={user._id}
                />
                <Experience
                    session={session}
                    profileUserId={user._id}
                />
                <Project
                    session={session}
                    profileUserId={user._id}
                />
                <Contact
                    session={session}
                    profileUserId={user._id}
                />
                <AIChatAssistant
                    session={session}
                    profileUserId={user._id}
                />
            </main>
            <footer>
                <p className="text-sm md:text-base flex items-center justify-center dark:text-gray-400 px-8 py-6">
                    © {new Date().getFullYear()} | All rights reserved ❤️ {user.name}
                </p>
            </footer>
        </Fragment>
    );
}
