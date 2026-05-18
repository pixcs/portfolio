import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Me | DevFolio",
    description: "Learn more about my background, experience, and passion for development.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}