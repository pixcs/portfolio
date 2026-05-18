import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | DevFolio",
    description: "Browse my personal and professional projects, built with modern technologies.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}