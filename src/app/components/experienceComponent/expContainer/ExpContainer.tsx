"use client";

import { useEffect, useState } from 'react';
import ExperienceForm from '@/app/components/form/experienceForm/ExperienceForm';
import ExperienceList from '@/app/components/experienceComponent/experiencelist/ExperienceList';
import { SiContentstack } from 'react-icons/si';

type Props = {
    listOfExperience: WorkExperience[]
}

const ExpContainer = ({ listOfExperience }: Props) => {
    const [formData, setFormData] = useState<FormExperience>({
        companyName: "",
        companyLogo: "",
        companyUrl: "",
        position: "",
        tasks: "",
        range: ""
    });
    const [tasks, setTasks] = useState<string[]>([]);
    const [selectEditWorkExp, setselectEditWorkExp] = useState<WorkExperience | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    //console.log("select edit work exp:", selectEditWorkExp);

    const editGetWorkExperience = async (id: string): Promise<void> => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience/${id}`);

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const { experience }: { experience: WorkExperience } = await res.json();
            //console.log("Edit get work experience:", experience);
            setselectEditWorkExp(experience);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const formReset = (): void => {
        setFormData({
            companyName: "",
            companyLogo: "",
            companyUrl: "",
            position: "",
            tasks: "",
            range: ""
        })
        setTasks([])
        setselectEditWorkExp(null);
    }

    useEffect(() => {
        if (selectEditWorkExp) {
            //console.log("selectEditworkexp is truthy", selectEditWorkExp);
            setFormData(() => ({
                companyName: selectEditWorkExp.companyName,
                companyLogo: selectEditWorkExp.companyLogo,
                companyUrl: selectEditWorkExp.companyUrl,
                position: selectEditWorkExp.position,
                tasks: "",
                range: selectEditWorkExp.range
            }))
            setTasks(selectEditWorkExp.tasks);
        }
    }, [selectEditWorkExp])

    return (
        <>
            <ExperienceForm
                formData={formData}
                setFormData={setFormData}
                tasks={tasks}
                setTasks={setTasks}
                selectEditWorkExp={selectEditWorkExp}
                formReset={formReset}
            />
            <section className='flex-1 md:max-h-[700px] md:overflow-y-scroll relative'>
                <h2 className='text-xl md:text-2xl font-medium p-8'>List of my previous experience</h2>
                <ExperienceList
                    listOfExperience={listOfExperience}
                    editGetWorkExperience={editGetWorkExperience}
                    formReset={formReset}
                />
                {isLoading && (
                    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-100/70 dark:bg-slate-700/70 backdrop-blur-sm'>
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-y-7'>
                            <SiContentstack size={100} className="rotate-effect" />
                            <h1 className='text-xl md:text-5xl font-bold'>Please wait...</h1>
                        </div>
                    </div>
                )}
            </section>

        </>
    )
}

export default ExpContainer;