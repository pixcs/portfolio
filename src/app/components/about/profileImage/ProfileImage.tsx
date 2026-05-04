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

  const D   = 40;  // block thickness
  const GAP = 14;  // gap between image and blocks

  const decoBlocks = (
    <>
      {/* Vertical block — left side, partial height */}
      <div
        className="intro-deco-v absolute bg-gray-200 dark:bg-slate-700 transition-theme"
        style={{
          top: "20%",
          bottom: -(D + GAP),
          left: -(D + GAP),
          width: D,
        }}
      />
      {/* Horizontal block — bottom, partial width */}
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
    "intro-image-wrap relative flex-shrink-0 w-[280px] h-[380px] md:w-[380px] md:h-[520px]";

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
