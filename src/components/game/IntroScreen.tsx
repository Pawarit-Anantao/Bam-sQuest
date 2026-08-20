"use client";

import Image from "next/image";
import { useGameStore } from "@/store/gameStore";

export default function IntroScreen() {
  const { startStage } = useGameStore();

  const handleContinue = () => {
    startStage("intro_stage");
  };

  return (
    <div className="intro-shell">
      <div className="intro-container">
        {/* Header Title */}
        <header className="intro-header">
          <h1 className="intro-title">บทนำ หมาแบมไปต่างโลก</h1>
        </header>

        {/* Story Image Section */}
        <div className="intro-body">
          <Image
            src="/assets/Story.png"
            alt="บทนำ หมาแบมไปต่างโลก"
            width={1136}
            height={4096}
            className="intro-story-img"
            priority
          />
        </div>

        {/* Action Button at bottom */}
        <div className="intro-footer">
          <button
            id="btn-intro-continue"
            className="intro-continue-btn"
            onClick={handleContinue}
            aria-label="ดำเนินการต่อ"
          >
            ดำเนินการต่อ
          </button>
        </div>
      </div>
    </div>
  );
}
