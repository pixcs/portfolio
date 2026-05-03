"use client";

import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { RiCheckLine } from 'react-icons/ri';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { LuPlus, LuX, LuGripVertical, LuUpload, LuImage, LuTrash2 } from 'react-icons/lu';
import type { ClientSession } from "@/app/models/models";

type QuickFact = {
    id: string;
    value: string;
};

type FormAboutMe = {
    heading: string;
    paragraphs: string[];
    quickFacts: QuickFact[];
};

type ProfileImageSlot = {
    preview: string | null;   // object URL (new) or existing blob URL
    file: File | null;        // null = unchanged
    existing: string | null;  // current blob URL stored in DB
    pathname: string | null;  // blob pathname for deletion
};

type AboutMeInfo = {
    heading?: string;
    paragraphs?: string[];
    quickFacts?: string[];
    profileImages?: string[];
    profileImagePathnames?: string[];
};

type Props = {
    session: ClientSession;
    info: AboutMeInfo | null;
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

const generateId = () => Math.random().toString(36).slice(2, 9);

const toFactItems = (facts: string[]): QuickFact[] =>
    facts.map((v) => ({ id: generateId(), value: v }));

const emptySlot = (): ProfileImageSlot => ({
    preview: null,
    file: null,
    existing: null,
    pathname: null,
});

/* ─── Image Slot Component ─── */
const ImageSlot = ({
    slot,
    index,
    onFileSelect,
    onRemove,
}: {
    slot: ProfileImageSlot;
    index: number;
    onFileSelect: (index: number, file: File) => void;
    onRemove: (index: number) => void;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) onFileSelect(index, file);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(index, file);
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                Image {index + 1}
            </span>

            {slot.preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 aspect-[4/3] bg-gray-100 dark:bg-slate-800">
                    <img
                        src={slot.preview}
                        alt={`Profile ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg backdrop-blur-sm transition"
                        >
                            <LuUpload size={12} />
                            Replace
                        </button>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="flex items-center gap-1.5 text-xs font-medium text-white bg-red-500/70 hover:bg-red-500/90 px-3 py-1.5 rounded-lg backdrop-blur-sm transition"
                        >
                            <LuTrash2 size={12} />
                            Remove
                        </button>
                    </div>
                    {slot.file && (
                        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            New
                        </span>
                    )}
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => inputRef.current?.click()}
                    className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800/70 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2.5 group"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700/60 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-slate-700 transition">
                        <LuImage size={18} className="text-gray-400 dark:text-slate-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                            Click or drag & drop
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-0.5">
                            PNG, JPG, WEBP
                        </p>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
};

/* ─── Main form ─── */
const EditAboutMeForm = ({ session, info }: Props) => {
    const [formData, setFormData] = useState<FormAboutMe>({
        heading: "",
        paragraphs: [""],
        quickFacts: [{ id: generateId(), value: "" }],
    });
    const [imageSlots, setImageSlots] = useState<[ProfileImageSlot, ProfileImageSlot]>([
        emptySlot(),
        emptySlot(),
    ]);
    const [notifStatus, setNotifStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [removedPathnames, setRemovedPathnames] = useState<string[]>([]);

    const { heading, paragraphs, quickFacts } = formData;

    useEffect(() => {
        setFormData({
            heading:    info?.heading    || "A little bit about me:",
            paragraphs: info?.paragraphs?.length ? info.paragraphs : [""],
            quickFacts: info?.quickFacts?.length
                ? toFactItems(info.quickFacts)
                : [{ id: generateId(), value: "" }],
        });

        const imgs      = info?.profileImages          ?? [];
        const pathnames = info?.profileImagePathnames  ?? [];

        setImageSlots([
            imgs[0]
                ? { preview: imgs[0], file: null, existing: imgs[0], pathname: pathnames[0] ?? null }
                : emptySlot(),
            imgs[1]
                ? { preview: imgs[1], file: null, existing: imgs[1], pathname: pathnames[1] ?? null }
                : emptySlot(),
        ]);
    }, [session, info]);

    /* ── Image handlers ── */
    const handleFileSelect = (index: number, file: File) => {
        const preview = URL.createObjectURL(file);
        setImageSlots(prev => {
            const next = [...prev] as [ProfileImageSlot, ProfileImageSlot];
            if (next[index].file) URL.revokeObjectURL(next[index].preview!);
            next[index] = { ...next[index], preview, file };
            return next;
        });
    };

    const handleRemoveImage = (index: number) => {
        setImageSlots(prev => {
            const next = [...prev] as [ProfileImageSlot, ProfileImageSlot];

            if (next[index].pathname) {
                setRemovedPathnames(prev => [...prev, next[index].pathname!]);
            }

            if (next[index].file) {
                URL.revokeObjectURL(next[index].preview!);
            }

            next[index] = emptySlot();
            return next;
        });
    };

    /* ── Heading ── */
    const handleHeadingChange = (e: ChangeEvent<HTMLInputElement>) =>
        setFormData(prev => ({ ...prev, heading: e.target.value }));

    /* ── Paragraphs ── */
    const handleParagraphChange = (index: number, value: string) => {
        setFormData(prev => {
            const updated = [...prev.paragraphs];
            updated[index] = value;
            return { ...prev, paragraphs: updated };
        });
    };

    const addParagraph = () =>
        setFormData(prev => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));

    const removeParagraph = (index: number) =>
        setFormData(prev => ({
            ...prev,
            paragraphs: prev.paragraphs.filter((_, i) => i !== index),
        }));

    /* ── Quick Facts ── */
    const handleFactChange = (id: string, value: string) =>
        setFormData(prev => ({
            ...prev,
            quickFacts: prev.quickFacts.map(f => f.id === id ? { ...f, value } : f),
        }));

    const addFact = () =>
        setFormData(prev => ({
            ...prev,
            quickFacts: [...prev.quickFacts, { id: generateId(), value: "" }],
        }));

    const removeFact = (id: string) =>
        setFormData(prev => ({
            ...prev,
            quickFacts: prev.quickFacts.filter(f => f.id !== id),
        }));

    /* ── Submit ── */
    const handleUpdateAboutMe = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const profileImages: string[]          = [];
            const profileImagePathnames: string[]  = [];

            // Step 1 — upload any newly selected files to Vercel Blob via POST /api/about/[userId]
            for (let i = 0; i < imageSlots.length; i++) {
                const slot = imageSlots[i];

                if (slot.file) {
                    const fd = new FormData();
                    fd.append("file", slot.file);
                    fd.append("slot", String(i));                          // "0" or "1"
                    if (slot.pathname) fd.append("oldPathname", slot.pathname); // delete old blob

                    const uploadRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URI}/api/about/${session?.userId}`,
                        { method: "POST", body: fd }
                    );

                    if (!uploadRes.ok) {
                        const { error } = await uploadRes.json();
                        throw new Error(error ?? "Upload failed");
                    }

                    const { url, pathname }: { url: string; pathname: string } =
                        await uploadRes.json();

                    profileImages.push(url);
                    profileImagePathnames.push(pathname);

                    // Sync local slot — clear File so the "New" badge disappears
                    setImageSlots(prev => {
                        const next = [...prev] as [ProfileImageSlot, ProfileImageSlot];
                        URL.revokeObjectURL(next[i].preview!);
                        next[i] = { preview: url, file: null, existing: url, pathname };
                        return next;
                    });

                } else if (slot.existing) {
                    // Unchanged — forward existing URL + pathname
                    profileImages.push(slot.existing ?? "");
                    profileImagePathnames.push(slot.pathname ?? "");
                }
                // empty slot → omit (removed by user)
            }

            // Step 2 — persist text fields + resolved image URLs via PUT
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/api/about/${session?.userId}`,
                {
                    method: "PUT",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({
                        heading,
                        paragraphs: paragraphs.filter(p => p.trim() !== ""),
                        quickFacts: quickFacts.map(f => f.value).filter(v => v.trim() !== ""),
                        profileImages,
                        profileImagePathnames,
                        removedPathnames,
                    }),
                }
            );

            const result: { message: string } | { error: string } = await res.json();
            if (!res.ok) console.error("Failed to update about me.");
            if ("message" in result) setNotifStatus(result.message);
            if ("error"   in result) setNotifStatus(result.error);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
                setNotifStatus(err.message);
            }
        } finally {
            setIsLoading(false);

            // reset after successful/failed request cycle
            setRemovedPathnames([]);

            setTimeout(() => setNotifStatus(""), 2500);
        }
    };

    const hasNewImages = imageSlots.some(s => s.file !== null);

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
                        About Me
                    </h1>
                    <div className="w-20" />
                </div>

                {/* Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-slate-700/50 shadow-xl shadow-gray-200/40 dark:shadow-slate-950/60 overflow-hidden">

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/50 dark:via-slate-500/50 to-transparent" />

                    <form onSubmit={handleUpdateAboutMe} className="flex flex-col md:flex-row gap-0">

                        {/* ── Left: form fields ── */}
                        <div className="flex-1 p-7 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-gray-200/60 dark:border-slate-700/40">

                            {/* Profile Images */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                                        Profile Images
                                    </span>
                                    {hasNewImages && (
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                            {imageSlots.filter(s => s.file).length} new selected
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {imageSlots.map((slot, i) => (
                                        <ImageSlot
                                            key={i}
                                            slot={slot}
                                            index={i}
                                            onFileSelect={handleFileSelect}
                                            onRemove={handleRemoveImage}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="h-px w-full bg-gray-100 dark:bg-slate-800" />

                            <Field label="Section Heading">
                                <input
                                    type="text"
                                    value={heading}
                                    onChange={handleHeadingChange}
                                    className={inputCls}
                                    placeholder="A little bit about me:"
                                />
                            </Field>

                            {/* Paragraphs */}
                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                                    Paragraphs
                                </span>

                                {paragraphs.map((para, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <div className="flex items-center justify-center mt-2.5 text-gray-300 dark:text-slate-600 cursor-grab">
                                            <LuGripVertical size={14} />
                                        </div>
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={para}
                                                onChange={(e) => handleParagraphChange(index, e.target.value)}
                                                className={`${inputCls} min-h-28 resize-none`}
                                                placeholder={`Paragraph ${index + 1}…`}
                                            />
                                            <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-300 dark:text-slate-600 select-none">
                                                {para.length}
                                            </span>
                                        </div>
                                        {paragraphs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeParagraph(index)}
                                                className="mt-2.5 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150 flex-shrink-0"
                                            >
                                                <LuX size={13} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addParagraph}
                                    className="self-start inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-150"
                                >
                                    <LuPlus size={12} />
                                    Add paragraph
                                </button>
                            </div>

                            {/* Quick Facts */}
                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                                    Quick Facts
                                </span>

                                <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 divide-y divide-gray-200 dark:divide-slate-700 overflow-hidden">
                                    {quickFacts.map((fact) => (
                                        <div key={fact.id} className="flex items-center gap-2 px-3 py-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600 flex-shrink-0" />
                                            <input
                                                type="text"
                                                value={fact.value}
                                                onChange={(e) => handleFactChange(fact.id, e.target.value)}
                                                className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                                placeholder="e.g. B.S. in Computer Science"
                                            />
                                            {quickFacts.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFact(fact.id)}
                                                    className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 flex-shrink-0"
                                                >
                                                    <LuX size={11} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={addFact}
                                    className="self-start inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-150"
                                >
                                    <LuPlus size={12} />
                                    Add fact
                                </button>
                            </div>

                            {/* Submit */}
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

                        {/* ── Right: live preview ── */}
                        <div className="md:w-72 p-7 flex flex-col gap-4">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
                                Preview
                            </span>

                            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 p-4 flex flex-col gap-3 overflow-hidden">

                                {imageSlots.some(s => s.preview) && (
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {imageSlots.map((slot, i) =>
                                            slot.preview ? (
                                                <img
                                                    key={i}
                                                    src={slot.preview}
                                                    alt={`Profile ${i + 1}`}
                                                    className="w-full aspect-square object-cover rounded-md"
                                                />
                                            ) : (
                                                <div
                                                    key={i}
                                                    className="w-full aspect-square rounded-md bg-gray-200 dark:bg-slate-700 flex items-center justify-center"
                                                >
                                                    <LuImage size={14} className="text-gray-400 dark:text-slate-500" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                <h2 className="text-base font-bold text-gray-800 dark:text-slate-100 leading-snug">
                                    {heading || "A little bit about me:"}
                                </h2>

                                <div className="flex flex-col gap-2.5">
                                    {paragraphs.filter(p => p.trim()).map((para, i) => (
                                        <p key={i} className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                                            {para}
                                        </p>
                                    ))}
                                    {!paragraphs.some(p => p.trim()) && (
                                        <p className="text-xs text-gray-400 dark:text-slate-600 italic">
                                            Your bio will appear here…
                                        </p>
                                    )}
                                </div>

                                {quickFacts.some(f => f.value.trim()) && (
                                    <div className="mt-1 pt-3 border-t border-gray-200 dark:border-slate-700">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500 mb-2">
                                            A few quick facts about me:
                                        </p>
                                        <ul className="flex flex-col gap-1">
                                            {quickFacts.filter(f => f.value.trim()).map(fact => (
                                                <li key={fact.id} className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                                                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-slate-500 flex-shrink-0" />
                                                    {fact.value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="rounded-lg bg-blue-50/60 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 p-3.5 flex flex-col gap-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-500 dark:text-slate-400">
                                    Tips
                                </span>
                                <ul className="flex flex-col gap-1">
                                    {[
                                        "Select up to 2 profile images shown side by side.",
                                        "Replacing an image automatically deletes the old blob.",
                                        "Split long bios into multiple paragraphs for readability.",
                                        "Quick facts render in a 2-column grid on the live page.",
                                        "Empty paragraphs and facts are automatically excluded.",
                                    ].map((tip, i) => (
                                        <li key={i} className="text-xs text-blue-700/80 dark:text-slate-400 leading-relaxed flex gap-1.5">
                                            <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 dark:bg-slate-500 flex-shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </form>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400/40 dark:via-slate-600/40 to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default EditAboutMeForm;
