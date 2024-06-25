"use client";

import Image from "next/image";
import { useState } from "react";

const ProfileImage = () => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <div className="container relative h-[300px] md:h-[500px] w-[250px]  md:w-1/2 lg:w-3/12 px-3 mx-auto justify-center">
            <Image
                src={`/assets/images/pic.jpg`}
                alt="profile-image"
                fill
                className={`rounded-sm object-cover md:object-fill transition-all duration-300 ${hover ? "opacity-0 scale-95 translate-y-10" : " opacity-100"} transition-all duration-700`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            />
            <Image
                src={`/assets/images/grad.jpg`}
                alt="profile-image"
                fill
                className={`rounded-sm object-cover md:object-fill transition-all duration-300 ${hover ? "opacity-100" : " opacity-0 scale-95 translate-y-10"} transition-all duration-700`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            />
            <div className="absolute top-12 -bottom-6 -left-6 md:-left-12 w-4 md:w-9   bg-gray-200 dark:bg-slate-700 transition-theme" />{/* left */}
            <div className="absolute -bottom-6 md:-bottom-12 -left-4 md:-left-12 h-4 md:h-9 right-12 bg-gray-200 dark:bg-slate-700 transition-theme" /> {/* bottom */}
        </div>
    )
}

export default ProfileImage;