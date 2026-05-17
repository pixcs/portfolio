"use server";

import { IronSession } from "iron-session";
import Image from "next/image";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import { WorkExpSchema } from "@/app/models/models";

type Props = {
    session: IronSession<SessionData> | undefined;
    profileUserId: string;
};

const Experience = async ({ session, profileUserId }: Props) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/work-experience/user/${profileUserId}`,
        { cache: "no-store" }
    );

    const data = await res.json();
    const list_of_experience: WorkExpSchema[] = data.workExp ?? [];

    const isOwner = session?.isLoggedIn && session?.userId === profileUserId;
    const isEmpty = list_of_experience.length === 0;

    return (
        <section className="py-16 bg-gray-100 dark:bg-slate-900 transition-theme relative">

            <p className="text-sm text-center font-medium px-2 py-1 mt-5 md:mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme">
                Experience
            </p>

            {/* Create button — always visible to owner */}
            {isOwner && !isEmpty && (
                <Link
                    href="/experience/create-new"
                    className="
                    absolute top-5 left-8
                    flex items-center gap-2
                    px-4 py-2
                    rounded-full
                    bg-white/80 dark:bg-slate-900/70
                    backdrop-blur-md
                    border border-gray-200/60 dark:border-slate-700/50
                    text-sm font-medium
                    text-gray-700 dark:text-gray-200
                    shadow-sm
                    hover:shadow-md
                    hover:scale-[1.02]
                    transition-all duration-200 ease-out
                    "
                >
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Create New
                    <IoMdAdd className="text-base" />
                </Link>
            )}

            {/* ── Empty state ── */}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <p className="text-4xl mb-4">💼</p>
                    {isOwner ? (
                        <>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                No experience added yet
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-6">
                                Add your work history so visitors can see where you've worked and what you've done.
                            </p>
                            <Link
                                href="/experience/create-new"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                <IoMdAdd size={15} />
                                Add experience
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                No experience listed yet
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm">
                                This developer hasn't added their work experience yet.
                            </p>
                        </>
                    )}
                </div>
            ) : (
                // ── Normal render ──
                <>
                    <p className="text-center px-8 mt-5 mb-16 text-xl dark:text-gray-300">
                        Here is a quick summary of my most recent experiences:
                    </p>
                    {list_of_experience.map((experience) => (
                        <div
                            key={experience._id.toString()}
                            className="fade-in-effect flex flex-col md:flex-row justify-between items-start md:gap-x-20 px-8 py-10 bg-white dark:bg-slate-800 shadow-xl max-w-4xl mx-5 mb-10 md:mx-10 lg:mx-auto rounded-lg transition-theme"
                        >
                            <Link href={experience.companyUrl} target="_blank">
                                <div
                                    className={`mb-4 md:my-0 p-2 rounded-md ${
                                        experience.companyName.toLowerCase().includes("acacia")
                                            ? "bg-white"
                                            : ""
                                    }`}
                                >
                                    <Image
                                        src={experience.companyLogo}
                                        alt={`${experience.companyName} logo`}
                                        width={300}
                                        height={120}
                                        className="h-auto w-50 md:w-56 lg:w-64 object-contain rounded-md"
                                    />
                                </div>
                            </Link>
                            <p className="dark:text-gray-300 md:hidden mb-5">{experience.range}</p>
                            <div>
                                <p className="text-lg font-bold mb-4">{experience.position}</p>
                                <ul className="list-disc leading-7">
                                    {experience.tasks.map((task) => (
                                        <li key={task} className="dark:text-gray-300">{task}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="hidden md:block dark:text-gray-300">{experience.range}</p>
                        </div>
                    ))}
                </>
            )}
        </section>
    );
};

export default Experience;
