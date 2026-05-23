"use server";

import Link from "next/link";
import ProfileImage from "@/app/components/about/profileImage/ProfileImage";
import { RxUpdate } from "react-icons/rx";
import { IronSession } from "iron-session";

type AboutMeInfo = {
  heading?: string;
  paragraphs?: string[];
  quickFacts?: string[];
  profileImages?: string[];
};

type Props = {
  session: IronSession<SessionData> | undefined;
  profileUserId: string;
  about: AboutMeInfo | null; 
};

const About = ({ session, profileUserId, about }: Props) => {
  const isOwner = session?.isLoggedIn && session?.userId === profileUserId;

  const isEmpty =
    !about ||
    (!about.paragraphs?.length &&
      !about.quickFacts?.length &&
      !about.profileImages?.length);

  return (
    <section
      id="about"
      className="min-h-screen mt-14 md:mt-40 pt-16 pb-32 bg-gray-100 dark:bg-slate-900 transition-theme relative"
    >
      {/* Update button — only visible to owner when there's content */}
      {isOwner && !isEmpty && (
        <Link
          href="/about-me/update-new"
          className="
            absolute top-5 left-8
            flex items-center gap-2
            px-4 py-2
            rounded-full
            bg-white/80 dark:bg-slate-900/70
            backdrop-blur-md
            border border-gray-200/60 dark:border-slate-700/50
            text-sm font-medium
            text-gray-700 dark:text-gray-200
            shadow-sm
            hover:shadow-md
            hover:scale-[1.02]
            transition-all duration-200 ease-out
          "
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Update About
          <RxUpdate className="text-base" />
        </Link>
      )}

      <p className="about-label text-sm text-center font-medium px-2 py-1 mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme">
        About me
      </p>

      {isEmpty ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
          <p className="text-4xl mb-4">📝</p>
          {isOwner ? (
            <>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Your about section is empty
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-6">
                Tell visitors who you are, your background, and a few quick
                facts about yourself.
              </p>
              <Link
                href="/about-me/update-new"
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <RxUpdate size={14} />
                Fill in your about
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Nothing here yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm">
                This developer hasn&apos;t added their about section yet.
              </p>
            </>
          )}
        </div>
      ) : (
        // Normal render
        <div className="flex flex-col md:flex-row md:items-center gap-x-16 gap-y-16 mt-16 px-5 md:px-20 md:mx-auto md:max-w-[1500px]">
          <div className="about-image-col flex-shrink-0 pl-10 md:pl-16 mr-10">
            <ProfileImage about={about} />
          </div>

          <div className="intro-text md:w-1/2">
            <h2 className="text-xl md:text-3xl font-bold mb-5 mt-10 md:mt-0">
              {about.heading || "A little bit about me:"}
            </h2>

            {about.paragraphs?.map((p, i) => (
              <p key={i} className="dark:text-gray-300 mb-4">
                {p}
              </p>
            ))}

            {about.quickFacts?.length ? (
              <>
                <p className="dark:text-gray-300 mt-6 mb-3">
                  A few quick facts about me:
                </p>
                <ul className="list-disc ml-5 grid md:grid-cols-2 leading-7 md:leading-10 dark:text-gray-300">
                  {about.quickFacts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
