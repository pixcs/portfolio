"use server";

import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import LoginForm from "@/app/components/form/loginForm/LoginForm";
import { getSession } from  "@/app/lib/action";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getSession();

  if (session?.isLoggedIn) {
    redirect("/");
  }


  return (
    <div className="dark:bg-slate-950  md:desktop-full-height">
      <h1 className="text-2xl md:text-4xl text-white bg-gradient-to-r from-gray-700 to-slate-900 dark:from-gray-900 dark:to-slate-950 font-semibold dark:text-white bg-gray-100 dark:bg-slate-950 text-center py-5">
        Welcome Admin
      </h1>
      <Link
        href="/"
        className="flex items-center gap-x-1 font-semibold px-4 py-2 mx-4 mt-5 w-[100px]  hovered"
      >
        <IoMdArrowRoundBack size={40} className="h-5 md:h-10" />
        Home
      </Link>
      <LoginForm />
    </div>
  )
}

export default Login;