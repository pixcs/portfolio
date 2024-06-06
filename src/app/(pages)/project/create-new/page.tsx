"use server";

import { getSession } from '@/app/lib/action';
import { redirect } from 'next/navigation';
import ProjectContainer from '@/app/components/projectComponent/projectContainer/ProjectContainer';

const CreateNew = async () => {
  const session = await getSession();

  if (!session?.isLoggedIn) {
    redirect("/");
  }

  //Note to myself when it comes to reading a data it should be on the server to reflect the cache: "no-store"

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/project`, { cache: "no-store" });
  const { projects }: { projects: Project[] } = await res.json();

  return (
    <main className='flex flex-col md:flex-row items-start gap-x-5'>
      <ProjectContainer projects={projects} />
    </main>
  )
}

export default CreateNew;