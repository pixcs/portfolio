"use server";

import { Fragment } from "react";
import NavAndDrawerLayout from "@/app/components/navlayout/NavAndDrawerLayout";
import Introduction from "@/app/components/introduction/Introduction";
import About from "@/app/components/about/About";
import Skills from "@/app/components/skills/Skills";
import Experience from "./components/experienceComponent/Experience";
import Project from "@/app/components/projectComponent/Project";
import Contact from "@/app/components/contact/Contact";
import { getSession } from "@/app/lib/action";

export default async function Home() {
  const session = await getSession();

  return (
    <Fragment>
      <NavAndDrawerLayout session={session} />
      <main>
        <Introduction session={session} />
        <About />
        <Skills />
        <Experience session={session} />
        <Project session={session}/>
        <Contact />
      </main>
    </Fragment>
  );
}
