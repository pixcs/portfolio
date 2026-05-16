"use server";

import { getSession } from '@/app/lib/action';
import { redirect } from 'next/navigation';
import ProjectContainer from '@/app/components/projectComponent/projectContainer/ProjectContainer';

const CreateNew = async () => {
    const session = await getSession();

    if (!session?.isLoggedIn) {
        redirect("/");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project`, { cache: "no-store" });
    const { projects }: { projects: Project[] } = await res.json();

    return (
      <main className='flex flex-col md:flex-row h-full'>
        <ProjectContainer projects={projects} session={session} />
      </main>
    )
}

export default CreateNew;