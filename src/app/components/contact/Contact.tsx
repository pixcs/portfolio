"use client";

import { MdOutlineEmail } from "react-icons/md";
import { IoCopyOutline, IoCallOutline } from "react-icons/io5";
import { LuGithub } from "react-icons/lu";
import { SlSocialFacebook } from "react-icons/sl";
import Link from "next/link";
import { useState } from "react";
import ContactForm from "@/app/components/form/contactForm/ContactForm"

const Contact = () => {
    const [emailCopied, setEmailCopied] = useState(false);
    const [phoneNumberCopied, setPhoneNumberCopied] = useState(false);
    const [status, setStatus] = useState<string>("");

    const handleCopy = async (str: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(str);
            const regex = /@/;
            const isEmail = regex.test(str);

            if (isEmail) {
                setEmailCopied(true);
            } else {
                setPhoneNumberCopied(true);
            }

            setTimeout(() => {
                isEmail ? setEmailCopied(false) : setPhoneNumberCopied(false)
            }, 2000)
        } catch (err) {
            if (err instanceof Error) {
                console.error('Failed to copy: ', err);
            }
        }
    }

    return (
        <section
            id="contact"
            className='px-8 py-16 bg-gray-100 dark:bg-slate-900 transition-theme relative'
        >
            <p className='text-sm text-center font-medium px-2 py-1 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme'>
                Get in touch
            </p>
            <div className="flex flex-col md:flex-row gap-8 items-center md:max-w-7xl mx-auto my-5">
                <p className="block md:hidden md:text-xl text-center mt-5 mb-4 md:mb-12 dark:text-gray-300">
                    What&apos;s next? Feel free to reach out to me if you are looking <span className='md:block'> for a developer,  have a query, or simply want to connect.</span>
                </p>
                <ContactForm
                    status={status}
                    setStatus={setStatus}
                />
                <div className="flex-1 flex flex-col items-center justify-start">
                    <p className="hidden md:block  md:text-xl text-center md:mb-12 dark:text-gray-300">
                        What&apos;s next? Feel free to reach out to me if you are looking <span className='md:block'> for a developer,  have a query, or simply want to connect.</span>
                    </p>

                    <div className="flex items-center justify-center space-x-2 md:space-x-5 my-2">
                        <MdOutlineEmail size={35} className=" h-5 md:h-9" />
                        <h2 className=" text-base md:text-2xl dark:text-white font-bold">johnpatrickpapa20@gmail.com</h2>
                        <div className="relative">
                            <IoCopyOutline
                                size={40}
                                className="hovered p-2 h-8 md:h-10 cursor-pointer"
                                onClick={() => handleCopy("johnpatrickpapa20@gmail.com")}
                            />
                            <p className={`${emailCopied ? "opacity-100" : "opacity-0"} absolute  text-sm -top-8  -left-3 md:-top-7  px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded-md transition-all duration-150`}>
                                Copied!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 md:space-x-5 my-2">
                        <IoCallOutline size={30} className=" h-5 md:h-9" />
                        <h2 className=" text-base md:text-2xl dark:text-white font-bold">+63 9152967010</h2>
                        <div className="relative">
                            <IoCopyOutline
                                size={40}
                                className="hovered p-2 h-8 md:h-10 cursor-pointer"
                                onClick={() => handleCopy("+63 9152967010")}
                            />
                            <p className={`${phoneNumberCopied ? "opacity-100" : "opacity-0"} absolute  text-sm -top-8 md:-top-7 -left-3  px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded-md transition-all duration-150`}>
                                Copied!
                            </p>
                        </div>
                    </div>

                    <p className="dark:text-gray-400 text-center mt-5 md:mt-10">You may also find me on these platforms!</p>
                    <div className="flex items-center justify-center gap-x-2 my-4">
                        <Link href="https://github.com/pixcs" target="_blank">
                            <LuGithub size={40} className=" hovered p-2" />
                        </Link>
                        <Link href="https://www.facebook.com/td.nano" target="_blank">
                            <SlSocialFacebook size={40} className=" hovered p-2" />
                        </Link>
                    </div>
                </div>
            </div>

            <p className={`${status ? " visible scale-105 opacity-100" : "invisible scale-0"} fixed top-20 right-8 p-4 text-sm font-medium text-white dark:text-black bg-slate-950 dark:bg-white shadow-xl border border-slate-800 rounded-md z-50 transition-all duration-100 opacity-0`}>
                {status}
            </p>
        </section>
    )
}

export default Contact;