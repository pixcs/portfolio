import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | DevFolio",
    description: "Sign in to your DevFolio account to manage your developer portfolio.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}