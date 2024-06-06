"use client";

import ProjectForm from "@/app/components/form/projectForm/ProjectForm";
import ProjectList from "@/app/components/projectComponent/projectList/ProjectList";
import { useEffect, useState } from "react";
import { SiContentstack } from "react-icons/si";

type Props = {
    projects: Project[]
}

const ProjectContainer = ({ projects }: Props) => {
    const [formData, setFormData] = useState<FormProject>({
        projectName: "",
        projectImage: "",
        projectUrl: "",
        description: "",
        toolsAndTechInput: ""
    });
    const [toolsAndTech, setToolsAndTech] = useState<string[]>([]);
    const [selectEditProject, setSelectEditProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    //console.log("Project form:", formData);
    //console.log(toolsAndTech);
    //console.log("select edit project", selectEditProject);

    const getEditProject = async (id: string): Promise<void> => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project/${id}`);

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const { project }: { project: Project } = await res.json();
            //console.log("Edit get project", project);
            setSelectEditProject(project);

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
            projectName: "",
            projectImage: "",
            projectUrl: "",
            description: "",
            toolsAndTechInput: ""
        })
        setToolsAndTech([])
        setSelectEditProject(null);
    }

    useEffect(() => {
        if (selectEditProject) {
            setFormData(() => ({
                projectName: selectEditProject.projectName,
                projectImage: selectEditProject.projectImage,
                projectUrl: selectEditProject.projectUrl,
                description: selectEditProject.description,
                toolsAndTechInput: ""
            }))
            setToolsAndTech(selectEditProject.toolsAndTech);
        }
    }, [selectEditProject])

    return (
        <>
            <ProjectForm
                formData={formData}
                setFormData={setFormData}
                toolsAndTech={toolsAndTech}
                setToolsAndTech={setToolsAndTech}
                selectEditProject={selectEditProject}
                formReset={formReset}
            />
            <section className="flex-1 md:max-h-[700px] md:overflow-y-scroll relative">
                <h2 className='text-2xl font-medium p-8'>List of my projects</h2>
                <ProjectList
                    projects={projects}
                    getEditProject={getEditProject}
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

export default ProjectContainer;