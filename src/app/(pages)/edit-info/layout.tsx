import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Settings | DevFolio",
    description: "Manage your profile information, security settings, and account preferences.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}