"use client";

import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { LuGithub, LuLink } from 'react-icons/lu';
import { RiMapPinLine, RiCheckLine } from 'react-icons/ri';
import { SlSocialFacebook } from 'react-icons/sl';
import { TbSeo } from 'react-icons/tb';
import Image from "next/image";
import { IoMdArrowRoundBack } from 'react-icons/io';
import { LuUpload, LuX, LuLoader } from 'react-icons/lu';
import type { ClientSession } from "@/app/models/models";
import { GrLinkedinOption } from "react-icons/gr";
import { PiPlaceholder } from 'react-icons/pi';

type FormAdminInfo = {
    title: string,
    name: string;
    about: string;
    address: string;
    colorStatus: string;
    status: string;
    githubUrl: string;
    facebookUrl: string;
    linkedUrl: string;       
    profileUrl: string;
    resumeUrl: string;
    email: string;
    contactNumber: string;
    metadata: {               
        title: string;
        description: string;
        icons: string;
    };
};

type Props = {
    session: ClientSession;
    info: AdminInfo | null;
};

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

const FALLBACK = "https://i.pinimg.com/564x/dd/af/0f/ddaf0f3a57413545d2c2b23568328b17.jpg";

/* ─── Profile Image Uploader ─── */
const ProfileUploader = ({
    currentUrl,
    onUploadSuccess,
    userId,
}: {
    currentUrl: string;
    onUploadSuccess: (url: string) => void;
    userId: string;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = async (file: File) => {
        setError(null);

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            setError("Only JPEG, PNG, WEBP, or GIF files are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File must be under 5 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const body = new FormData();
            body.append("file", file);
            if (currentUrl) body.append("oldPathname", currentUrl);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/api/admin-info/${userId}`,
                { method: "POST", body }
            );

            const data: { url?: string; pathname?: string; error?: string } = await res.json();

            if (!res.ok || !data.url) {
                setError(data.error ?? "Upload failed.");
                setPreview(null);
                return;
            }

            onUploadSuccess(data.url);
        } catch {
            setError("Upload failed. Please try again.");
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const resolvedSrc = preview ?? (currentUrl || null);

    const clearPreview = () => {
        setPreview(null);
        setError(null);
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                Profile Image
            </span>
            <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
                    ${isDragging
                        ? "border-slate-400 dark:border-slate-400 bg-slate-100 dark:bg-slate-800"
                        : "border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800/70"
                    }`}
                style={{ minHeight: "96px" }}
            >
                {resolvedSrc ? (
                    <div className="relative w-full h-40">
                        <Image src={resolvedSrc} alt="Profile preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 text-white text-xs font-medium">
                                <LuUpload size={13} />
                                Change photo
                            </span>
                        </div>
                        {preview && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); clearPreview(); }}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors duration-150 z-10"
                            >
                                <LuX size={11} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-7 px-4 text-center">
                        {uploading ? (
                            <LuLoader size={22} className="text-slate-400 dark:text-slate-500 animate-spin" />
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                                    <LuUpload size={17} className="text-gray-400 dark:text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Click or drag to upload</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">JPEG, PNG, WEBP, GIF · max 5 MB</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
                {uploading && resolvedSrc && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <LuLoader size={22} className="text-white animate-spin" />
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleInputChange}
            />
            {error && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <LuX size={11} />
                    {error}
                </p>
            )}
        </div>
    );
};

/* ─── Main form ─── */
const EditInfoForm = ({ session, info }: Props) => {
    const [formData, setFormData] = useState<FormAdminInfo>({
        title: "",
        name: "",
        about: "",
        address: "",
        colorStatus: "",
        status: "",
        githubUrl: "",
        facebookUrl: "",
        linkedUrl: "",
        profileUrl: "",
        resumeUrl: "",
        email: "",
        contactNumber: "",
        metadata: { title: "", description: "", icons: "" },
    });
    const [notifStatus, setNotifStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        title, name, about, address, colorStatus, status,
        githubUrl, facebookUrl, linkedUrl,
        profileUrl, resumeUrl, email, contactNumber, metadata,
    } = formData;

    // Generic flat field handler
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Nested metadata handler
    const handleMetaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        setFormData(prev => ({
            ...prev,
            metadata: { ...prev.metadata, [name]: value },
        }));
    };

    useEffect(() => {
        setFormData({
            title:         info?.title        || "",
            name:          info?.name          || "",
            about:         info?.about         || "",
            address:       info?.address       || "",
            colorStatus:   info?.colorStatus   || "",
            status:        info?.status        || "",
            githubUrl:     info?.githubUrl     || "",
            facebookUrl:   info?.facebookUrl   || "",
            linkedUrl:     info?.linkedUrl     || "",
            profileUrl:    info?.profileUrl    || "",
            resumeUrl:     info?.resumeUrl     || "",
            email:         info?.email         || "",
            contactNumber: info?.contactNumber || "",
            metadata: {
                title:       info?.metadata?.title       || "",
                description: info?.metadata?.description || "",
                icons:       info?.metadata?.icons       || "",
            },
        });
    }, [session, info]);

    const handleUpdateInfo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session?.userId) return;

        setIsLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/api/admin-info/${session.userId}`,
                {
                    method: "PUT",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({
                        title,
                        name,
                        about,
                        address,
                        colorStatus,
                        status,
                        githubUrl,
                        facebookUrl,
                        linkedUrl,
                        profileUrl,
                        resumeUrl,
                        email,
                        contactNumber,
                        metadata,
                    }),
                }
            );

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);
            setNotifStatus(result.message);
        } catch (err) {
            console.error(err);
            setNotifStatus("Failed to update.");
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotifStatus(""), 2500);
        }
    };

    const previewSrc = profileUrl || FALLBACK;

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
                    <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-slate-100">Admin Info</h1>
                    <div className="w-20" />
                </div>

                {/* Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-slate-700/50 shadow-xl shadow-gray-200/40 dark:shadow-slate-950/60 overflow-hidden">

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/50 dark:via-slate-500/50 to-transparent" />

                    <form onSubmit={handleUpdateInfo} className="flex flex-col md:flex-row gap-0">

                        {/* ── Left: form fields ── */}
                        <div className="flex-1 p-7 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-gray-200/60 dark:border-slate-700/40">

                            <Field label="Title">
                                <input type="text" name="title" value={title} onChange={handleChange} className={inputCls} placeholder="Portfolio" />
                            </Field>

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
                                    <input type="color" name="colorStatus" value={colorStatus} onChange={handleChange}
                                        className="w-10 h-10 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 cursor-pointer outline-none p-0.5" />
                                    <input type="text" name="status" value={status} onChange={handleChange} className={`${inputCls} flex-1`} placeholder="e.g. Available for work" />
                                </div>
                            </Field>

                            <ProfileUploader
                                currentUrl={profileUrl}
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, profileUrl: url }))}
                                userId={session.userId!}
                            />

                            {/* ── Social & Links ── */}
                            <div className="flex flex-col gap-3 pt-1">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">Links</span>

                                {[
                                    { icon: <LuGithub size={15} />,        name: "githubUrl",   value: githubUrl,   href: githubUrl,   placeholder: "https://github.com/…" },
                                    { icon: <SlSocialFacebook size={15} />, name: "facebookUrl", value: facebookUrl, href: facebookUrl, placeholder: "https://facebook.com/…" },
                                    { icon: <GrLinkedinOption size={15} />,           name: "linkedUrl",   value: linkedUrl,   href: linkedUrl,   placeholder: "https://…" },  // new
                                ].map(({ icon, name: n, value, href, placeholder }) => (
                                    <div key={n} className="flex items-center gap-2">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400">
                                            <Link href={href || "#"} target="_blank" className="flex items-center justify-center w-full h-full hovered rounded-lg">
                                                {icon}
                                            </Link>
                                        </div>
                                        <input type="text" name={n} value={value} onChange={handleChange} className={`${inputCls} flex-1`} placeholder={placeholder} />
                                    </div>
                                ))}

                                <Field label="Resume URL">
                                    <textarea name="resumeUrl" value={resumeUrl} onChange={handleChange} className={`${inputCls} min-h-14 resize-none`} placeholder="https://…" />
                                </Field>
                            </div>

                            <Field label="Email">
                                <input type="email" name="email" value={email} onChange={handleChange} className={inputCls} placeholder="sample@gmail.com" />
                            </Field>


                            <Field label="Contact Number">
                                <input type="text" name="contactNumber" value={contactNumber} onChange={handleChange} className={inputCls} placeholder="+63 9152967010" />
                            </Field>

                            {/* ── SEO Metadata ── new section */}
                            <div className="flex flex-col gap-3 pt-1">
                                <div className="flex items-center gap-2">
                                    <TbSeo size={13} className="text-gray-400 dark:text-slate-500" />
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                                        SEO Metadata
                                    </span>
                                </div>

                                <div className="rounded-xl border border-gray-200 dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/30 p-4 flex flex-col gap-4">

                                    <Field label="Page Title">
                                        <input
                                            type="text"
                                            name="title"
                                            value={metadata.title}
                                            onChange={handleMetaChange}
                                            className={inputCls}
                                            placeholder="John Doe | Software Developer"
                                        />
                                    </Field>

                                    <Field label="Description">
                                        <textarea
                                            name="description"
                                            value={metadata.description}
                                            onChange={handleMetaChange}
                                            className={`${inputCls} min-h-20 resize-none`}
                                            placeholder="Portfolio of John Doe, Software Developer"
                                        />
                                    </Field>

                                    <Field label="Favicon URL">
                                        <div className="flex items-center gap-3">
                                            {metadata.icons && (
                                                <div className="relative flex-shrink-0 w-8 h-8 rounded-md overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800">
                                                    <Image
                                                        src={metadata.icons}
                                                        alt="favicon preview"
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                                    />
                                                </div>
                                            )}
                                            <input
                                                type="text"
                                                name="icons"
                                                value={metadata.icons}
                                                onChange={handleMetaChange}
                                                className={`${inputCls} flex-1`}
                                                placeholder="https://…/favicon.png"
                                            />
                                        </div>
                                    </Field>

                                </div>
                            </div>

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

                            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-lg shadow-slate-900/20 bg-gray-100 dark:bg-slate-800">
                                <Image src={previewSrc} alt="profile" fill className="object-cover" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-400/40 dark:border-slate-500/40 rounded-tr-xl" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-400/40 dark:border-slate-500/40 rounded-bl-xl" />
                            </div>

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

                            {/* ── Metadata preview card ── new */}
                            {(metadata.title || metadata.description || metadata.icons) && (
                                <div className="w-full rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 p-3.5 flex flex-col gap-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                                        SEO Preview
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {metadata.icons && (
                                            <div className="relative w-4 h-4 flex-shrink-0 rounded-sm overflow-hidden">
                                                <Image
                                                    src={metadata.icons}
                                                    alt="favicon"
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                                />
                                            </div>
                                        )}
                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 truncate">
                                            {metadata.title || "—"}
                                        </p>
                                    </div>
                                    {metadata.description && (
                                        <p className="text-[11px] text-gray-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                                            {metadata.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                    </form>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/40 dark:via-slate-600/40 to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default EditInfoForm;