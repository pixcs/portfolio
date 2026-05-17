"use server";

import Image from "next/image";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";
import { RiMapPinLine } from "react-icons/ri";
import { LuGithub } from "react-icons/lu";
import { SlSocialFacebook } from "react-icons/sl";
import { IronSession } from "iron-session";
import { logout } from "@/app/lib/action";
import { FiEdit } from "react-icons/fi";
import { GrLinkedinOption } from "react-icons/gr";
import HeroCursorEffect from "./HeroCursorEffect";

type Props = {
  session: IronSession<SessionData> | undefined;
  profileUserId: string;
};

const Introduction = async ({ session, profileUserId }: Props) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URI}/api/admin-info/${profileUserId}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const info: AdminInfo | null = data.info;

  if (!res.ok) {
    console.error("Failed to fetch admin info");
  }

  const isOwner = session?.isLoggedIn && session?.userId === profileUserId;
  const isEmpty = !info;

  const imageSrc =
    info?.profileUrl?.startsWith("http")
      ? info.profileUrl
      : info?.profileUrl
      ? `/assets/images/profile/${info.profileUrl}`
      : "/assets/images/profile/default.png";

  // ── Full empty state for owner ────────────────────────────────────
  if (isEmpty && isOwner) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6 mt-20">
        <div className="w-24 h-24 rounded-sm bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-4xl transition-theme">
          👤
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Your portfolio is empty
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
            Start by filling in your profile information so visitors can learn about you.
          </p>
        </div>
        <Link
          href="/edit-info"
          className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <FiEdit size={15} />
          Set up your profile
        </Link>
        {/* Logout */}
        <form action={logout}>
          <button className="text-xs text-gray-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            Logout
          </button>
        </form>
      </section>
    );
  }

  // ── Empty state for visitors (not the owner) ──────────────────────
  if (isEmpty && !isOwner) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4 mt-20">
        <div className="w-24 h-24 rounded-sm bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-4xl transition-theme">
          👤
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Profile not set up yet
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs">
          This developer hasn't filled in their portfolio information yet.
        </p>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <IoMdArrowRoundBack size={15} />
          Back to home
        </Link>
      </section>
    );
  }

  // ── Normal render ─────────────────────────────────────────────────
  return (
    <>
      <section className="flex flex-col-reverse justify-center items-center md:flex-row md:justify-evenly mt-20 md:mt-24 relative px-5 md:mx-auto md:max-w-[1500px]">
        <HeroCursorEffect color={info?.colorStatus} />

        {/* ── Text column ── */}
        <div className="intro-text max-w-screen-lg md:w-1/2 flex flex-col gap-y-4 mt-16">

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white transition-theme">
            {info?.name}{" "}
            <span className="shake-effect">💡</span>
          </h1>

          {info?.about && (
            <p className="dark:text-gray-300 transition-theme">
              {info.about}
            </p>
          )}

          {info?.address && (
            <div className="flex items-center space-x-3">
              <RiMapPinLine size={24} />
              <p className="dark:text-gray-300">{info.address}</p>
            </div>
          )}

          {info?.status && (
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: info.colorStatus || "#94a3b8" }}
              />
              <p className="dark:text-gray-300">{info.status}</p>
            </div>
          )}

          <div className="flex space-x-1 items-center my-6">
            {info?.githubUrl && (
              <Link href={info.githubUrl} target="_blank">
                <LuGithub size={38} className="px-2 p-1 hovered" />
              </Link>
            )}
            {info?.facebookUrl && (
              <Link href={info.facebookUrl} target="_blank">
                <SlSocialFacebook size={38} className="px-2 py-1 hovered" />
              </Link>
            )}
            {info?.linkedUrl && (
              <Link href={info.linkedUrl} target="_blank">
                <GrLinkedinOption size={38} className="px-2 py-1 hovered" />
              </Link>
            )}
            {isOwner && (
              <Link href="/edit-info">
                <FiEdit size={38} className="px-2 py-1 hovered" />
              </Link>
            )}
            {isOwner && (
              <form action={logout}>
                <button className="px-2 py-1 hovered active:scale-95">
                  Logout
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Image column ── */}
        <div className="intro-image-wrap container relative h-[250px] w-[200px] md:h-[300px] md:w-[250px] md:max-w-xs px-3">
          <Link
            href={session?.isLoggedIn ? "/" : "/login"}
            className="group relative block w-full h-full"
          >
            <Image
              src={imageSrc}
              alt="profile-image"
              fill
              className="rounded-sm object-cover transition-all duration-300 group-hover:brightness-50"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-sm">
              {session?.isLoggedIn ? (
                <>
                  <IoMdArrowRoundBack size={28} className="text-white" />
                  <span className="text-white text-xs font-medium tracking-wide">
                    Back to Home
                  </span>
                </>
              ) : (
                <>
                  <MdLockOutline size={28} className="text-white" />
                  <span className="text-white text-xs font-medium tracking-wide">
                    Login as Admin
                  </span>
                </>
              )}
            </div>
          </Link>

          {/* Deco blocks */}
          <div className="intro-deco-v absolute top-6 md:top-12 -right-6 md:-right-11 w-4 md:w-9 min-h-full bg-gray-200 dark:bg-slate-700 transition-theme" />
          <div className="intro-deco-h absolute -bottom-6 md:-bottom-12 -right-4 md:-right-8 h-4 md:h-9 left-12 bg-gray-200 dark:bg-slate-700 transition-theme" />
        </div>

      </section>
    </>
  );
};

export default Introduction;
