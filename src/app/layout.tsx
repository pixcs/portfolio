import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevFolio — Developer Portfolio Platform",
  description: "Browse portfolios from talented developers. Explore their projects, skills, and the stories behind their work.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

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
