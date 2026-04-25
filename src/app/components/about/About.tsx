"use client";

import Link from "next/link";
import ProfileImage from "@/app/components/about/profileImage/ProfileImage";
import { useEffect, useRef } from "react";


const About = () => {
  const circlesRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const coords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPositions = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    // Initialize target positions for each circle
    circlesRef.current = document.querySelectorAll('.circle');
    if (circlesRef.current) {
      targetPositions.current = Array.from(circlesRef.current).map(() => ({
        x: 0,
        y: 0,
      }));
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      coords.current.x = e.clientX;
      coords.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const updateCirclePositions = () => {
      if (circlesRef.current) {
        // Update target positions for each circle
        for (let i = 0; i < circlesRef.current.length; i++) {
          const circle = circlesRef.current[i];
          const nextTarget = targetPositions.current[i - 1] || coords.current;

          targetPositions.current[i].x += (nextTarget.x - targetPositions.current[i].x) * 0.10;
          targetPositions.current[i].y += (nextTarget.y - targetPositions.current[i].y) * 0.10;

          const scale = (10 - i) / 10 + (Math.random() * 0.2 - 0.1);

          circle.style.left = `${targetPositions.current[i].x}px`;
          circle.style.top = `${targetPositions.current[i].y}px`;
          circle.style.transform = `scale(${scale})`;
        }
      }
      requestAnimationFrame(updateCirclePositions);
    };

    requestAnimationFrame(updateCirclePositions);
  }, []);


  return (
    <section
      id="about"
      className='min-h-screen mt-14 md:mt-40 py-16 bg-gray-100 dark:bg-slate-900 transition-theme'
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="circle"></div>
      ))}
      <p className=' text-sm text-center font-medium px-2 py-1 mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme'>
        About me
      </p>
      <div className="flex flex-col md:flex-row md:justify-between items-start gap-x-20 mt-10 px-5 md:px-20 md:mx-auto md:max-w-[1500px]">
        <ProfileImage />
        <div className="md:w-1/2">
          <h2 className="text-xl md:text-3xl font-bold mb-5 mt-20 md:mt-0">A little bit about me:</h2>
          <p className="dark:text-gray-300">
            I&apos;m a software developer with a strong focus on bridging the gap between technical functionality and thoughtful visual design.
            I care deeply about crafting intuitive user experiences, writing clean and maintainable code, and building digital products that perform at a high level.
          </p>
          <br />
          <p className="dark:text-gray-300">
            My journey into programming began in 2022 during my second year of college. Starting with the fundamentals and writing Java on the command line,
            my perspective shifted the moment I discovered GUIs — that&apos;s when development truly came alive for me. I challenged myself to build my first
            interactive solo project, which sparked a deeper commitment to the craft. From there, I expanded into web development, continuously growing my
            skill set and keeping pace with emerging technologies. Today, I build modern, production-ready web applications for personal projects using
            technologies such as Next.js, TypeScript, Tailwind CSS, Firebase, and more.
          </p>
          <br />
          <p className="dark:text-gray-300">
            Outside of development, I enjoy unwinding with anime, films, and PC gaming. Feel free to connect with me on{" "}
            <Link href="https://www.facebook.com/td.nano" target="_blank">
              <span className="underline">Facebook</span>
            </Link>{" "}
            or follow my work on{" "}
            <Link href="https://github.com/pixcs" target="_blank">
              <span className="underline">GitHub</span>
            </Link>.
          </p>
          <br />
          <p className="dark:text-gray-300">A few quick facts about me:</p>
          <br />
          <ul className="list-disc ml-5 grid md:grid-cols-2 leading-7 md:leading-10 dark:text-gray-300">
            <li>B.S. in Computer Science</li>
            <li>Lifelong learner</li>
            <li>Committed to growth as a developer</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
