"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

// Preloaded URL cache so we don't re-preload images that are already loaded
const loadedImageCache = new Set<string>();

const STAGE_ASSETS: Record<string, string[]> = {
  start: [
    "/assets/firstpagebg_mobile.png",
    "/assets/firstpagebg_desktop.png",
    "/assets/logo/logo.png",
  ],
  intro: [
    "/assets/Story.png",
  ],
  intro_stage: [
    "/assets/vn_prologue2_bg.png",
    "/assets/Bam_sprites/Bam_normal.png",
    "/assets/Bam_sprites/Bam_smile.png",
    "/assets/Bam_sprites/Bam_badsmile.png",
    "/assets/Bam_sprites/Bam_angry.png",
    "/assets/aun.png",
    "/assets/logo/logo_negative.png",
  ],
  stage_1_exploration: [
    "/assets/map_mobile_bg.png",
    "/assets/map_desktop_bg.png",
    "/assets/Bam_sprites/Bam_normal.png",
    "/assets/aun.png",
    "/assets/logo/logo_negative.png",
  ],
  stage_1_noble_nueng: [
    "/assets/vn_prologue2_bg.png",
    "/assets/bg_desktop.png",
    "/assets/combat_bg_layer1.png",
    "/assets/combat_bg_layer2.png",
    "/assets/Bam_sprites/Bam_normal.png",
    "/assets/Bam_sprites/Bam_smile.png",
    "/assets/Bam_sprites/Bam_badsmile.png",
    "/assets/Bam_sprites/Bam_angry.png",
    "/assets/aun.png",
    "/assets/1.png",
    "/assets/logo/logo_negative.png",
  ],
  stage_1: [
    "/assets/bg_desktop.png",
    "/assets/combat_bg_layer1.png",
    "/assets/combat_bg_layer2.png",
    "/assets/1.png",
    "/assets/Bam_sprites/Bam_normal.png",
    "/assets/logo/logo_negative.png",
  ],
};

interface AssetPreloaderProps {
  children: React.ReactNode;
}

export default function AssetPreloader({ children }: AssetPreloaderProps) {
  const { phase, currentStage } = useGameStore();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Key that changes whenever screen or stage changes
  const pageKey = phase === "start" ? "start" : phase === "intro" ? "intro" : currentStage;

  useEffect(() => {
    const urls = STAGE_ASSETS[pageKey] || STAGE_ASSETS[phase] || [];

    // Filter out already cached URLs
    const missingUrls = urls.filter((url) => !loadedImageCache.has(url));

    if (missingUrls.length === 0) {
      setProgress(100);
      setLoading(false);
      return;
    }

    setLoading(true);
    setProgress(0);

    let loadedCount = 0;
    const totalCount = missingUrls.length;

    const handleSingleLoad = (url: string) => {
      loadedImageCache.add(url);
      loadedCount++;
      const currentPct = Math.round((loadedCount / totalCount) * 100);
      setProgress(currentPct);

      if (loadedCount >= totalCount) {
        setTimeout(() => {
          setLoading(false);
        }, 180);
      }
    };

    missingUrls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
      if (img.complete) {
        handleSingleLoad(url);
      } else {
        img.onload = () => handleSingleLoad(url);
        img.onerror = () => handleSingleLoad(url); // Don't block forever on missing images
      }
    });
  }, [pageKey, phase]);

  return (
    <>
      {/* Underlying Page Content */}
      <div
        className={`page-content-wrapper ${loading ? "page-content-hidden" : "page-content-visible"}`}
      >
        {children}
      </div>

      {/* Black Screen Preloader with Enemy HP Gauge Progress Bar */}
      {loading && (
        <div className="preloader-overlay" role="dialog" aria-label="Loading page assets">
          <div className="preloader-content">
            {/* Title: กำลังเดินทาง... */}
            <h2 className="preloader-title">กำลังเดินทาง...</h2>

            {/* HP Bar Gauge-style Progress Bar */}
            <div className="preloader-hp-wrapper">
              <div className="preloader-hp-label">
                <span className="preloader-hp-text">โหลดข้อมูล</span>
                <span className="preloader-hp-pct">{progress}%</span>
              </div>
              <div className="preloader-hp-track">
                <div
                  className="preloader-hp-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
