"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type AboutMeInfo = {
  heading?: string;
  paragraphs?: string[];
  quickFacts?: string[];
  profileImages?: string[];
};

type Props = {
  about: AboutMeInfo;
};

// 👇 responsive hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
};

const ProfileImage = ({ about }: Props) => {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();

  const img0 = about?.profileImages?.[0];
  const img1 = about?.profileImages?.[1];

  // ✅ responsive values
  const D = isMobile ? 20 : 36;
  const GAP = isMobile ? 10 : 14;

  const decoBlocks = (
    <>
      {/* Vertical block */}
      <div
        className="intro-deco-v absolute bg-gray-200 dark:bg-slate-700 transition-theme"
        style={{
          top: "20%",
          bottom: -(D + GAP),
          left: -(D + GAP),
          width: D,
        }}
      />

      {/* Horizontal block */}
      <div
        className="intro-deco-h absolute bg-gray-200 dark:bg-slate-700 transition-theme"
        style={{
          bottom: -(D + GAP),
          left: -(D + GAP),
          right: "25%",
          height: D,
        }}
      />
    </>
  );

  const wrapperCls =
    "intro-image-wrap relative flex-shrink-0 mx-auto md:mx-0 w-[220px] sm:w-[260px] md:w-[320px] lg:w-[380px] aspect-[3/4]";

  if (!img0 && !img1) {
    return (
      <div className={wrapperCls}>
        <div className="w-full h-full rounded-sm bg-gray-200 dark:bg-slate-700 animate-pulse" />
        {decoBlocks}
      </div>
    );
  }

  return (
    <div className={wrapperCls}>
      {img0 && (
        <Image
          src={img0}
          alt="profile-image"
          fill
          priority
          className={`rounded-sm object-cover object-top transition-all duration-700 z-10 ${
            hover && img1 ? "opacity-0 scale-95" : "opacity-100"
          }`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      )}

      {img1 && (
        <Image
          src={img1}
          alt="profile-image"
          fill
          className={`rounded-sm object-cover object-top transition-all duration-700 z-10 ${
            hover ? "opacity-100" : "opacity-0 scale-95"
          }`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      )}

      {decoBlocks}
    </div>
  );
};

export default ProfileImage;