import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Account | DevFolio",
    description: "Create your free DevFolio account and showcase your developer portfolio to the world.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}