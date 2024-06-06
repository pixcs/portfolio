"use client";

import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type ErrorResponse = { error: string };

function isErrorResponse(data: any): data is ErrorResponse {
    return (data as ErrorResponse).error !== undefined;
}

type Props = {
    formData: FormProject,
    setFormData: Dispatch<SetStateAction<FormProject>>,
    toolsAndTech: string[],
    setToolsAndTech: Dispatch<SetStateAction<string[]>>,
    selectEditProject: Project | null,
    formReset: () => void
}

const ProjectForm = ({
    formData,
    setFormData,
    toolsAndTech,
    setToolsAndTech,
    selectEditProject,
    formReset
}: Props) => {
    const { projectName, projectImage, projectUrl, description, toolsAndTechInput } = formData;
    const [toolsAndTechError, setToolsAndTechError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const addToolsAndTech = (): void => {
        if (formData.toolsAndTechInput) {
            setToolsAndTech((prevTools) => [...prevTools, formData.toolsAndTechInput]);
            setFormData((prevFormData) => ({ ...prevFormData, toolsAndTechInput: "" }))
            setToolsAndTechError(null);
        } else {
            setToolsAndTechError("You have not yet added any tools and tech you used.");
        }

        if (toolsAndTech.length > 0) {
            setToolsAndTechError(null);
        }
    }

    const deleteTasks = (id: string): void => {
        const filteredTasks = toolsAndTech.filter(tools => tools !== id);
        setToolsAndTech(filteredTasks);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ projectName, projectImage, projectUrl, description, toolsAndTech })
            })

            const data = await res.json();

            if (!res.ok) {
                if (isErrorResponse(data)) {
                    console.error("Error:", data.error);
                    setError(data.error);
                }
                return
            }

            formReset();
            router.refresh();
            console.log(data);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateProject = async (id: string): Promise<void> => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ projectName, projectImage, projectUrl, description, toolsAndTech })
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error("Error: failed to update project");
            }

            formReset();
            router.refresh();
            console.log("result", result);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    }



    const labelStyle = "dark:text-white font-medium mx-8 my-2";
    const inputStyle = "dark:text-gray-300 dark:bg-slate-900 mx-8 p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg outline-1 outline-gray-400 dark:outline-gray-800";

    return (
        <section className='w-full md:w-1/3 bg-gray-100/50 dark:bg-slate-800 py-4 md:h-[700px] md:overflow-y-scroll'>
            <form
                onSubmit={handleSubmit}
                className='flex flex-col'
            >
                <label htmlFor="project-name" className={labelStyle}>
                    Project Name <span className="text-gray-400">(required)</span>
                </label>
                <input
                    type="text"
                    id="project-name"
                    name="projectName"
                    placeholder='Project name'
                    required
                    className={inputStyle}
                    onChange={handleFormChange}
                    value={formData.projectName}
                />
                <label htmlFor="project-image-url" className={labelStyle}>
                    Project Image <span className="text-gray-400">(required)</span>
                </label>
                <input
                    type="text"
                    id="project-image-url"
                    name="projectImage"
                    placeholder='Enter image url or file directory'
                    required
                    className={inputStyle}
                    onChange={handleFormChange}
                    value={formData.projectImage}
                />
                <label htmlFor="project-url" className={labelStyle}>
                    Project Official Page <span className="text-gray-400">(required)</span>
                </label>
                <input
                    type="text"
                    id="project-url"
                    name="projectUrl"
                    placeholder='project official page'
                    required
                    className={inputStyle}
                    onChange={handleFormChange}
                    value={formData.projectUrl}
                />
                <label htmlFor="description" className={labelStyle}>
                    Description <span className="text-gray-400">(required)</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    placeholder='Give description about your project'
                    required
                    className={`${inputStyle} min-h-40`}
                    onChange={handleFormChange}
                    value={formData.description}
                />
                <label htmlFor="toolsAndTech" className={labelStyle}>
                    Tools and Technologies <span className="text-gray-400">(required)</span>
                </label>
                <div className='flex items-center flex-wrap gap-2  mx-8'>
                    <input
                        type="text"
                        id="toolsAndTech"
                        name="toolsAndTechInput"
                        placeholder='Enter the tools and technologies you used'
                        className="flex-1 dark:text-gray-300 dark:bg-slate-900 p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg outline-1 outline-gray-400 dark:outline-gray-800"
                        onChange={handleFormChange}
                        value={formData.toolsAndTechInput}
                    />
                    <button
                        className=' px-5 py-3 border-2 border-gray-200 dark:border-slate-700 bg-slate-800 dark:bg-gray-200 dark:hover:bg-white dark:text-black hover:bg-slate-900 rounded-lg text-gray-300 font-semibold active:opacity-70'
                        onClick={addToolsAndTech}
                        type="button"
                    >
                        Add
                    </button>
                </div>
                {toolsAndTechError && (
                    <p className="mx-8 my-4 text-sm text-red-500">{toolsAndTechError}</p>
                )}
                {toolsAndTech.length > 0 && (
                    <ul className="list-disc leading-7 mx-8">
                        {toolsAndTech.map((tools, index) => (
                            <li
                                key={index}
                                className="my-3 p-4 bg-gray-100 dark:bg-slate-800 overflow-y-clip relative"
                            >
                                {tools}
                                <FaXmark
                                    size={30}
                                    className="hovered p-2 absolute top-0 right-0"
                                    onClick={() => deleteTasks(tools)}
                                />
                            </li>
                        ))}
                    </ul>

                )}
                {error && (
                    <p className="mx-8 my-4 text-sm text-red-500">{error}</p>
                )}
                {selectEditProject ?
                    (<button
                        className='mx-8 my-4 py-3  border-2 border-gray-200 dark:border-slate-700 bg-slate-800 dark:bg-gray-200 dark:hover:bg-white dark:text-black hover:bg-slate-900 rounded-lg text-gray-300 font-semibold active:opacity-70'
                        type="button"
                        onClick={() => handleUpdateProject(selectEditProject._id)}
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>)
                    : (<button
                        className='mx-8 my-4 py-3  border-2 border-gray-200 dark:border-slate-700 bg-slate-800 dark:bg-gray-200 dark:hover:bg-white dark:text-black hover:bg-slate-900 rounded-lg text-gray-300 font-semibold active:opacity-70'
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Submit"}
                    </button>)
                }
            </form>
        </section>
    )
}

export default ProjectForm;