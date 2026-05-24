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

const FALLBACK_IMAGE = "/default-profile.png";

const ProfileImage = ({ about }: Props) => {
  const [hover, setHover] = useState(false);

  const [img0Loaded, setImg0Loaded] = useState(false);
  const [img1Loaded, setImg1Loaded] = useState(false);

  const [img0Error, setImg0Error] = useState(false);
  const [img1Error, setImg1Error] = useState(false);

  const isMobile = useIsMobile();

  // Clean image URLs
  const rawImg0 = about?.profileImages?.[0]?.trim();
  const rawImg1 = about?.profileImages?.[1]?.trim();

  const img0 = rawImg0 || FALLBACK_IMAGE;
  const img1 = rawImg1 || null;

  const D = isMobile ? 20 : 36;
  const GAP = isMobile ? 10 : 14;

  const decoBlocks = (
    <>
      <div
        className="intro-deco-v absolute bg-gray-200 dark:bg-slate-700 transition-theme"
        style={{
          top: "20%",
          bottom: -(D + GAP),
          left: -(D + GAP),
          width: D,
        }}
      />

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

  const isPrimaryLoaded = img0Loaded || img0Error;

  return (
    <div className={wrapperCls}>
      {/* Skeleton */}
      {!isPrimaryLoaded && (
        <div className="absolute inset-0 z-20 rounded-sm overflow-hidden">
          <div className="w-full h-full bg-gray-300 dark:bg-slate-700 animate-pulse" />

          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            }}
          />
        </div>
      )}

      {/* Main Image */}
      {!img0Error && (
        <Image
          src={img0}
          alt="profile-image"
          fill
          priority
          unoptimized
          sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, (max-width: 1024px) 320px, 380px"
          className={`rounded-sm object-cover object-top transition-all duration-700 z-10 ${
            hover && img1 && !img1Error
              ? "opacity-0 scale-95"
              : "opacity-100"
          }`}
          onLoad={() => setImg0Loaded(true)}
          onError={() => {
            setImg0Error(true);
            setImg0Loaded(true);
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      )}

      {/* Hover Image */}
      {img1 && !img1Error && (
        <Image
          src={img1}
          alt="profile-image-hover"
          fill
          unoptimized
          sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, (max-width: 1024px) 320px, 380px"
          className={`rounded-sm object-cover object-top transition-all duration-700 z-10 ${
            hover ? "opacity-100" : "opacity-0 scale-95"
          }`}
          onLoad={() => setImg1Loaded(true)}
          onError={() => setImg1Error(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      )}

      {/* Absolute fallback */}
      {img0Error && (
        <div className="w-full h-full rounded-sm bg-gray-300 dark:bg-slate-700 flex items-center justify-center text-sm text-gray-500">
          No Image
        </div>
      )}

      {decoBlocks}
    </div>
  );
};

export default ProfileImage;