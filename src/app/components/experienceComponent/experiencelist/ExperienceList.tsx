"use client";

import Link from 'next/link';
import Image from 'next/image';
import Edit from '@/app/components/form/experienceForm/edit/Edit';
import { TbHttpDelete } from "react-icons/tb";
import { useRouter } from "next/navigation";

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

    const deleteTask = async (id: string): Promise<void> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ id })
            })

            if (!res.ok) {
                throw new Error("Error occured");
            }

            router.refresh();
            const data: { success: string } | { error: string } = await res.json();
            console.log(data);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
    }


    return (
        <>
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
                    <div className='lg:w-1/2 '>
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
                        onClick={() => deleteTask(experience._id)}
                    />
                </div>
            ))}
        </>
    )
}

export default ExperienceList;