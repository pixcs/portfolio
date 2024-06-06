import { IoLogoJavascript } from "react-icons/io5";
import { SiTypescript, SiMongodb } from "react-icons/si";
import {
    FaHtml5,
    FaReact,
    FaJava,
    FaGitAlt
} from "react-icons/fa";
import { IoLogoCss3 } from "react-icons/io";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { IoLogoFirebase } from "react-icons/io5";

const Skills = () => {
    const containerStyle = "flex flex-col justify-center items-center gap-y-2";
    const titleStyle = "dark:text-gray-300 font-semibold";

    return (
        <section className="py-20 fade-in-effect">
            <p className='text-sm text-center font-medium px-2 py-1 mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme'>
                Skills
            </p>
            <p className=" text-lg md:text-xl text-center pt-5 pb-16 px-8 dark:text-gray-300">
                The skills, tools and technologies i am using:
            </p>

            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-y-10 justify-center mx-5 md:mx-auto md:max-w-7xl">
                <div className={containerStyle}>
                    <IoLogoJavascript size={80} className=" text-yellow-400 bg-slate-900 dark:bg-transparent hover-scale" />
                    <p className={titleStyle}>Javascript</p>
                </div>
                <div className={containerStyle}>
                    <SiTypescript size={75} className=" text-sky-600 dark:bg-white dark:rounded-md hover-scale" />
                    <p className={titleStyle}>Typescript</p>
                </div>
                <div className={containerStyle}>
                    <FaHtml5 size={80} className=" text-orange-500 dark:bg-white dark:rounded-md hover-scale" />
                    <p className={titleStyle}>HTML5</p>
                </div>
                <div className={containerStyle}>
                    <IoLogoCss3 size={80} className="text-sky-700 dark:bg-white dark:rounded-md hover-scale" />
                    <p className={titleStyle}>CSS</p>
                </div>
                <div className={containerStyle}>
                    <FaReact size={80} className="text-sky-500 hover-scale" />
                    <p className={titleStyle}>React</p>
                </div>
                <div className={containerStyle}>
                    <FaReact size={80} className="text-sky-500  bg-slate-800 p-2 rounded-md hover-scale" />
                    <p className={titleStyle}>React Native</p>
                </div>
                <div className={containerStyle}>
                    <RiNextjsFill size={80} className="text-black dark:text-white hover-scale" />
                    <p className={titleStyle}>Next.js</p>
                </div>
                <div className={containerStyle}>
                    <FaJava size={80} className="text-orange-500  hover-scale" />
                    <p className={titleStyle}>Java</p>
                </div>
                <div className={containerStyle}>
                    <SiMongodb size={80} className="text-green-800 dark:bg-white rounded-full hover-scale" />
                    <p className={titleStyle}>MongoDB</p>
                </div>
                <div className={containerStyle}>
                    <RiTailwindCssFill size={80} className="text-sky-500 hover-scale" />
                    <p className={titleStyle}>Tailwindcss</p>
                </div>
                <div className={containerStyle}>
                    <IoLogoFirebase size={80} className="text-amber-500 hover-scale" />
                    <p className={titleStyle}>Firebase</p>
                </div>
                <div className={containerStyle}>
                    <FaGitAlt size={80} className="text-orange-600 hover-scale" />
                    <p className={titleStyle}>Git</p>
                </div>
            </div>
        </section>
    )
}

export default Skills;