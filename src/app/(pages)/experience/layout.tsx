import { Metadata } from "next";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

export const metadata: Metadata = {
    title: "Add new work experience",
    description: "Add new information about my work experience"
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="text-gray-600 dark:text-white dark:bg-slate-900 transition-theme">
            <div className=" flex items-center justify-start bg-gradient-to-r from-gray-700 to-slate-900 dark:from-slate-800 dark:to-slate-800  dark:text-white bg-gray-100 dark:bg-slate-950">
                <div className=" w-full md:w-1/3">
                    <Link
                        href="/"
                        className="flex items-center gap-x-1 font-semibold px-4 py-2 mx-5 w-[100px] hover:bg-gray-800 hovered text-gray-200"
                    >
                        <IoMdArrowRoundBack size={40} className="h-5 md:h-10 text-gray-200" />
                        Home
                    </Link>
                </div>
                <h1 className="text-xl md:text-3xl text-white text-center font-semibold px-4 py-10">
                    Create new information about work experience
                </h1>
            </div>
            {children}
        </div>
    );
}