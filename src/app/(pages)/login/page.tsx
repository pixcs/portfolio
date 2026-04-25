"use server";

import { IoMdArrowRoundBack } from "react-icons/io";
import { RiShieldKeyholeLine } from "react-icons/ri";
import Link from "next/link";
import LoginForm from "@/app/components/form/loginForm/LoginForm";
import { getSession } from "@/app/lib/action";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getSession();

  if (session?.isLoggedIn) {
    redirect("/");
  }

  return (
    <div className="h-screen overflow-hidden md:overflow-hidden overflow-y-auto bg-gray-100 dark:bg-slate-950 flex flex-col relative">

      {/* Atmospheric background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Top-left orb */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-slate-400/10 dark:bg-slate-700/20 blur-3xl" />
        {/* Bottom-right orb */}
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-gray-400/10 dark:bg-slate-800/30 blur-3xl" />
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-slate-300/5 dark:bg-slate-700/10 blur-3xl" />
      </div>

      {/* Subtle grid texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,116,139,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Back nav */}
      <nav className="relative z-10 px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 dark:text-slate-400 hovered px-3 py-2 group"
        >
          <IoMdArrowRoundBack
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-slate-700/50 shadow-2xl shadow-gray-300/30 dark:shadow-slate-950/60 overflow-hidden">

            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/60 dark:via-slate-500/60 to-transparent" />

            {/* Card header */}
            <div className="px-8 pt-10 pb-6 text-center">
              {/* Icon badge */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-gray-700 to-slate-900 dark:from-slate-700 dark:to-slate-900 shadow-lg shadow-slate-900/30 mb-5 ring-1 ring-slate-600/30">
                <RiShieldKeyholeLine size={26} className="text-slate-200" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-slate-100">
                Welcome Back
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">
                Sign in to your admin dashboard
              </p>
            </div>

            {/* Divider */}
            <div className="mx-8 h-px bg-gray-200/70 dark:bg-slate-700/50" />

            {/* Form area */}
            <div className="px-8 py-8">
              <LoginForm />
            </div>

            {/* Bottom accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/40 dark:via-slate-600/40 to-transparent" />
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-600">
            Protected area &mdash; authorized personnel only
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
