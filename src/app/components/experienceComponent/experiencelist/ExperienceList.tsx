"use client";

import Link from 'next/link';
import Image from 'next/image';
import Edit from '@/app/components/form/experienceForm/edit/Edit';
import { TbHttpDelete } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiCheckLine } from "react-icons/ri";

type Props = {
    listOfExperience: WorkExperience[],
    editGetWorkExperience: (id: string) => Promise<void>,
    formReset: () => void
}

const ExperienceList = ({
    listOfExperience,
    editGetWorkExperience,
    formReset,
}: Props) => {
    const router = useRouter();
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [animate, setAnimate] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    const deleteTask = async (id: string): Promise<void> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience`, {
                method: "DELETE",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (!res.ok) throw new Error("Error occurred");

            closeConfirm();
            showToast("Work experience deleted successfully!");
            router.refresh();
        } catch (err) {
            if (err instanceof Error) console.error(err.message);
        }
    };

    const openConfirm = (id: string) => {
        setConfirmDeleteId(id);
        setTimeout(() => setAnimate(true), 10); // tiny delay lets the element mount first
    };

    const closeConfirm = () => {
        setAnimate(false);
        setTimeout(() => setConfirmDeleteId(null), 200); // wait for fade-out before unmounting
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
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm
                        transition-opacity duration-200 ${animate ? "opacity-100" : "opacity-0"}`}
                >
                    <div
                        className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 mx-4 w-full max-w-sm
                            transition-all duration-200 ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        <h2 className="text-lg font-semibold dark:text-white mb-1">Delete Experience</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                            Are you sure you want to delete this work experience? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeConfirm}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteTask(confirmDeleteId)}
                                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {listOfExperience.map((experience) => (
                <div
                    className="flex flex-col md:flex-col lg:flex-row justify-between items-start gap-x-14 gap-y-7 px-5 py-10 bg-white dark:bg-slate-800 shadow-xl max-w-4xl mx-8 mb-10 lg:mx-auto rounded-lg  transition-theme relative fade-in-effect"
                    key={experience._id}
                >
                    <Link href={experience.companyUrl} target='_blank'>
                        <Image
                            src={experience.companyLogo}
                            alt={`${experience.companyName} logo`}
                            width={102}
                            height={28}
                        />
                    </Link>
                    <p className="dark:text-gray-300 md:hidden">{experience.range}</p>
                    <div className='lg:w-1/2'>
                        <p className="text-lg font-bold mb-4">{experience.position}</p>
                        <ul className="list-disc leading-7 px-4">
                            {experience.tasks.map((task) => (
                                <li key={task} className="dark:text-gray-300">{task}</li>
                            ))}
                        </ul>
                    </div>
                    <p className="hidden md:block dark:text-gray-300">{experience.range}</p>
                    <Edit
                        experienceId={experience._id}
                        editGetWorkExperience={editGetWorkExperience}
                        formReset={formReset}
                    />
                    <TbHttpDelete
                        size={35}
                        className='absolute bottom-3 right-5 p-1 hovered'
                        onClick={() => openConfirm(experience._id)}
                    />
                </div>
            ))}
        </>
    );
};

export default ExperienceList;