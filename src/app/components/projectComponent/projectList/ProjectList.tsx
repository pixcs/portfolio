
import Image from 'next/image';
import Link from 'next/link';
import EditProject from "@/app/components/form/projectForm/editproject/EditProject";
import { TbHttpDelete } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

type Props = {
    projects: Project[],
    getEditProject: (id: string) => Promise<void>,
    formReset: () => void
}

const ProjectList = ({ 
    projects,
    getEditProject,
    formReset
 }: Props) => {
    const router = useRouter();

    const handleDeleteProject = async (id: string): Promise<void> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ id })
            })

            const result = await res.json();

            if (!res.ok) {
                throw new Error("Error: failed to delete project");
            }

            router.refresh();
            //console.log("result:", result);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
    }



    return (
        <>
            {projects.length > 0 ?
                (<>
                    {projects.map((project, index) => (
                        <div
                            className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} md:max-w-4xl mb-12 mx-8 md:mx-auto shadow-xl dark:bg-slate-800 rounded-xl fade-in-effect`}
                            key={project._id}
                        >
                            <div className="w-full md:flex-1 h-80 md:h-96 bg-gray-100 dark:bg-slate-700 relative rounded-t-xl rounded-bl-none md:rounded-tl-xl md:rounded-bl-xl transition-theme">
                                <Link href={project.projectUrl} target="_blank">
                                    <Image
                                        src={project.projectImage}
                                        alt="project-1 image"
                                        fill
                                        className="object-cover p-8 md:p-12 md:hover:scale-105 transition-all duration-500 md:rounded-[60px]"
                                    />
                                </Link>
                            </div>

                            <div className="flex-1 flex flex-col p-8 md:p-12 gap-4 relative">
                                <h3 className="text-xl font-semibold">{project.projectName}</h3>
                                <p className="dark:text-gray-300">
                                    {project.description}
                                </p>
                                <p className="flex flex-wrap gap-2 mb-8 md:mb-0">
                                    {project.toolsAndTech.map((tools) => (
                                        <span
                                            key={tools}
                                            className=" text-sm dark:text-gray-300 px-4 py-1 bg-gray-200 dark:bg-slate-700/80 rounded-full"
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
                                    onClick={() => handleDeleteProject(project._id)}
                                />
                            </div>
                        </div>
                    ))}
                </>)
                : (<h1 className='mx-8 text-xl md:text-4xl text-center text-gray-400 font-semibold'>
                    Currently projects not found
                </h1>)
            }
        </>
    )
}

export default ProjectList;