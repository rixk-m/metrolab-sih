"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";

export function LandingWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Landing page is ALWAYS rendered underneath */}
      <div className={showSplash ? "opacity-100" : "opacity-100"}>
        {children}
      </div>
      
      {/* Splash overlays on top, its background fades to reveal the page */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
    </>
  );
}
