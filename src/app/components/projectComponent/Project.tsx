"use server";

import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { IronSession } from "iron-session";
import { IoMdAdd } from "react-icons/io";

type Props = {
    session: IronSession<SessionData> | undefined
}

const Project = async ({ session }: Props) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project`, { cache: "no-store" });
    const { projects }: { projects: Project[] } = await res.json();

    return (
        <section
            id="project"
            className="min-h-screen py-20 px-8 relative"
        >
            {session?.isLoggedIn && (
                <Link
                    href="project/create-new"
                    className="absolute top-5 left-8 flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border dark:border-0 border-gray-300 hover:border-gray-700  dark:border-gray-500 font-medium hover:text-black dark:text-white hover:bg-white hovered shadow-xl"
                >
                    Create New <IoMdAdd className="ml-2" />
                </Link>
            )}
            <p className='text-sm text-center font-medium px-2 py-1 mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme'>
                Project
            </p>
            <p className="text-lg  md:text-xl text-center mt-5 mb-16 dark:text-gray-300">
                Some of the noteworthy projects I have built:
            </p>

            {projects.map((project, index) => (
                <div
                    className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} md:max-w-7xl mb-12 md:mx-auto shadow-xl dark:bg-slate-800 rounded-xl fade-in-effect "`}
                    key={project._id}
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
                                    className=" text-sm dark:text-gray-300 px-4 py-1 bg-gray-200 dark:bg-slate-700/80 rounded-full"
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
        </section>
    )
}

export default Project;