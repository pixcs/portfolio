import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Skills | DevFolio",
    description: "Explore my technical skills, tools, and technologies I work with.",
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}