"use server";

import { getSession } from '@/app/lib/action';
import { redirect } from 'next/navigation';
import ExpContainer from '@/app/components/experienceComponent/expContainer/ExpContainer';

const CreateNew = async () => {
  const session = await getSession();

  if (!session?.isLoggedIn) {
    redirect("/");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience`, { cache: "no-store" });
  const { list_of_experience }: ListOfExperience = await res.json();
  
  return (
    <main className='flex flex-col md:flex-row items-start gap-x-5'>
      <ExpContainer listOfExperience={list_of_experience}/>
    </main>
  )
}

export default CreateNew;