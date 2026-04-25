import { Metadata } from "next";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

export const metadata: Metadata = {
    title: "Add new project",
    description: "Add new project for John Patrick Papa"
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen text-gray-600 dark:text-white bg-white dark:bg-slate-900 transition-theme">

            {/* Header */}
            <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 border-b border-slate-700/50">

                {/* Subtle background accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/5 pointer-events-none" />
                <div className="absolute top-0 left-1/3 w-64 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                <div className="relative flex items-center gap-4 px-6 py-5">

                    {/* Back button */}
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 group"
                    >
                        <IoMdArrowRoundBack
                            size={16}
                            className="group-hover:-translate-x-0.5 transition-transform duration-200"
                        />
                        Home
                    </Link>

                    {/* Divider */}
                    <span className="text-slate-600 select-none">/</span>

                    {/* Title */}
                    <div className="flex flex-col">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
                            Projects
                        </p>
                        <h1 className="text-base md:text-lg font-semibold text-white leading-tight">
                            Add new project
                        </h1>
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
}