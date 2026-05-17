"use server";

import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { IronSession } from "iron-session";
import { IoMdAdd } from "react-icons/io";

type Props = {
    session: IronSession<SessionData> | undefined;
    profileUserId: string;
};

const Project = async ({ session, profileUserId }: Props) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/project?userId=${profileUserId}`,
        { cache: "no-store" }
    );

    const data = await res.json();
    const projects: Project[] = data.projects ?? [];

    const isOwner = session?.isLoggedIn && session?.userId === profileUserId;
    const isEmpty = projects.length === 0;

    return (
        <section id="project" className="min-h-screen py-20 px-8 relative">

            <p className="text-sm text-center font-medium px-2 py-1 mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme">
                Project
            </p>

            {/* Create button — only show when there is data */}
            {isOwner && !isEmpty && (
                <Link
                    href="/project/create-new"
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
                    Create Project
                    <IoMdAdd className="text-base" />
                </Link>
            )}

            {/* ── Empty state ── */}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <p className="text-4xl mb-4">🚀</p>
                    {isOwner ? (
                        <>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                No projects added yet
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-6">
                                Showcase the projects you&apos;ve built so visitors can see your work in action.
                            </p>
                            <Link
                                href="/project/create-new"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                <IoMdAdd size={15} />
                                Add your first project
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                No projects yet
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm">
                                This developer hasn&apos;t added any projects yet.
                            </p>
                        </>
                    )}
                </div>
            ) : (
                // ── Normal render ──
                <>
                    <p className="text-lg md:text-xl text-center mt-5 mb-16 dark:text-gray-300">
                        Some of the noteworthy projects I have built:
                    </p>

                    {projects.map((project, index) => (
                        <div
                            className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} md:max-w-7xl mb-12 md:mx-auto shadow-xl dark:bg-slate-800 rounded-xl fade-in-effect`}
                            key={project._id.toString()}
                        >
                            <div className="w-full md:flex-1 h-80 md:h-96 bg-gray-100 dark:bg-slate-700 relative rounded-t-xl rounded-bl-none md:rounded-tl-xl md:rounded-bl-xl transition-theme">
                                <Link href={project.projectUrl} target="_blank">
                                    <Image
                                        src={project.projectImage}
                                        alt={`${project.projectName} image`}
                                        fill
                                        className="object-cover p-8 md:p-12 md:hover:scale-105 transition-all duration-500 md:rounded-[60px]"
                                    />
                                </Link>
                            </div>

                            <div className="flex-1 flex flex-col p-8 md:p-12 gap-4">
                                <h3 className="text-xl font-semibold">{project.projectName}</h3>
                                <p className="dark:text-gray-300">{project.description}</p>
                                <p className="flex flex-wrap gap-2">
                                    {project.toolsAndTech.map((tools) => (
                                        <span
                                            className="text-sm dark:text-gray-300 px-4 py-1 bg-gray-200 dark:bg-slate-700/80 rounded-full"
                                            key={tools}
                                        >
                                            {tools}
                                        </span>
                                    ))}
                                </p>
                                <Link href={project.projectUrl} target="_blank">
                                    <FiExternalLink
                                        size={40}
                                        className="dark:text-gray-300 p-2 hover:bg-gray-200 dark:hover:bg-slate-700 transition-theme rounded-lg"
                                    />
                                </Link>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </section>
    );
};

export default Project;
