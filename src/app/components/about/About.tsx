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
          <h2 className="text-xl md:text-3xl font-bold mb-5 mt-20 md:mt-0">Curious about me? Here you have it:</h2>
          <p className="dark:text-gray-300">I&apos;m a passionate software developer, I am very enthusiatic about bringing the technical and visual aspects
            of digital product to life. User experience, and writing clear, readable, highly performant code matters to me.
          </p>
          <br />
          <p className="dark:text-gray-300">
            I began my curiosity about programming when I was in my 2nd year in college in 2022. During that time, I have basic knowledge about
            programming and writing java code on terminal was my focus. After learning about GUIs (Graphical User Interfaces), that&apos;s where I enjoyed
            programming and built my very first interactive solo project as a challenge to myself. After that, I decided to learn web development from the start to expand my knowledge. Since then, I&apos;ve
            continued to grow and evolve as an aspiring developer, taking on new challenges and learning the latest technologies along the way. Now,
            I&apos;m building cutting edge web applications, mostly for my personal projects using modern technologies such as Next.js, TypeScript, Tailwind CSS, Firebase, and much more.
          </p>
          <br />
          <p className="dark:text-gray-300">
            When I&apos;m not in developer-mode, you can expect me doing things i like such as watching anime and movies, or playing computer games.
            You can add me on  <Link href="https://www.facebook.com/td.nano" target="_blank">
              <span className="underline">Facebook</span>
            </Link> or you can follow me on <Link href="https://github.com/pixcs" target="_blank">
              <span className="underline">GitHub</span>
            </Link>.
          </p>
          <br />
          <p className="dark:text-gray-300">Finally, some quick bits about me.</p>
          <br />
          <ul className="list-disc ml-5 grid  md:grid-cols-2 leading-7 md:leading-10 dark:text-gray-300">
            <li>B.S. in Computer Science</li>
            <li>Avid Learner</li>
            <li>Aspiring to be a great developer.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;