"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { RiCheckLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LuSearch, LuX } from "react-icons/lu";
import { iconRegistry } from "@/app/lib/iconRegistry";
import { SKILLS, Category } from "@/app/data/skills";
import type { SkillItem } from "@/app/models/models";

const ALL_CATEGORIES: Category[] = [
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
];

type SkillsManagerProps = {
    userId: string;
    initialSkills: SkillItem[];
};

export default function SkillsForm({
    userId,
    initialSkills,
}: SkillsManagerProps) {

    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"All" | Category>("All");

    const [notifStatus, setNotifStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() => {
        const map: Record<string, boolean> = {};

        // default all to false
        SKILLS.forEach((skill) => {
            map[skill.name] = false;
        });

        // enable server-provided skills
        initialSkills.forEach((skill) => {
            map[skill.name] = true;
        });

        return map;
    });

    // ── Toggle skill ────────────────────────────────────────────────
    const toggle = (name: string) =>
        setEnabledMap((prev) => ({
        ...prev,
        [name]: !prev[name],
    }));

    // ── Filtered skills ─────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return SKILLS.filter((s) => {
        const matchSearch =
            !q || s.name.toLowerCase().includes(q);

        const matchCat =
            activeTab === "All" || s.category === activeTab;

        return matchSearch && matchCat;
        });
    }, [query, activeTab]);

    const enabledCount =
        Object.values(enabledMap).filter(Boolean).length;

    const enabledSkills = SKILLS.filter(
        (s) => enabledMap[s.name]
    );

    // ── Group enabled skills by category ────────────────────────────
    const enabledByCategory = useMemo(() => {
        const map: Partial<Record<Category, typeof SKILLS>> = {};

        enabledSkills.forEach((s) => {
        if (!map[s.category]) map[s.category] = [];
        map[s.category]!.push(s);
        });

        return map;
    }, [enabledSkills]);

    // ── Bulk enable/disable filtered skills ─────────────────────────
    const setAllFiltered = (value: boolean) =>
        setEnabledMap((prev) => {
        const next = { ...prev };

        filtered.forEach((s) => {
            next[s.name] = value;
        });

        return next;
        });

    // ── Save to API ─────────────────────────────────────────────────
    const handleSave = async () => {
        try {
        setIsLoading(true);

        const payload = {
            enabledSkills: enabledSkills.map(
            ({ iconKey, name, color, category }) => ({
                iconKey,
                name,
                color,
                category,
            })
            ),
        };

        const res = await fetch(`/api/skills/${userId}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(
            data.error || "Failed to save skills."
            );
        }

        setNotifStatus("Skills updated successfully.");
        } catch (err) {
        console.error(err);

        setNotifStatus("Failed to update skills.");
        } finally {
        setIsLoading(false);

        setTimeout(() => {
            setNotifStatus("");
        }, 2500);
        }
    };

    return (
        <section className="min-h-screen bg-gray-100 dark:bg-slate-950 px-4 py-8 md:px-8">
        {/* ── Toast ── */}
        <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border
            bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100
            transition-all duration-300 ${
                notifStatus
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
            <RiCheckLine
                size={15}
                className="text-emerald-500"
            />
                {notifStatus}
        </div>

        <div className="mx-auto max-w-5xl">
            {/* ── Top nav ── */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 px-3 py-2 group transition-colors"
                >
                    <IoMdArrowRoundBack
                        size={16}
                        className="transition-transform duration-200 group-hover:-translate-x-1"
                    />
                    Home
                </Link>

                <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-slate-100">
                    Skills
                </h1>

                <div className="w-20" />
                </div>

                {/* ── Card ── */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-slate-700/50 shadow-xl shadow-gray-200/40 dark:shadow-slate-950/60 overflow-hidden">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/50 dark:via-slate-500/50 to-transparent" />

                <div className="flex flex-col md:flex-row gap-0">
                    {/* ── Left: skill selector ── */}
                    <div className="flex-1 p-7 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-gray-200/60 dark:border-slate-700/40">
                    {/* Search + bulk actions */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                            Select Skills
                        </span>

                        <span className="text-[10px] font-semibold text-black dark:text-white">
                            {enabledCount} of {SKILLS.length} enabled
                        </span>
                        </div>

                        {/* Search input */}
                        <div className="relative">
                        <LuSearch
                            size={13}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
                        />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) =>
                            setQuery(e.target.value)
                            }
                            placeholder="Search skills…"
                            className="w-full pl-8 pr-8 py-2 rounded-lg text-sm bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                        />

                        {query && (
                            <button
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                            >
                            <LuX size={12} />
                            </button>
                        )}
                        </div>

                        {/* Category tabs */}
                        <div className="flex flex-wrap gap-1.5">
                        {(
                            ["All", ...ALL_CATEGORIES] as const
                        ).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-150
                                ${activeTab === cat
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                                }`}
                            >
                            {cat}
                            </button>
                        ))}
                        </div>

                        {/* Enable / Disable all */}
                        <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setAllFiltered(true)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-200 text-black dark:bg-slate-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Enable all
                        </button>

                        <button
                            type="button"
                            onClick={() => setAllFiltered(false)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                            Disable all
                        </button>

                        <span className="text-[11px] text-gray-400 dark:text-slate-600 ml-1">
                            (applies to current filter)
                        </span>
                        </div>
                    </div>

                <div className="h-px w-full bg-gray-100 dark:bg-slate-800" />

                {/* Skills grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {filtered.map((skill) => {
                        const Icon =
                        iconRegistry[skill.iconKey];
                        const enabled = enabledMap[skill.name];
                        return (
                            <button
                                key={`${skill.category}-${skill.name}-${skill.iconKey}`}
                                type="button"
                                onClick={() =>
                                toggle(skill.name)
                                }
                                title={skill.category}
                                className={`
                                group relative flex flex-col items-center justify-center
                                px-2 py-3.5 rounded-xl border
                                transition-all duration-150 cursor-pointer select-none
                                ${
                                    enabled
                                    ? "bg-white dark:bg-slate-800 border-black/40 dark:border-white/40 shadow-sm shadow-black/10 dark:shadow-white/10"
                                    : "bg-gray-50 dark:bg-slate-800/30 border-gray-200 dark:border-slate-700 opacity-40"
                                }
                                `}
                            >
                                <span
                                className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full transition-colors
                                ${
                                    enabled
                                    ? "bg-black dark:bg-white"
                                    : "bg-gray-300 dark:bg-slate-600"
                                }`}
                                />

                                {Icon ? (
                                <Icon
                                    size={28}
                                    className={`${skill.color} transition-transform duration-150 group-hover:scale-110`}
                                />
                                ) : (
                                <span className="text-xs text-red-400">
                                    ?
                                </span>
                                )}

                                <p className="mt-1.5 text-[10px] font-medium dark:text-gray-300 text-gray-600 text-center leading-tight line-clamp-2">
                                {skill.name}
                                </p>
                            </button>
                        );
                    })}
                    </div>
                ) : (
                    <p className="text-sm text-center text-gray-400 dark:text-slate-500 py-8">
                         No skills match &ldquo;{query}&rdquo;
                    </p>
                )}

                {/* Save button */}
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="mt-2 w-full py-2.5 rounded-lg text-sm font-semibold tracking-wide
                    bg-gradient-to-b from-gray-700 to-slate-900 dark:from-slate-600 dark:to-slate-800
                    text-white border border-slate-700/50
                    hover:from-gray-600 hover:to-slate-800
                    disabled:opacity-60 disabled:cursor-not-allowed
                    shadow-md shadow-slate-900/20 transition duration-300"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Saving…
                        </span>
                    ) : (
                        "Save Changes"
                    )}
                </button>
                </div>

                {/* ── Right preview ── */}
                <div className="md:w-72 p-7 flex flex-col gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                        Preview
                    </span>

                    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 p-4 flex flex-col gap-3 overflow-hidden max-h-[420px] overflow-y-auto">
                        {enabledSkills.length === 0 ? (
                            <p className="text-xs text-gray-400 dark:text-slate-600 italic text-center py-4">
                                No skills enabled yet…
                            </p>
                        ) : (
                            Object.entries(enabledByCategory).map(
                                ([cat, skills]) => (
                                <div
                                    key={cat}
                                    className="flex flex-col gap-1.5"
                                >
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-600">
                                    {cat}
                                    </span>

                                    <div className="flex flex-wrap gap-1.5">
                                        {skills!.map((skill) => {
                                            const Icon =
                                                iconRegistry[
                                                skill.iconKey
                                            ];

                                            return (
                                                <div
                                                    key={`${skill.category}-${skill.name}-${skill.iconKey}`}
                                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 shadow-sm"
                                                >
                                                    {Icon && (
                                                    <Icon
                                                        size={11}
                                                        className={
                                                        skill.color
                                                        }
                                                    />
                                                    )}

                                                    <span className="text-[10px] font-medium text-gray-600 dark:text-slate-300">
                                                    {skill.name}
                                                    </span>
                                                </div>
                                            );
                                    })}
                                    </div>
                                </div>
                                )
                            )
                        )}
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/40 dark:via-slate-600/40 to-transparent" />
            </div>
        </div>
        </section>
    );
}