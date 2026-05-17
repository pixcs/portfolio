import { getSession } from '@/app/lib/action';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';
import Link from 'next/link';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Metadata } from "next";
import ExpContainer from '@/app/components/experienceComponent/expContainer/ExpContainer';

export const metadata: Metadata = {
    title: "Add new work experience",
    description: "Add new information about my work experience"
}

const CreateNew = async () => {
    const session = await getSession();

    if (!session?.isLoggedIn) {
        redirect("/");
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/work-experience/user/${session.userId}`,
        { cache: "no-store" }
    );

    const data = await res.json();
    // API returns { workExp }, map it to list_of_experience
    const list_of_experience: WorkExperience[]  = data.workExp ?? [];
    console.log('list of experience', list_of_experience);

    return (
        <Fragment>
            {/* Header */}
            <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 border-b border-slate-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/5 pointer-events-none" />
                <div className="absolute top-0 left-1/3 w-64 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                <div className="relative flex items-center gap-4 px-6 py-5">
                    <Link
                        href={`/user/${session.userId}`}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 group"
                    >
                        <IoMdArrowRoundBack
                            size={16}
                            className="group-hover:-translate-x-0.5 transition-transform duration-200"
                        />
                        Home
                    </Link>
                    <span className="text-slate-600 select-none">/</span>
                    <div className="flex flex-col">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
                            Work Experience
                        </p>
                        <h1 className="text-base md:text-lg font-semibold text-white leading-tight">
                            Add new experience
                        </h1>
                    </div>
                </div>
            </div>

            <main className='flex flex-col md:flex-row'>
                <ExpContainer
                    listOfExperience={list_of_experience}
                    session={session}
                />
            </main>
        </Fragment>
    );
}

export default CreateNew;
