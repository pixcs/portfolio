"use client";

import Image from "next/image";
import { useState } from "react";

type AboutMeInfo = {
    heading?: string;
    paragraphs?: string[];
    quickFacts?: string[];
    profileImages?: string[];
};

type Props = {
    about: AboutMeInfo;
};

const ProfileImage = ({ about }: Props) => {
    const [hover, setHover] = useState<boolean>(false);

    const img0 = about?.profileImages?.[0];
    const img1 = about?.profileImages?.[1];

    // No images uploaded yet — show a subtle placeholder
    if (!img0 && !img1) {
        return (
            <div className="container relative h-[300px] md:h-[500px] w-[250px] md:w-1/2 lg:w-3/12 px-3 mx-auto justify-center">
                <div className="w-full h-full rounded-sm bg-gray-200 dark:bg-slate-700 animate-pulse" />
                <div className="absolute top-12 -bottom-6 -left-6 md:-left-12 w-4 md:w-9 bg-gray-200 dark:bg-slate-700 transition-theme" />
                <div className="absolute -bottom-6 md:-bottom-12 -left-4 md:-left-12 h-4 md:h-9 right-12 bg-gray-200 dark:bg-slate-700 transition-theme" />
            </div>
        );
    }

    return (
        <div className="container relative h-[300px] md:h-[500px] w-[250px] md:w-1/2 lg:w-3/12 px-3 mx-auto justify-center">

            {/* Image 0 — visible by default, fades out on hover if img1 exists */}
            {img0 && (
                <Image
                    src={img0}
                    alt="profile-image"
                    fill
                    className={`rounded-sm object-cover md:object-fill transition-all duration-700 ${
                        hover && img1 ? "opacity-0 scale-95 translate-y-10" : "opacity-100"
                    }`}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                />
            )}

            {/* Image 1 — fades in on hover (only rendered if a second image exists) */}
            {img1 && (
                <Image
                    src={img1}
                    alt="profile-image"
                    fill
                    className={`rounded-sm object-cover md:object-fill transition-all duration-700 ${
                        hover ? "opacity-100" : "opacity-0 scale-95 translate-y-10"
                    }`}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                />
            )}

            {/* Decorative borders */}
            <div className="absolute top-12 -bottom-6 -left-6 md:-left-12 w-4 md:w-9 bg-gray-200 dark:bg-slate-700 transition-theme" />
            <div className="absolute -bottom-6 md:-bottom-12 -left-4 md:-left-12 h-4 md:h-9 right-12 bg-gray-200 dark:bg-slate-700 transition-theme" />
        </div>
    );
};

export default ProfileImage;
