"use client";

import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useRouter } from "next/navigation";

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
    formReset: () => void
}

const ExperienceForm = ({
    formData,
    setFormData,
    tasks,
    setTasks,
    selectEditWorkExp,
    formReset
}: Props) => {
    const { companyName, companyLogo, companyUrl, position, range } = formData;
    const [tasksError, setTasksError] = useState<string | null>("");
    const [error, setError] = useState<string | null>("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { value, name } = e.currentTarget;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))

    }

    const addTasks = () => {
        if (formData.tasks) {
            setTasks((prevTasks) => [...prevTasks, formData.tasks]);
            setFormData((prevFormData) => ({ ...prevFormData, tasks: "" }))
            setTasksError(null);
        } else {
            setTasksError("You have not yet added any tasks");
        }

        if (tasks.length > 0) {
            setTasksError(null);
        }
    }

    const deleteTasks = (id: string) => {
        const filteredTasks = tasks.filter(task => task !== id);
        setTasks(filteredTasks);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ companyName, companyLogo, companyUrl, position, tasks, range })
            })
            const data = await res.json();

            if (!res.ok) {
                if (isErrorResponse(data)) {
                    console.error("Error:", data.error);
                    setError(data.error);
                }
                return
            }

            setError(null);
            formReset();
            router.refresh();
            console.log("received", data);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const updateWorkExperience = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ companyName, companyLogo, companyUrl, position, tasks, range })
            })

            if (!res.ok) {
                throw new Error("Error:  failed to update:")
            }

            const data = await res.json();
            console.log("result:", data);
            formReset();
            router.refresh();

            

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message)
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
                <input
                    type="text"
                    id="company-logo"
                    name="companyLogo"
                    placeholder='Enter url or file directory'
                    className={inputStyle}
                    onChange={handleFormChange}
                    value={formData.companyLogo}
                />
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
                <label htmlFor="position" className={labelStyle}>
                    Tasks <span className="text-gray-400">(required)</span>
                </label>
                <div className='flex items-center flex-wrap gap-2  mx-8'>
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
                        className=' px-5 py-3 border-2 border-gray-200 dark:border-slate-700 bg-slate-800 dark:bg-gray-200 dark:hover:bg-white dark:text-black hover:bg-slate-900 rounded-lg text-gray-300 font-semibold active:opacity-70'
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
                            <li
                                key={index}
                                className="my-3 p-4 bg-gray-100 dark:bg-slate-800 overflow-y-clip relative"
                            >
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
                {selectEditWorkExp ?
                    (<button
                        className='mx-8 my-4 py-3  border-2 border-gray-200 dark:border-slate-700 bg-slate-800 dark:bg-gray-200 dark:hover:bg-white dark:text-black hover:bg-slate-900 rounded-lg text-gray-300 font-semibold active:opacity-70'
                        type="button"
                        onClick={() => updateWorkExperience(selectEditWorkExp._id)}
                        disabled={loading}
                    >
                       {loading ? "Updating... please wait" : " Update"}
                    </button>)
                    : (<button
                        className='mx-8 my-4 py-3  border-2 border-gray-200 dark:border-slate-700 bg-slate-800 dark:bg-gray-200 dark:hover:bg-white dark:text-black hover:bg-slate-900 rounded-lg text-gray-300 font-semibold active:opacity-70'
                        disabled={loading}
                    >
                        {loading ? "Processing..." : " Submit"}
                    </button>)
                }

            </form>
        </section>
    )
}

export default ExperienceForm;