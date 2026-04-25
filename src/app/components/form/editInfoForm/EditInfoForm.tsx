"use client";

import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { LuGithub } from 'react-icons/lu';
import { RiMapPinLine, RiCheckLine } from 'react-icons/ri';
import { SlSocialFacebook } from 'react-icons/sl';
import Image from "next/image";
import { IoMdArrowRoundBack } from 'react-icons/io';
import { CgProfile } from "react-icons/cg";
import { IronSession } from 'iron-session';

type FormAdminInfo = {
    name: string;
    about: string;
    address: string;
    colorStatus: string;
    status: string;
    githubUrl: string;
    facebookUrl: string;
    profileUrl: string;
    resumeUrl: string;
};

type Props = {
    session: IronSession<SessionData>;
    info: AdminInfo;
};

/* ─── reusable field wrapper ─── */
const Field = ({ label, children }: { label?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        {label && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                {label}
            </span>
        )}
        {children}
    </div>
);

const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg text-sm bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-slate-500 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200";

const EditInfoForm = ({ session, info }: Props) => {
    const [formData, setFormData] = useState<FormAdminInfo>({
        name: "", about: "", address: "", colorStatus: "",
        status: "", githubUrl: "", facebookUrl: "", profileUrl: "", resumeUrl: "",
    });
    const [notifStatus, setNotifStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { name, about, address, colorStatus, status, githubUrl, facebookUrl, profileUrl, resumeUrl } = formData;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        setFormData({
            name: info?.name, about: info?.about, address: info?.address,
            colorStatus: info?.colorStatus, status: info?.status,
            githubUrl: info?.githubUrl, facebookUrl: info?.facebookUrl,
            profileUrl: info?.profileUrl, resumeUrl: info?.resumeUrl,
        });
    }, [session]);

    const handleUpdateInfo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/login/${session?.userId}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ name, about, address, colorStatus, status, githubUrl, facebookUrl, profileUrl, resumeUrl }),
            });
            const result: { message: string } | { error: string } = await res.json();
            if (!res.ok) console.error("Error: failed to update info.");
            if ("message" in result) setNotifStatus(result.message);
            if ("error" in result) setNotifStatus(result.error);
        } catch (err) {
            if (err instanceof Error) console.error(err.message);
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotifStatus(""), 2500);
        }
    };

    return (
        <section className="min-h-screen bg-gray-100 dark:bg-slate-950 px-4 py-8 md:px-8">

            {/* Toast */}
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border
                bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100
                transition-all duration-300 ${notifStatus ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <RiCheckLine size={15} className="text-emerald-500" />
                {notifStatus}
            </div>

            <div className="mx-auto max-w-5xl">

                {/* Top nav */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 hovered px-3 py-2 group">
                        <IoMdArrowRoundBack size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
                        Home
                    </Link>
                    <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-slate-100">
                        Admin Info
                    </h1>
                    <div className="w-20" />{/* spacer */}
                </div>

                {/* Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-slate-700/50 shadow-xl shadow-gray-200/40 dark:shadow-slate-950/60 overflow-hidden">

                    {/* Top accent */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/50 dark:via-slate-500/50 to-transparent" />

                    <form onSubmit={handleUpdateInfo} className="flex flex-col md:flex-row gap-0">

                        {/* ── Left: form fields ── */}
                        <div className="flex-1 p-7 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-gray-200/60 dark:border-slate-700/40">

                            <Field label="Display Name">
                                <input type="text" name="name" value={name} onChange={handleChange} className={inputCls} placeholder="Your name" />
                            </Field>

                            <Field label="About">
                                <textarea name="about" value={about} onChange={handleChange} className={`${inputCls} min-h-28 resize-none`} placeholder="Write a short bio..." />
                            </Field>

                            <Field label="Location">
                                <div className="relative">
                                    <RiMapPinLine size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                    <input type="text" name="address" value={address} onChange={handleChange} className={`${inputCls} pl-9`} placeholder="City, Country" />
                                </div>
                            </Field>

                            <Field label="Status">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input type="color" name="colorStatus" value={colorStatus} onChange={handleChange}
                                            className="w-10 h-10 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 cursor-pointer outline-none p-0.5" />
                                    </div>
                                    <input type="text" name="status" value={status} onChange={handleChange} className={`${inputCls} flex-1`} placeholder="e.g. Available for work" />
                                </div>
                            </Field>

                            {/* Social links */}
                            <div className="flex flex-col gap-3 pt-1">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">Links</span>

                                {[
                                    { icon: <LuGithub size={15} />, name: "githubUrl", value: githubUrl, href: githubUrl, placeholder: "https://github.com/…" },
                                    { icon: <SlSocialFacebook size={15} />, name: "facebookUrl", value: facebookUrl, href: facebookUrl, placeholder: "https://facebook.com/…" },
                                    { icon: <CgProfile size={15} />, name: "profileUrl", value: profileUrl, href: null, placeholder: "Profile image URL" },
                                ].map(({ icon, name: n, value, href, placeholder }) => (
                                    <div key={n} className="flex items-center gap-2">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400">
                                            {href
                                                ? <Link href={href || "#"} target="_blank" className="flex items-center justify-center w-full h-full hovered rounded-lg">{icon}</Link>
                                                : icon
                                            }
                                        </div>
                                        <input type="text" name={n} value={value} onChange={handleChange} className={`${inputCls} flex-1`} placeholder={placeholder} />
                                    </div>
                                ))}

                                <Field label="Resume URL">
                                    <textarea name="resumeUrl" value={resumeUrl} onChange={handleChange} className={`${inputCls} min-h-14 resize-none`} placeholder="https://…" />
                                </Field>
                            </div>

                            {/* Save */}
                            <button
                                type="submit"
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
                                ) : "Save Changes"}
                            </button>
                        </div>

                        {/* ── Right: profile preview ── */}
                        <div className="md:w-64 p-7 flex flex-col items-center gap-5">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500 self-start">
                                Preview
                            </span>

                            {/* Profile image frame */}
                            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-lg shadow-slate-900/20 bg-gray-100 dark:bg-slate-800">
                                <Image
                                    src={profileUrl || "https://i.pinimg.com/564x/dd/af/0f/ddaf0f3a57413545d2c2b23568328b17.jpg"}
                                    alt="profile"
                                    fill
                                    className="object-cover"
                                />
                                {/* Decorative corner accents */}
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-400/40 dark:border-slate-500/40 rounded-tr-xl" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-400/40 dark:border-slate-500/40 rounded-bl-xl" />
                            </div>

                            {/* Live preview snippet */}
                            <div className="w-full rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 p-3.5 flex flex-col gap-2">
                                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{name || "—"}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colorStatus || "#94a3b8" }} />
                                    <span className="text-xs text-gray-500 dark:text-slate-400 truncate">{status || "No status"}</span>
                                </div>
                                {address && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                                        <RiMapPinLine size={11} />
                                        <span className="truncate">{address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </form>

                    {/* Bottom accent */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/40 dark:via-slate-600/40 to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default EditInfoForm;
