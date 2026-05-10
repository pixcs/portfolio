"use client";

import { useEffect, useRef } from "react";

/**
 * HeroCursorEffect — Cursor Trail
 *
 * A smooth glowing trail that follows the cursor.
 * Trail color is driven by the `color` prop — pass `info?.colorStatus` from
 * your server component so it matches the live status indicator.
 *
 * Usage in Introduction.tsx:
 *   <HeroCursorEffect color={info?.colorStatus} />
 */

interface Props {
  color?: string; // any valid CSS color: "#7fffb2", "rgb(…)", "green", etc.
}

const TRAIL_LENGTH = 24;  // number of trail particles
const PARTICLE_MAX = 18;  // lead particle max radius
const LERP         = 0.16; // head follow speed  (0 = very laggy, 1 = instant)

/** Resolve any CSS color string → [r, g, b] via a 1×1 canvas */
function parseColor(css: string): [number, number, number] {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const x = c.getContext("2d")!;
    x.fillStyle = css;
    x.fillRect(0, 0, 1, 1);
    const [r, g, b] = x.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  } catch {
    return [127, 255, 178]; // fallback: mint green
  }
}

export default function HeroCursorEffect({ color = "#94a3b8" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target    = useRef({ x: -999, y: -999 });
  const head      = useRef({ x: -999, y: -999 });
  const trail     = useRef<{ x: number; y: number }[]>([]);
  const raf       = useRef<number>(0);
  const rgb       = useRef<[number, number, number]>([148, 163, 184]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;

    // Resolve color now that DOM is ready
    rgb.current = parseColor(color);

    // ── Resize canvas to match the section ─────────────────────────
    const resize = () => {
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // ── Track mouse relative to the section ────────────────────────
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { target.current = { x: -999, y: -999 }; };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);

    // Init trail points off-screen
    trail.current = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -999, y: -999 }));

    // ── Render loop ─────────────────────────────────────────────────
    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const active = target.current.x > -900;

      if (active) {
        // Smoothly move head toward cursor
        head.current.x += (target.current.x - head.current.x) * LERP;
        head.current.y += (target.current.y - head.current.y) * LERP;

        // Prepend head position, trim to max length
        trail.current.unshift({ x: head.current.x, y: head.current.y });
        if (trail.current.length > TRAIL_LENGTH) trail.current.pop();
      } else {
        // Drift trail off-screen when cursor leaves
        trail.current = trail.current.map(p => ({
          x: p.x + (-999 - p.x) * 0.07,
          y: p.y + (-999 - p.y) * 0.07,
        }));
      }

      const [r, g, b] = rgb.current;

      trail.current.forEach((p, i) => {
        if (p.x < -900) return;

        const t      = 1 - i / TRAIL_LENGTH; // 1 = head → 0 = tail
        const radius = PARTICLE_MAX * t;
        const alpha  = t * 0.6;

        // Soft outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3);
        glow.addColorStop(0,   `rgba(${r},${g},${b},${(alpha * 0.4).toFixed(3)})`);
        glow.addColorStop(0.5, `rgba(${r},${g},${b},${(alpha * 0.12).toFixed(3)})`);
        glow.addColorStop(1,   `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Solid bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(alpha * 2, 0.92).toFixed(3)})`;
        ctx.fill();
      });

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [color]); // re-runs if colorStatus changes (e.g. live data refresh)

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // never blocks clicks or links
        zIndex: 0,
      }}
    />
  );
}
