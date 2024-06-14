"use client";

import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { LuGithub } from 'react-icons/lu';
import { RiMapPinLine } from 'react-icons/ri';
import { SlSocialFacebook } from 'react-icons/sl';
import Image from "next/image";
import { IoMdArrowRoundBack } from 'react-icons/io';
import { CgProfile } from "react-icons/cg";
import { IronSession } from 'iron-session';

type FormAdminInfo = {
    name: string,
    about: string,
    address: string,
    colorStatus: string,
    status: string,
    githubUrl: string,
    facebookUrl: string,
    profileUrl: string,
    resumeUrl: string
}

type Props = {
    session: IronSession<SessionData>,
    info: AdminInfo
}

const EditInfoForm = ({ session, info }: Props) => {
    const [formData, setFormData] = useState<FormAdminInfo>({
        name: "",
        about: "",
        address: "",
        colorStatus: "",
        status: "",
        githubUrl: "",
        facebookUrl: "",
        profileUrl: "",
        resumeUrl: ""
    });
    const [notifStatus, setNotifStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { name, about, address, colorStatus, status, githubUrl, facebookUrl, profileUrl, resumeUrl } = formData;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    useEffect(() => {
        setFormData({
            name: info?.name,
            about: info?.about,
            address: info?.address,
            colorStatus: info?.colorStatus,
            status: info?.status,
            githubUrl: info?.githubUrl,
            facebookUrl: info?.facebookUrl,
            profileUrl: info?.profileUrl,
            resumeUrl: info?.resumeUrl
        })
    }, [session])

    const handleUpdateInfo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/login/${session?.userId}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    about,
                    address,
                    colorStatus,
                    status,
                    githubUrl,
                    facebookUrl,
                    profileUrl,
                    resumeUrl
                })
            });
            const result: { message: string } | { error: string } = await res.json();

            if (!res.ok) {
                console.error("Error: failed to update info.");
            }
            
            if("message" in result) {
                setNotifStatus(result.message);
            }

            if("error" in result) {
                setNotifStatus(result.error);
            }

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotifStatus(""), 2000);
        }
    }

    return (
        <section
            className="flex flex-col-reverse justify-center items-center md:flex-row md:justify-evenly mt-10 mb-10 md:mt-10 relative px-5 md:mx-auto md:max-w-[1500px]"
        >
            <form
                onSubmit={handleUpdateInfo}
                className="max-w-screen-lg md:w-1/2 flex flex-col gap-7 mt-10 md:mt-0"
            >
                <h1 className='font-medium text-xl md:text-5xl dark:text-gray-300 py-3 hidden md:block'>Admin Info</h1>
                <div className='flex justify-between items-center'>
                    <Link
                        href="/"
                        className="flex items-center gap-x-1 font-semibold px-4 py-2 w-[100px] hovered"
                    >
                        <IoMdArrowRoundBack size={40} className="h-5 md:h-10" />
                        Home
                    </Link>
                    <button 
                      className='font-semibold p-4 hovered'
                      disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Save"}
                    </button>
                </div>
                <input
                    type="text"
                    name="name"
                    value={name}
                    className='p-3 bg-transparent ring ring-gray-500 rounded-md outline-none'
                    onChange={handleChange}
                />
                <textarea
                    name="about"
                    value={about}
                    className='p-3 bg-transparent ring ring-gray-500 rounded-md dark:text-gray-300 transition-theme min-h-40 outline-none'
                    onChange={handleChange}
                />
                <div className="flex items-center space-x-3">
                    <RiMapPinLine size={40} />
                    <input
                        type="text"
                        name="address"
                        className='p-3 bg-transparent ring ring-gray-500 rounded-md dark:text-gray-300 outline-none'
                        onChange={handleChange}
                        value={address}
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="color"
                        name="colorStatus"
                        className='outline-none w-10'
                        onChange={handleChange}
                        value={colorStatus}
                    />
                    <input
                        type="text"
                        name="status"
                        className='p-3 bg-transparent ring ring-gray-500 rounded-md dark:text-gray-300 outline-none'
                        onChange={handleChange}
                        value={status}
                    />
                </div>

                <div className="flex flex-col gap-7">
                    <div className='flex space-x-2 items-center'>
                        <Link href={githubUrl} target="_blank">
                            <LuGithub size={41} className="px-2 p-1 hovered" />
                        </Link>
                        <input
                            type="text"
                            name="githubUrl"
                            className='p-3 bg-transparent ring ring-gray-500 rounded-md dark:text-gray-300 w-full outline-none '
                            onChange={handleChange}
                            value={githubUrl}
                        />
                    </div>
                    <div className='flex space-x-2 items-center'>
                        <Link href={facebookUrl} target="_blank">
                            <SlSocialFacebook size={38} className="px-2 py-1 hovered" />
                        </Link>
                        <input
                            type="text"
                            name="facebookUrl"
                            className='p-3 bg-transparent ring ring-gray-500 rounded-md dark:text-gray-300 w-full outline-none '
                            onChange={handleChange}
                            value={facebookUrl}
                        />
                    </div>
                    <div className='flex space-x-2 items-center'>
                        <CgProfile size={41} className="px-2 py-1 hovered" />
                        <input
                            type="text"
                            name="profileUrl"
                            className='p-3 bg-transparent ring ring-gray-500 rounded-md dark:text-gray-300 w-full outline-none'
                            onChange={handleChange}
                            value={profileUrl}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row gap-7  space-x-2'>
                        <label htmlFor="resumeUrl" className='text-nowrap'>Resume URL</label>
                        <textarea
                            name="resumeUrl"
                            id="resumeUrl"
                            className='p-3 bg-transparent ring ring-gray-500 rounded-md dark:text-gray-300 w-full outline-none min-h-14'
                            onChange={handleChange}
                            value={resumeUrl}
                        />
                    </div>
                </div>
            </form>

         
            <div className="container relative h-[250px] w-[200px] md:h-[300px] md:w-[250px]  md:max-w-xs px-3">
                {info.profileUrl && (
                    <Image
                        src={profileUrl ? profileUrl : "https://i.pinimg.com/564x/dd/af/0f/ddaf0f3a57413545d2c2b23568328b17.jpg"}
                        alt="profile-image"
                        fill
                        className="rounded-sm"
                    />
                )}
                <div className="absolute top-6 md:top-12 -right-6 md:-right-11 w-4 md:w-9 min-h-full  bg-gray-200 dark:bg-slate-700 transition-theme" />{/* right */}
                <div className="absolute -bottom-6 md:-bottom-12 -right-4 md:-right-8 h-4 md:h-9 left-12 bg-gray-200 dark:bg-slate-700 transition-theme" /> {/* bottom */}
            </div>
            <h1 className='font-medium text-xl md:text-5xl dark:text-gray-300 py-3 block md:hidden my-3'>Admin Info</h1>
            <p className={`${notifStatus ? " visible scale-105 opacity-100" : "invisible scale-0"} fixed top-10 right-8 p-4 text-sm font-medium text-white dark:text-black bg-slate-950 dark:bg-white shadow-xl border border-slate-800 rounded-md z-50 transition-all duration-100 opacity-0`}>
                {notifStatus}
            </p>
        </section>
    )
}

export default EditInfoForm;