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

        {/* 2. Top white gradient — same as desktop
            linear-gradient(180deg, white → transparent) */}
        <div className="ss-mob-top-fade" />

        {/* 3. Bottom dark gradient — same as desktop
            linear-gradient(0deg, rgba(0,0,0,0.64) → transparent), starts at 54% */}
        <div className="ss-mob-bottom-fade" />

        {/* 4. Scene / character image
            Figma: x:15 y:277 w:388 h:245 on 430×932
            → left: 3.49%  top: 29.72%  width: 90.23% */}
        <div className="ss-mob-scene">
          <Image
            src="/assets/scene_character.png"
            alt="Character scene"
            width={388}
            height={245}
            className="ss-mob-scene-img"
            priority
          />
        </div>

        {/* 5. เริ่มเกม button
            Figma: x:178 y:793 — center: 214/430=49.8% → left:50%
            top: 793/932 = 85.09%
            24px SemiBold Noto Sans Thai #000 */}
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

        {/* 1. firstpagebg_desktop.png at 39% opacity
            Visible slice: y:1027→1925 of 2819 → center ≈ 52% */}
        <div className="ss-dt-bg" />

        {/* 2. Bottom dark gradient
            top: 486/898 = 54.12%, rgba(0,0,0,0.64)→transparent */}
        <div className="ss-dt-bottom-fade" />

        {/* 3. Top white gradient — 1645/898 = 183.2% tall */}
        <div className="ss-dt-top-fade" />

        {/* 4. Scene image
            left: 254/1440=17.64%  top: 197/898=21.94%  width: 63.54% */}
        <div className="ss-dt-scene">
          <Image
            src="/assets/scene_character.png"
            alt="Character scene"
            width={915}
            height={578}
            className="ss-dt-scene-img"
            priority
          />
        </div>

        {/* 5. เริ่มเกม — top: 809/898=90.09%, center=left:50% */}
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
