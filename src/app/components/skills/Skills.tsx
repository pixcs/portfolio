"use client";

import {
  IoLogoJavascript,
  IoLogoCss3,
  IoLogoFirebase,
} from "react-icons/io5";
import {
  SiTypescript,
  SiMongodb,
  SiJquery,
} from "react-icons/si";
import {
  FaHtml5,
  FaReact,
  FaJava,
  FaGitAlt,
  FaLaravel,
  FaUbuntu,
  FaPhp,
  FaVuejs,
} from "react-icons/fa";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { GrGraphQl, GrMysql } from "react-icons/gr";

const skills = [
  { icon: IoLogoJavascript, name: "JavaScript", color: "text-yellow-400" },
  { icon: SiTypescript, name: "TypeScript", color: "text-sky-600" },
  { icon: FaHtml5, name: "HTML5", color: "text-orange-500" },
  { icon: IoLogoCss3, name: "CSS3", color: "text-sky-700" },
  { icon: FaReact, name: "React", color: "text-sky-500" },
  { icon: FaReact, name: "React Native", color: "text-sky-500" },
  { icon: RiNextjsFill, name: "Next.js", color: "dark:text-white text-black" },
  { icon: FaJava, name: "Java", color: "text-orange-500" },
  { icon: SiMongodb, name: "MongoDB", color: "text-green-700" },
  { icon: RiTailwindCssFill, name: "Tailwind", color: "text-sky-500" },
  { icon: IoLogoFirebase, name: "Firebase", color: "text-amber-500" },
  { icon: GrGraphQl, name: "GraphQL", color: "text-pink-500" },
  { icon: FaGitAlt, name: "Git", color: "text-orange-600" },
  { icon: GrMysql, name: "MySQL", color: "text-blue-500" },
  { icon: FaPhp, name: "PHP", color: "text-indigo-500" },
  { icon: FaVuejs, name: "Vue", color: "text-green-500" },
  { icon: FaUbuntu, name: "Ubuntu", color: "text-orange-500" },
  { icon: FaLaravel, name: "Laravel", color: "text-red-500" },
  { icon: SiJquery, name: "jQuery", color: "text-blue-500" },
];

const Skills = () => {
  return (
    <section className="py-24 fade-in-effect">
      {/* Header */}
      <p className="text-sm text-center font-medium px-3 py-1 rounded-full bg-gray-200 max-w-[140px] mx-auto dark:bg-slate-700 transition-theme">
        Skills
      </p>

      <p className="text-lg md:text-xl text-center pt-5 pb-14 px-8 dark:text-gray-300">
        Tools, technologies & frameworks I work with
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6 mx-auto max-w-6xl px-6">
        {skills.map((skill, i) => {
          const Icon = skill.icon;

          return (
            <div
              key={i}
              className="
                group relative flex flex-col items-center justify-center
                p-6 rounded-2xl
                bg-white/60 dark:bg-slate-800/40
                backdrop-blur-md
                border border-gray-200 dark:border-slate-700
                shadow-sm hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              {/* Glow background */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-sky-500/10 to-purple-500/10" />

              {/* Icon */}
              <Icon
                size={42}
                className={`${skill.color} relative z-10 transition-transform duration-300 group-hover:scale-110`}
              />

              {/* Label */}
              <p className="mt-3 text-sm font-medium dark:text-gray-200 relative z-10">
                {skill.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;