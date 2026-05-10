"use client";

import { useState, useMemo, useEffect } from "react";
import { iconRegistry } from "@/app/lib/iconRegistry";
import { SKILLS } from "@/app/data/skills";
import { IronSession } from "iron-session";
import { RxUpdate } from "react-icons/rx";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Language",
  "Frontend",
  "Backend",
  "Mobile",
  "Database",
  "DevOps",
  "Cloud",
  "AI/ML",
  "Testing",
  "CMS",
  "Design",
  "Tool",
  "OS",
  "Blockchain",
] as const;

type Props = {
  session: IronSession<SessionData> | undefined;
};

type SkillItem = {
  iconKey: string;
  name: string;
  color: string;
  category: string;
};

const Skills = ({ session }: Props) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [enabledMap, setEnabledMap] = useState<
    Record<string, boolean>
  >({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = session?.userId || "666b094dab43a459a391d327";

    const fetchSkills = async () => {
      try {
        setIsLoading(true);


        const res = await fetch(`/api/skills/${userId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch skills.");
        }

        const data = await res.json();

        const nextMap: Record<string, boolean> = {};

        // default all to false
        SKILLS.forEach((skill) => {
          nextMap[skill.name] = false;
        });

        // enable returned skills
        data.enabledSkills.forEach((skill: SkillItem) => {
          nextMap[skill.name] = true;
        });

        setEnabledMap(nextMap);
      } catch (err) {
        console.error(err);

        // fallback to default hardcoded skills
        const fallback: Record<string, boolean> = {};

        SKILLS.forEach((skill) => {
          fallback[skill.name] = skill.enabled;
        });

        setEnabledMap(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchSkills();
    }
  }, [session?.userId]);

  // ── Filtered skills ───────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return SKILLS.filter((s) => {
      const isEnabled = enabledMap[s.name];
      const matchesSearch =
        !q || s.name.toLowerCase().includes(q);

      const matchesTab =
        activeTab === "All" || s.category === activeTab;

      return isEnabled && matchesSearch && matchesTab;
    });
  }, [query, activeTab, enabledMap]);

  // ── Only show tabs that have enabled skills ──────────────────
  const activeCats = useMemo(() => {
    const cats = new Set(
      SKILLS.filter((s) => enabledMap[s.name]).map(
        (s) => s.category
      )
    );

    return CATEGORIES.filter(
      (c) => c === "All" || cats.has(c as any)
    );
  }, [enabledMap]);

  if (isLoading) {
    return (
      <section className="py-24 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-slate-500">
          <span className="w-4 h-4 rounded-full border-2 border-slate-400/30 border-t-slate-600 animate-spin" />
          Loading skills...
        </div>
      </section>
    );
  }

  return (
    <section 
      id="skills" 
      className="py-24 fade-in-effect"
    >
      {session?.isLoggedIn && session?.isAdmin && (
        <Link
          href="skills/update-new"
          className="absolute top-5 left-8 flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border dark:border-0 border-gray-300 hover:border-gray-700 dark:border-gray-500 font-medium hover:text-black dark:text-white hover:bg-white hovered shadow-xl"
        >
          Update New <RxUpdate className="ml-2" />
        </Link>
      )}

      {/* ── Header ── */}
      <p className="text-sm text-center font-medium px-3 py-1 rounded-full bg-gray-200 max-w-[140px] mx-auto dark:bg-slate-700 transition-theme">
        Skills
      </p>

      <p className="text-lg md:text-xl text-center pt-5 px-8 dark:text-gray-300">
        Tools, technologies &amp; frameworks I work with
      </p>

      {/* ── Controls ── */}
      <div className="mt-8 mb-4 flex flex-col items-center gap-4 px-6">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a skill…"
            className="
              w-full px-4 py-2 rounded-xl text-sm
              bg-white/60 dark:bg-slate-800/40
              border border-gray-200 dark:border-slate-700
              backdrop-blur-md shadow-sm
              placeholder:text-gray-400 dark:placeholder:text-slate-500
              dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-sky-400/50
              transition-all duration-200
            "
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {activeCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                ${
                activeTab === cat
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Count ── */}
      <p className="text-center text-xs text-gray-400 dark:text-slate-500 mb-8">
        Showing {filtered.length} skill
        {filtered.length !== 1 ? "s" : ""}
        {query ? ` matching "${query}"` : ""}
      </p>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6 mx-auto max-w-6xl px-6">
          {filtered.map((skill, i) => {
            const Icon = iconRegistry[skill.iconKey];

            if (!Icon) {
              console.warn(
                `[Skills] Missing icon in registry: "${skill.iconKey}"`
              );

              return null;
            }

            return (
              <div
                key={`${skill.name}-${i}`}
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
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-sky-500/10 to-purple-500/10" />

                <Icon
                  size={42}
                  className={`${skill.color} relative z-10 transition-transform duration-300 group-hover:scale-110`}
                />

                <p className="mt-3 text-sm font-medium dark:text-gray-200 relative z-10 text-center">
                  {skill.name}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 mt-8 text-gray-400 dark:text-slate-500">
          <p className="text-sm">
            No skills found
            {query ? ` for "${query}"` : ""}.
          </p>

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setActiveTab("All");
              }}
              className="text-xs text-sky-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Skills;