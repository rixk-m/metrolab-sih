"use client";

import { useEffect, useRef, useCallback } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
const LINE1 = "WELCOME TO";
const LINE2 = "metroLAB";
const TAGLINE = "an initiative by Team Techxi";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2p1Ref = useRef<HTMLSpanElement>(null);
  const line2p2Ref = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const getRandomChar = useCallback(() => 
    CHARSET[Math.floor(Math.random() * CHARSET.length)], []);

  useEffect(() => {
    let frame = 0;
    let raf: number;

    const animate = () => {
      frame++;
      // Calculate equivalent 't' assuming 60fps (1 frame = 16.6ms)
      const t = frame * 16.6;
      
      const l1 = line1Ref.current;
      const l2p1 = line2p1Ref.current;
      const l2p2 = line2p2Ref.current;
      const tl = taglineRef.current;
      const bg = bgRef.current;
      const ln = lineRef.current;
      const ct = containerRef.current;

      if (!l1 || !l2p1 || !l2p2 || !tl || !bg || !ln || !ct) {
        raf = requestAnimationFrame(animate);
        return;
      }

      if (t < 600) {
        // Scramble phase
        const len1 = Math.min(Math.floor(t / 50), LINE1.length);
        const len2 = Math.min(Math.floor(Math.max(0, t - 150) / 50), LINE2.length);
        let s1 = "";
        for (let i = 0; i < len1; i++) s1 += getRandomChar();
        let s2 = "";
        for (let i = 0; i < len2; i++) s2 += getRandomChar();
        
        l1.textContent = s1;
        l2p1.textContent = s2.substring(0, 5);
        l2p2.textContent = s2.substring(5);

      } else if (t < 1800) {
        // Reveal phase
        const p1 = Math.min(1, (t - 600) / 500);
        const p2 = Math.min(1, (t - 800) / 600);
        const r1 = Math.floor(p1 * LINE1.length);
        const r2 = Math.floor(p2 * LINE2.length);

        let s1 = "";
        for (let i = 0; i < LINE1.length; i++)
          s1 += i < r1 ? LINE1[i] : getRandomChar();
        
        let s2 = "";
        for (let i = 0; i < LINE2.length; i++)
          s2 += i < r2 ? LINE2[i] : getRandomChar();

        l1.textContent = s1;
        l2p1.textContent = s2.substring(0, 5);
        l2p2.textContent = s2.substring(5);

        if (t > 1400) {
          tl.style.opacity = "1";
          tl.style.transform = "translateY(0)";
        }

      } else if (t < 2600) {
        // Hold
        l1.textContent = LINE1;
        l2p1.textContent = "metro";
        l2p2.textContent = "LAB";
        ln.style.width = "12rem";

      } else if (t < 3800) {
        // Merge — fade background, dissolve text
        const p = (t - 2600) / 1200;
        const ease = 1 - Math.pow(1 - p, 2);
        bg.style.opacity = String(1 - ease);
        ct.style.opacity = String(1 - ease * 1.2);

      } else {
        onComplete();
        return;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [onComplete, getRandomChar]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center select-none"
      style={{ pointerEvents: "none" }}
    >
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-500/6 via-rose-500/5 to-violet-500/5 blur-[100px]" />
      </div>

      {/* Text — positioned to match the hero section exactly */}
      <div className="h-screen w-full flex items-center justify-between px-8 md:px-24 relative z-10">
        <div className="max-w-2xl text-left pl-6 border-l-[3px] border-transparent">
          <div className="text-xs md:text-sm font-bold tracking-[0.3em] text-white/50 mb-6 uppercase flex items-center gap-3">
            <span className="w-8 h-[1px] bg-white/50"></span>
            <span ref={line1Ref}></span>
          </div>
          <div className="text-6xl md:text-8xl lg:text-[10rem] font-extrabold tracking-tighter leading-[0.8] mb-6 drop-shadow-sm text-foreground">
            <span ref={line2p1Ref}></span>
            <span ref={line2p2Ref} className="text-primary font-light"></span>
          </div>
          {/* Animated tagline from splash */}
          <div className="absolute w-full">
            <div
              ref={taglineRef}
              className="text-xs tracking-[0.2em] text-white/30 uppercase transition-all duration-500"
              style={{ opacity: 0, transform: "translateY(10px)" }}
            >
              {TAGLINE}
            </div>
            <div
              ref={lineRef}
              className="mt-6 h-[1px] bg-gradient-to-r from-amber-400/40 to-transparent transition-all duration-700"
              style={{ width: 0 }}
            />
          </div>
          
          {/* INVISIBLE PLACEHOLDERS to force exact identical height for flex centering */}
          <div className="opacity-0 pointer-events-none select-none">
            <p className="text-xl md:text-2xl text-foreground tracking-[0.15em] uppercase font-semibold">
              Precision Beyond Compliance
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2 tracking-[0.2em] uppercase">
              An initiative by Team Techxi
            </p>
            <p className="text-sm md:text-base text-muted-foreground mt-8 leading-relaxed max-w-lg font-medium">
              A digital platform for type evaluation of non-automatic weighing instruments as per OIML R76.
            </p>
            <div className="flex gap-4 mt-12 h-14">
              <div className="h-14 px-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
