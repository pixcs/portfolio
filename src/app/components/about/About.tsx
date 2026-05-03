"use client";

import Link from "next/link";
import ProfileImage from "@/app/components/about/profileImage/ProfileImage";
import { useEffect, useState } from "react";
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
};

const About = ({ session }: Props) => {
  const [about, setAbout] = useState<AboutMeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const userId = session?.userId || "666b094dab43a459a391d327";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URI}/api/about/${userId}`
        );

        const data = await res.json();

        if (res.ok) {
          setAbout(data.about);
        }
      } catch (err) {
        console.error("Failed to fetch about:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  return (
    <section
      id="about"
      className="min-h-screen mt-14 md:mt-40 py-16 bg-gray-100 dark:bg-slate-900 transition-theme relative"
    >
      {session?.isLoggedIn && session?.isAdmin && (
        <Link
          href="about-me/update-new"
          className="absolute top-5 left-8 flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border dark:border-0 border-gray-300 hover:border-gray-700 dark:border-gray-500 font-medium hover:text-black dark:text-white hover:bg-white hovered shadow-xl"
        >
          Update New <RxUpdate className="ml-2" />
        </Link>
      )}

      <p className="text-sm text-center font-medium px-2 py-1 mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme">
        About me
      </p>

      <div className="flex flex-col md:flex-row md:justify-between items-start gap-x-20 mt-10 px-5 md:px-20 md:mx-auto md:max-w-[1500px]">

        {/* Pass about so ProfileImage can use the uploaded images */}
        {!loading && about && <ProfileImage about={about} />}

        <div className="md:w-1/2">
          <h2 className="text-xl md:text-3xl font-bold mb-5 mt-20 md:mt-0">
            {about?.heading || "A little bit about me:"}
          </h2>

          {loading ? (
            <p className="dark:text-gray-300">Loading...</p>
          ) : (
            <>
              {about?.paragraphs?.length ? (
                about.paragraphs.map((p, i) => (
                  <p key={i} className="dark:text-gray-300 mb-4">
                    {p}
                  </p>
                ))
              ) : (
                <p className="dark:text-gray-300">No bio available yet.</p>
              )}

              {about?.quickFacts?.length ? (
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
