import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

import { connectToDB } from "@/app/lib/connectToDB";
import { AdminInfoModel } from "@/app/models/models";
import mongoose from "mongoose";
import { getSession } from "@/app/lib/action"; 

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectToDB();

    const session = await getSession();
    const userId = session?.userId || "666b094dab43a459a391d327";

    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid userId");
    }

    const info = await AdminInfoModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    const meta = info?.metadata;

    const iconUrl =
      typeof meta?.icons === "string" && meta.icons.trim().length > 0
        ? meta.icons.trim()
        : "/favicon.ico";

    return {
      title: meta?.title || "PIC",
      description: meta?.description || "",
      icons: {
        icon: iconUrl,
        shortcut: iconUrl,
        apple: iconUrl,
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);

    return {
      title: "PIC",
      description: "",
      icons: {
        icon: "/favicon.ico", // fallback always safe
      },
    };
  }
}

/**
 * Prevent caching issues (important for dynamic metadata)
 */
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-gray-600 dark:text-white dark:bg-slate-950 transition-theme`}
      >
        <NextTopLoader
          color="linear-gradient(to right,#06b6d4,#3b82f6)"
          height={3}
          showSpinner={false}
          crawl={true}
          easing="ease"
          speed={200}
        />
        {children}
      </body>
    </html>
  );
}