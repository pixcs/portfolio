import { IronSession } from "iron-session";
import Image from "next/image";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";

type Props = {
    session: IronSession<SessionData> | undefined
}

const Experience = async ({ session }: Props) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/work-experience`, { cache: "no-store" });
    const { list_of_experience }: ListOfExperience = await res.json();

    return (
        <section className="py-16 bg-gray-100 dark:bg-slate-900 transition-theme relative">
            {session?.isLoggedIn && (
                <Link
                    href="experience/create-new"
                    className="absolute top-5 left-8 flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border dark:border-0 border-gray-300 hover:border-gray-700  dark:border-gray-500 font-medium hover:text-black dark:text-white hover:bg-white hovered shadow-xl"
                >
                    Create New <IoMdAdd className="ml-2" />
                </Link>
            )}
            <p className='text-sm text-center font-medium px-2 py-1 mt-5 md:mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme'>
                Experience
            </p>
            <p className="text-center px-8 mt-5 mb-16 text-xl dark:text-gray-300">
                Here is a quick summary of my most recent experiences:
            </p>
            {list_of_experience.map((experience) => (
                <div
                    key={experience._id}
                    className="fade-in-effect flex flex-col md:flex-row justify-between items-start md:gap-x-20  px-8 py-10 bg-white dark:bg-slate-800 shadow-xl max-w-4xl mx-5 mb-10 md:mx-10 lg:mx-auto rounded-lg  transition-theme"
                >
                    <Link href={experience.companyUrl} target="_blank">
                        <Image
                            src={experience.companyLogo}
                            alt={`${experience.companyName} logo`}
                            width={150}
                            height={28}
                            className="mb-4 md:my-0"
                        />
                    </Link>
                    <p className="dark:text-gray-300 md:hidden mb-5">{experience.range}</p>
                    <div>
                        <p className="text-lg font-bold mb-4">{experience.position}</p>
                        <ul className="list-disc leading-7">
                            {experience.tasks.map((task) => (
                                <li key={task} className="dark:text-gray-300">{task}</li>
                            ))}
                        </ul>
                    </div>
                    <p className="hidden md:block dark:text-gray-300">{experience.range}</p>
                </div>
            ))}
        </section>
    )
}

export default Experience;