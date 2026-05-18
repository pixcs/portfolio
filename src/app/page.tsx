"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type RegisteredUser = {
    _id: string;
    name: string;
    title?: string;
    profileImage?: string;
};

const SkeletonCard = () => (
    <div className="relative flex items-center gap-4 p-5 rounded-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="absolute top-3 bottom-3 left-0 w-1 bg-gray-200 dark:bg-slate-700" />
        <div className="w-14 h-14 rounded-sm bg-gray-200 dark:bg-slate-700 flex-shrink-0 animate-pulse" />
        <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="h-3.5 w-2/3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
    </div>
);

export default function Home() {
    const [users, setUsers] = useState<RegisteredUser[]>([]);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, sessionRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/users`, { cache: "no-store" }),
                    fetch("/api/session"),
                ]);
                const { users } = await usersRes.json();
                const sessionData = await sessionRes.json();
                setUsers(users ?? []);
                setSession(sessionData);
            } catch (err) {
                console.error(err);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500)
            }
        };

        fetchData();
    }, []);

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 transition-theme">

            {/* ── NAV ── */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/60 px-6 py-4 transition-theme">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                            {"<"}
                            <span className="text-slate-400 dark:text-slate-500">/</span>
                            {">"}
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            DevFolio
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {loading ? (
                            <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
                        ) : session?.isLoggedIn ? (
                            <Link
                                href={`/user/${session.userId}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-theme"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                                My Portfolio
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="px-4 py-2 text-sm font-medium rounded-full text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-theme">
                                    Sign in
                                </Link>
                                <Link href="/register" className="px-4 py-2 text-sm font-medium rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity">
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 px-6 pt-20 pb-24 transition-theme">
                <div className="absolute top-0 right-16 w-4 md:w-9 h-full bg-slate-800 dark:bg-slate-800/60 opacity-40" />
                <div className="absolute bottom-0 left-0 right-0 h-4 md:h-9 bg-slate-800 dark:bg-slate-800/60 opacity-20" />

                <div className="relative max-w-2xl mx-auto text-center">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-6">
                        Portfolio Platform
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
                        Developer{" "}
                        <span className="shake-effect">💡</span>{" "}
                        Portfolios
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                        Browse portfolios from talented developers. Explore their projects, skills, and the stories behind their work.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {loading ? (
                            <div className="h-11 w-40 bg-slate-700 rounded-full animate-pulse" />
                        ) : session?.isLoggedIn ? (
                            <Link href={`/user/${session.userId}`} className="px-6 py-3 text-sm font-semibold rounded-full bg-white text-slate-900 hover:opacity-90 transition-opacity">
                                View My Portfolio →
                            </Link>
                        ) : (
                            <>
                                <Link href="/register" className="px-6 py-3 text-sm font-semibold rounded-full bg-white text-slate-900 hover:opacity-90 transition-opacity">
                                    Create Portfolio
                                </Link>
                                <Link href="/login" className="px-6 py-3 text-sm font-medium rounded-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition-theme">
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats row */}
                <div className="relative mt-16 grid grid-cols-3 divide-x divide-slate-700 max-w-sm sm:max-w-none sm:flex sm:items-center sm:justify-center sm:gap-10 sm:divide-x-0 md:gap-20 mx-auto">
                    <div className="text-center px-4 sm:px-0">
                        {loading
                            ? <div className="h-7 w-8 bg-slate-700 rounded animate-pulse mx-auto mb-1" />
                            : <p className="text-xl sm:text-2xl font-bold text-white">{users?.length ?? 0}</p>
                        }
                        <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1">Developers</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-slate-700" />
                    <div className="text-center px-4 sm:px-0">
                        <p className="text-xl sm:text-2xl font-bold text-white">Free</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1">Always</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-slate-700" />
                    <div className="text-center px-4 sm:px-0">
                        <p className="text-xl sm:text-2xl font-bold text-white">Open</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1">Community</p>
                    </div>
                </div>
            </div>

            {/* ── GRID ── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                            Community
                        </p>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-theme">
                            All Developers
                        </h2>
                    </div>
                    {!loading && users?.length > 0 && (
                        <span className="text-sm text-gray-400 dark:text-slate-500 tabular-nums">
                            {users.length} {users.length === 1 ? "profile" : "profiles"}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : users?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {users.map((user) => (
                            <Link
                                key={user._id}
                                href={`/user/${user._id}`}
                                className="group relative flex items-center gap-4 p-5 rounded-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-xl dark:hover:bg-slate-800 transition-all duration-300 transition-theme"
                            >
                                <div className="absolute top-3 bottom-3 left-0 w-1 bg-gray-200 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-500 transition-colors duration-300" />
                                <div className="relative w-14 h-14 rounded-sm overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0 transition-theme">
                                    {user.profileImage ? (
                                        <Image src={user.profileImage} alt={user.name} fill className="object-cover group-hover:brightness-90 transition-all duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 dark:text-slate-500 transition-theme">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate transition-theme">{user.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate transition-theme">{user.title ?? "Developer"}</p>
                                </div>
                                <div className="w-8 h-8 rounded-sm border border-gray-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-50 dark:bg-slate-700">
                                    <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300 group-hover:translate-x-px group-hover:-translate-y-px transition-transform duration-300" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.75">
                                        <path d="M3 11L11 3M11 3H5.5M11 3V8.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <p className="text-4xl mb-4">👨‍💻</p>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-theme">No developers yet</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs mb-8 transition-theme">
                            Be the first to create your portfolio and join the community.
                        </p>
                        <Link href="/register" className="px-6 py-3 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity">
                            Get Started →
                        </Link>
                    </div>
                )}
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-8 transition-theme">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                            {"<"}
                            <span className="text-slate-400 dark:text-slate-500">/</span>
                            {">"}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-gray-300 transition-theme">DevFolio</span>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-400">
                        © {new Date().getFullYear()} | Portfolio Platform
                    </p>
                </div>
            </footer>

        </main>
    );
}