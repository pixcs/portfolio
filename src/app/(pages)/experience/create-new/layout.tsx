import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Experience | DevFolio",
    description: "My professional work experience, roles, and career journey as a developer.",
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}