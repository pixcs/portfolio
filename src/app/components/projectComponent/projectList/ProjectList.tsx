"use client";

import Image from 'next/image';
import Link from 'next/link';
import EditProject from "@/app/components/form/projectForm/editproject/EditProject";
import { TbHttpDelete } from 'react-icons/tb';
import { RiCheckLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
    projects: Project[],
    getEditProject: (id: string) => Promise<void>,
    formReset: () => void
}

const ProjectList = ({ projects, getEditProject, formReset }: Props) => {
    const router = useRouter();
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [animate, setAnimate] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    const openConfirm = (id: string) => {
        setConfirmDeleteId(id);
        setTimeout(() => setAnimate(true), 10);
    };

    const closeConfirm = () => {
        setAnimate(false);
        setTimeout(() => setConfirmDeleteId(null), 200);
    };

    const handleDeleteProject = async (id: string): Promise<void> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project`, {
                method: "DELETE",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (!res.ok) throw new Error("Error: failed to delete project");

            closeConfirm();
            showToast("Project deleted successfully!");
            router.refresh();
        } catch (err) {
            if (err instanceof Error) console.error(err.message);
        }
    };

    return (
        <>
            {/* Toast */}
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm
                font-medium shadow-xl border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700
                text-gray-800 dark:text-slate-100 transition-all duration-300
                ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            >
                <RiCheckLine size={15} className="text-emerald-500" />
                {toast}
            </div>

            {/* Confirmation Modal */}
            {confirmDeleteId && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm
                    transition-opacity duration-200 ${animate ? "opacity-100" : "opacity-0"}`}
                >
                    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 mx-4 w-full max-w-sm
                        transition-all duration-200 ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        <h2 className="text-lg font-semibold dark:text-white mb-1">Delete Project</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                            Are you sure you want to delete this project? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeConfirm}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteProject(confirmDeleteId)}
                                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {projects.length > 0 ? (
                projects.map((project, index) => (
                    <div
                        className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} md:max-w-4xl mb-12 mx-4 md:mx-auto shadow-xl dark:bg-slate-800 rounded-xl fade-in-effect`}
                        key={project._id}
                    >
                        <div className="w-full md:flex-1 h-80 md:h-96 bg-gray-100 dark:bg-slate-700 relative rounded-t-xl rounded-bl-none md:rounded-tl-xl md:rounded-bl-xl transition-theme">
                            <Link href={project.projectUrl} target="_blank">
                                <Image
                                    src={project.projectImage}
                                    alt="project image"
                                    fill
                                    className="object-cover p-8 md:p-12 md:hover:scale-105 transition-all duration-500 md:rounded-[60px]"
                                />
                            </Link>
                        </div>
                        <div className="flex-1 flex flex-col p-8 md:p-12 gap-4 relative">
                            <h3 className="text-xl font-semibold">{project.projectName}</h3>
                            <p className="dark:text-gray-300">{project.description}</p>
                            <p className="flex flex-wrap gap-2 mb-8 md:mb-0">
                                {project.toolsAndTech.map((tools) => (
                                    <span
                                        key={tools}
                                        className="text-sm dark:text-gray-300 px-4 py-1 bg-gray-200 dark:bg-slate-700/80 rounded-full"
                                    >
                                        {tools}
                                    </span>
                                ))}
                            </p>
                            <EditProject
                                projectId={project._id}
                                getEditProject={getEditProject}
                                formReset={formReset}
                            />
                            <TbHttpDelete
                                size={35}
                                className='absolute bottom-3 right-5 p-1 hovered'
                                onClick={() => openConfirm(project._id)}
                            />
                        </div>
                    </div>
                ))
            ) : (
                <h1 className='mx-8 text-xl md:text-4xl text-center text-gray-400 font-semibold'>
                    Currently projects not found
                </h1>
            )}
        </>
    );
};

export default ProjectList;