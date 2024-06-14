"use server";

import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine } from "react-icons/ri";
import { LuGithub } from "react-icons/lu";
import { SlSocialFacebook } from "react-icons/sl";
import { IronSession } from "iron-session";
import { logout } from "@/app/lib/action";
import { FiEdit } from "react-icons/fi";

type Props = {
  session: IronSession<SessionData> | undefined
}

const Introduction = async ({ session }: Props) => {
  const alternative = session?.userId ? session?.userId : "666b094dab43a459a391d327";
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/login/${alternative}`, { cache: "no-store" });
  const { admin: { info } }: { admin: UserInfo } = await res.json();
  console.log("Introduction:", info);

  if(!res.ok) {
    console.error("something went wrong");
  }

  return (
    <section
      className="flex flex-col-reverse justify-center items-center md:flex-row md:justify-evenly mt-20 md:mt-24 relative px-5 md:mx-auto md:max-w-[1500px]"
    >
      <div className=" max-w-screen-lg md:w-1/2 flex flex-col gap-y-4 mt-16 ">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white transition-theme">
          {info?.name} <p className="inline-block shake-effect">👋</p>
        </h1>
        <p className="dark:text-gray-300 transition-theme">
          {info?.about}
        </p>

        <div className="flex items-center space-x-3">
          <RiMapPinLine size={24} />
          <p className="dark:text-gray-300">{info?.address}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div 
            className=" w-3 h-3 rounded-full  animate-pulse" 
            style={{ backgroundColor: info?.colorStatus }}
          />
          <p className="dark:text-gray-300">{info?.status}</p>
        </div>

        <div className="flex space-x-1 items-center my-6">
          <Link href={info?.githubUrl} target="_blank">
            <LuGithub size={38} className="px-2 p-1 hovered" />
          </Link>

          <Link href={info?.facebookUrl} target="_blank">
            <SlSocialFacebook size={38} className="px-2 py-1 hovered" />
          </Link>

          {session?.isLoggedIn && session?.isAdmin && (
            <Link href="edit-info">
              <FiEdit
                size={38}
                className="px-2 py-1 hovered"
              />
            </Link>
          )}

          {session?.isLoggedIn && (
            <form action={logout}>
              <button className=" px-2 py-1 hovered active:scale-95">
                Logout
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="container relative h-[250px] w-[200px] md:h-[300px] md:w-[250px]  md:max-w-xs px-3">
        <Link href={`${session?.isLoggedIn ? "/" : "login"}`}>
          <Image
            src={info?.profileUrl}
            alt="profile-image"
            fill
            className="rounded-sm"
          />
        </Link>
        <div className="absolute top-6 md:top-12 -right-6 md:-right-11 w-4 md:w-9 min-h-full  bg-gray-200 dark:bg-slate-700 transition-theme" />{/* right */}
        <div className="absolute -bottom-6 md:-bottom-12 -right-4 md:-right-8 h-4 md:h-9 left-12 bg-gray-200 dark:bg-slate-700 transition-theme" /> {/* bottom */}
      </div>
    </section>
  )
}

export default Introduction