"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
};

const ExperienceReveal = ({ children }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = container.querySelectorAll<HTMLElement>(
      ".exp-reveal, .exp-header-reveal"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default ExperienceReveal;
