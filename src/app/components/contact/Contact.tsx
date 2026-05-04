"use client";

import { MdOutlineEmail } from "react-icons/md";
import { IoCopyOutline, IoCallOutline } from "react-icons/io5";
import { LuGithub } from "react-icons/lu";
import { SlSocialFacebook } from "react-icons/sl";
import Link from "next/link";
import { useEffect, useState } from "react";
import ContactForm from "@/app/components/form/contactForm/ContactForm";
import { GrLinkedinOption } from "react-icons/gr";
import { IronSession } from "iron-session";

type Props = {
    session: IronSession<SessionData> | undefined
}

const Contact = ({ session }: Props) => {
    const [emailCopied, setEmailCopied] = useState(false);
    const [phoneNumberCopied, setPhoneNumberCopied] = useState(false);
    const [status, setStatus] = useState<string>("");

    const [info, setInfo] = useState<AdminInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const userId = session?.userId || "666b094dab43a459a391d327";

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URI}/api/admin-info/${userId}`,
                    { cache: "no-store" }
                );

                const data = await res.json();
                setInfo(data.info);
            } catch (err) {
                console.error("Failed to fetch contact info", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, []);

    const handleCopy = async (str: string) => {
        try {
            await navigator.clipboard.writeText(str);

            const isEmail = str.includes("@");

            if (isEmail) {
                setEmailCopied(true);
                setTimeout(() => setEmailCopied(false), 2000);
            } else {
                setPhoneNumberCopied(true);
                setTimeout(() => setPhoneNumberCopied(false), 2000);
            }
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const email = info?.email || "johnpatrickpapa20@gmail.com";
    const phone = info?.contactNumber || "+63 9152967010";

    return (
        <section
            id="contact"
            className="px-8 py-16 bg-gray-100 dark:bg-slate-900 transition-theme relative"
        >
            <p className="about-label text-sm text-center font-medium px-2 py-1 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme">
                Get in touch
            </p>

            <div className="about-image-col flex flex-col md:flex-row gap-8 items-center md:max-w-7xl mx-auto my-5">
                <ContactForm 
                    status={status} 
                    setStatus={setStatus}
                    infoEmail={info?.email}
                    title={info?.title}
                 />

                <div className="flex-1 flex flex-col items-center justify-start">
                    <p className="hidden md:block  md:text-xl text-center md:mb-12 dark:text-gray-300">
                        What&apos;s next? Feel free to reach out to me if you are looking <span className='md:block'> for a developer,  have a query, or simply want to connect.</span>
                    </p>

                    {/* EMAIL */}
                    <div className="intro-text flex items-center justify-center space-x-2 md:space-x-5 my-2">
                        <MdOutlineEmail size={35} className="h-5 md:h-9" />
                        <h2 className="text-sm md:text-2xl dark:text-white font-bold">
                            {loading ? "Loading..." : email}
                        </h2>

                        <div className="relative">
                            <IoCopyOutline
                                size={40}
                                className="hovered p-2 h-8 md:h-10 cursor-pointer"
                                onClick={() => handleCopy(email)}
                            />
                            <p
                                className={`${
                                    emailCopied ? "opacity-100" : "opacity-0"
                                } absolute text-sm -top-8 -left-3 md:-top-7 px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded-md transition-all`}
                            >
                                Copied!
                            </p>
                        </div>
                    </div>

                    {/* PHONE */}
                    <div className="intro-text flex items-center justify-center space-x-2 md:space-x-5 my-2">
                        <IoCallOutline size={30} className="h-5 md:h-9" />
                        <h2 className="text-sm md:text-2xl dark:text-white font-bold">
                            {loading ? "Loading..." : phone}
                        </h2>

                        <div className="relative">
                            <IoCopyOutline
                                size={40}
                                className="hovered p-2 h-8 md:h-10 cursor-pointer"
                                onClick={() => handleCopy(phone)}
                            />
                            <p
                                className={`${
                                    phoneNumberCopied ? "opacity-100" : "opacity-0"
                                } absolute text-sm -top-8 md:-top-7 -left-3 px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded-md transition-all`}
                            >
                                Copied!
                            </p>
                        </div>
                    </div>

                    <p className="dark:text-gray-400 text-center mt-5 md:mt-10">
                        You may also find me on these platforms!
                    </p>

                    {/* SOCIALS */}
                    <div className="intro-text flex items-center justify-center gap-x-2 my-4">
                        {info?.githubUrl && (
                            <Link href={info.githubUrl} target="_blank">
                                <LuGithub size={40} className="hovered p-2" />
                            </Link>
                        )}

                        {info?.facebookUrl && (
                            <Link href={info.facebookUrl} target="_blank">
                                <SlSocialFacebook size={40} className="hovered p-2" />
                            </Link>
                        )}

                        {info?.linkedUrl && (
                            <Link href={info.linkedUrl} target="_blank">
                                <GrLinkedinOption size={38} className="px-2 py-1 hovered" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* STATUS TOAST */}
            <p
                className={`${
                    status ? "visible scale-105 opacity-100" : "invisible scale-0"
                } fixed top-20 right-8 p-4 text-sm font-medium text-white dark:text-black bg-slate-950 dark:bg-white shadow-xl rounded-md z-50 transition-all duration-100`}
            >
                {status}
            </p>
        </section>
    );
};

export default Contact;