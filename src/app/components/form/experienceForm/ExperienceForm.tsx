"use client";

import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { RiCheckLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { IronSession } from "iron-session";

type ErrorResponse = { error: string };

function isErrorResponse(data: any): data is ErrorResponse {
    return (data as ErrorResponse).error !== undefined;
}

type Props = {
    formData: FormExperience,
    setFormData: Dispatch<SetStateAction<FormExperience>>,
    tasks: string[],
    setTasks: Dispatch<SetStateAction<string[]>>,
    selectEditWorkExp: WorkExperience | null,
    formReset: () => void,
    session: IronSession<SessionData> | undefined
}

const ExperienceForm = ({
    formData,
    setFormData,
    tasks,
    setTasks,
    selectEditWorkExp,
    formReset,
    session
}: Props) => {
    const { companyName, companyLogo, companyUrl, position, range } = formData;
    const [tasksError, setTasksError] = useState<string | null>("");
    const [error, setError] = useState<string | null>("");
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [logoPreview, setLogoPreview] = useState<string | null>(
        selectEditWorkExp?.companyLogo ?? null
    );
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Sync preview when switching to edit mode
    useEffect(() => {
        setLogoPreview(selectEditWorkExp?.companyLogo ?? null);
        setLogoFile(null);
    }, [selectEditWorkExp]);

    // Add this new handler
    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 2500);
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { value, name } = e.currentTarget;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const addTasks = () => {
        if (formData.tasks) {
            setTasks((prevTasks) => [...prevTasks, formData.tasks]);
            setFormData((prevFormData) => ({ ...prevFormData, tasks: "" }));
            setTasksError(null);
        } else {
            setTasksError("You have not yet added any tasks");
        }

        if (tasks.length > 0) {
            setTasksError(null);
        }
    };

    const deleteTasks = (id: string) => {
        const filteredTasks = tasks.filter(task => task !== id);
        setTasks(filteredTasks);
    };

    // Shared helper to build the FormData payload
    const buildFormData = () => {
        const body = new FormData();
        body.append("userId", session?.userId as string);
        body.append("companyName", companyName);
        body.append("companyUrl", companyUrl);
        body.append("position", position);
        body.append("range", range);
        body.append("tasks", JSON.stringify(tasks));
        if (logoFile) body.append("companyLogo", logoFile);
        return body;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!session?.userId) { setError("Not authenticated"); return; }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience`, {
                method: "POST",
                body: buildFormData(), // No Content-Type header — browser sets multipart boundary
            });

            const data = await res.json();
            if (!res.ok) { if (isErrorResponse(data)) setError(data.error); return; }

            setError(null);
            showSuccess("Work experience created successfully!");
            setLogoPreview(null);
            setLogoFile(null);
            formReset();
            router.refresh();
        } catch (err) {
            if (err instanceof Error) console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateWorkExperience = async (id: string) => {
        setLoading(true);
        try {
            if (!session?.userId) { setError("Not authenticated"); return; }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience/${id}`, {
                method: "PUT",
                body: buildFormData(),
            });

            if (!res.ok) { const data = await res.json(); if (isErrorResponse(data)) setError(data.error); return; }

            setError(null);
            showSuccess("Work experience updated successfully!");
            setLogoPreview(null);
            setLogoFile(null);
            formReset();
            router.refresh();
        } catch (err) {
            if (err instanceof Error) console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = "dark:text-white font-medium mx-8 my-2";
    const inputStyle = "dark:text-gray-300 dark:bg-slate-900 mx-8 p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg outline-1 outline-gray-400 dark:outline-gray-800";

    return (
        <section className='w-full md:w-1/3 bg-gray-100/50 dark:bg-slate-800 py-4 md:h-[700px] md:overflow-y-scroll relative'>

            {/* Success Toast */}
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border
                bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100
                transition-all duration-300 ${success ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <RiCheckLine size={15} className="text-emerald-500" />
                {success}
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col'>

                <label htmlFor="company-name" className={labelStyle}>
                    Company name <span className="text-gray-400">(required)</span>
                </label>
                <input
                    type="text"
                    id="company-name"
                    name="companyName"
                    placeholder='Company name'
                    required
                    className={inputStyle}
                    onChange={handleFormChange}
                    value={formData.companyName}
                />

                <label htmlFor="company-logo" className={labelStyle}>
                    Company Logo <span className="text-gray-400">(optional)</span>
                </label>
                <div className="mx-8 flex flex-col gap-2">
                    <label
                        htmlFor="company-logo"
                        className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed
                            border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer
                            hover:border-gray-400 dark:hover:border-slate-500 transition-colors"
                    >
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Company logo preview"
                                className="h-16 w-16 object-contain rounded"
                            />
                        ) : (
                            <>
                                <span className="text-gray-400 dark:text-slate-500 text-2xl">🖼️</span>
                                <span className="text-sm text-gray-500 dark:text-slate-400">
                                    Click to upload logo
                                </span>
                            </>
                        )}
                        <input
                            type="file"
                            id="company-logo"
                            name="companyLogo"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                        />
                    </label>
                    {logoPreview && (
                        <button
                            type="button"
                            onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                            className="text-xs text-red-400 hover:text-red-500 self-start"
                        >
                            Remove image
                        </button>
                    )}
                </div>

                <label htmlFor="companyUrl" className={labelStyle}>
                    Company Official page <span className="text-gray-400">(optional)</span>
                </label>
                <input
                    type="text"
                    id="companyUrl"
                    name="companyUrl"
                    placeholder='Paste company official page'
                    className={inputStyle}
                    onChange={handleFormChange}
                    value={formData.companyUrl}
                />

                <label htmlFor="position" className={labelStyle}>
                    Position <span className="text-gray-400">(required)</span>
                </label>
                <input
                    type="text"
                    id="position"
                    name="position"
                    placeholder='Position'
                    required
                    className={inputStyle}
                    onChange={handleFormChange}
                    value={formData.position}
                />

                <label htmlFor="tasks" className={labelStyle}>
                    Tasks <span className="text-gray-400">(required)</span>
                </label>
                <div className='flex items-center flex-wrap gap-2 mx-8'>
                    <input
                        type="text"
                        id="tasks"
                        name="tasks"
                        placeholder='Tasks you are doing'
                        className="flex-1 dark:text-gray-300 dark:bg-slate-900 p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg outline-1 outline-gray-400 dark:outline-gray-800"
                        onChange={handleFormChange}
                        value={formData.tasks}
                    />
                    <button
                        className='px-5 py-3 border-2 border-gray-200 dark:border-slate-700 bg-slate-800 dark:bg-gray-200 dark:hover:bg-white dark:text-black hover:bg-slate-900 rounded-lg text-gray-300 font-semibold active:opacity-70'
                        onClick={addTasks}
                        type="button"
                    >
                        Add
                    </button>
                </div>

                {tasksError && (
                    <p className="mx-8 my-4 text-sm text-red-500">{tasksError}</p>
                )}

                {tasks.length > 0 && (
                    <ul className="list-disc leading-7 mx-8">
                        {tasks.map((task, index) => (
                            <li key={index} className="my-3 p-4 bg-gray-100 dark:bg-slate-800 overflow-y-clip relative">
                                {task}
                                <FaXmark
                                    size={30}
                                    className="hovered p-2 absolute top-0 right-0"
                                    onClick={() => deleteTasks(task)}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <label htmlFor="range" className={labelStyle}>
                    Range of job experience <span className="text-gray-400">(required)</span>
                </label>
                <input
                    type="text"
                    id="range"
                    name="range"
                    placeholder='Ex. 1 - 2 yrs'
                    required
                    className={inputStyle}
                    onChange={handleFormChange}
                    value={formData.range}
                />

                {error && (
                    <p className="mx-8 my-2 text-sm text-red-500">{error}</p>
                )}

                {selectEditWorkExp ? (
                    <button
                        className="relative mx-8 my-4 w-[calc(100%-4rem)] py-3 rounded-lg text-sm font-semibold tracking-wide overflow-hidden
                            bg-gradient-to-b from-slate-800 to-slate-900 dark:from-white dark:to-gray-200
                            text-white dark:text-black border border-slate-700/50
                            hover:from-slate-700 hover:to-slate-800 dark:hover:from-gray-100 dark:hover:to-gray-300
                            disabled:opacity-60 disabled:cursor-not-allowed
                            shadow-md shadow-slate-900/20 transition duration-300"
                        type="button"
                        onClick={() => updateWorkExperience(selectEditWorkExp._id)}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black animate-spin" />
                                Updating...
                            </span>
                        ) : "Update"}
                    </button>
                ) : (
                    <button
                        className="relative mx-8 my-4 w-[calc(100%-4rem)] py-3 rounded-lg text-sm font-semibold tracking-wide overflow-hidden
                            bg-gradient-to-b from-slate-800 to-slate-900 dark:from-white dark:to-gray-200
                            text-white dark:text-black border border-slate-700/50
                            hover:from-slate-700 hover:to-slate-800 dark:hover:from-gray-100 dark:hover:to-gray-300
                            disabled:opacity-60 disabled:cursor-not-allowed
                            shadow-md shadow-slate-900/20 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black animate-spin" />
                                Processing...
                            </span>
                        ) : "Submit"}
                    </button>
                )}

            </form>
        </section>
    );
};

export default ExperienceForm;
