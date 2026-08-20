"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGameStore } from "@/store/gameStore";
import type { ScriptData } from "@/types/game";

export default function StartScreen() {
  const { loadScript, goToIntro } = useGameStore();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    fetch("/data/script.json")
      .then((r) => r.json())
      .then((data: ScriptData) => loadScript(data));
  }, [loadScript]);

  const handleStart = () => goToIntro();

  return (
    <>
      {/* ══════════════════════════════════════════════════
          MOBILE LAYOUT  (< 768px) — fully fluid / responsive
          Reference frame: 430×932 (all positions in %)
          ══════════════════════════════════════════════════ */}
      <div className="ss-mobile-layout">

        {/* 1. Background — firstpagebg_mobile.png at opacity 0.20 */}
        <div className="ss-bg-group" />

        {/* Logo — /assets/logo/logo.png (centered in middle of screen) */}
        <div className="ss-mob-logo">
          <Image
            src="/assets/logo/logo.png"
            alt="Bam's Quest Logo"
            width={480}
            height={240}
            className="ss-logo-img"
            priority
          />
        </div>

        {/* 2. Top white gradient — same as desktop
            linear-gradient(180deg, white → transparent) */}
        <div className="ss-mob-top-fade" />

        {/* 3. Bottom dark gradient — same as desktop
            linear-gradient(0deg, rgba(0,0,0,0.64) → transparent), starts at 54% */}
        <div className="ss-mob-bottom-fade" />

        {/* 5. เริ่มเกม button */}
        <button
          id="btn-start-game"
          className="ss-mob-btn"
          onClick={handleStart}
          aria-label="เริ่มเกม"
        >
          เริ่มเกม
        </button>
      </div>

      {/* ══════════════════════════════════════════════════
          DESKTOP LAYOUT  (≥ 768px) — full-screen
          Figma node 53-99 (1440×898 reference)
          ══════════════════════════════════════════════════ */}
      <div className="ss-desktop-layout">

        {/* 1. firstpagebg_desktop.png at 39% opacity */}
        <div className="ss-dt-bg" />

        {/* Logo — /assets/logo/logo.png (centered in middle of screen) */}
        <div className="ss-dt-logo">
          <Image
            src="/assets/logo/logo.png"
            alt="Bam's Quest Logo"
            width={720}
            height={360}
            className="ss-logo-img"
            priority
          />
        </div>

        {/* 2. Bottom dark gradient */}
        <div className="ss-dt-bottom-fade" />

        {/* 3. Top white gradient */}
        <div className="ss-dt-top-fade" />

        {/* 5. เริ่มเกม button */}
        <button
          id="btn-start-game-desktop"
          className="ss-dt-btn"
          onClick={handleStart}
          aria-label="เริ่มเกม"
        >
          เริ่มเกม
        </button>
      </div>
    </>
  );
}
