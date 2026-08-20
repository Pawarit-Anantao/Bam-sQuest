"use client";

import { useGameStore } from "@/store/gameStore";

export default function StageWin() {
  const { goToStart, enemyName } = useGameStore();

  return (
    <div className="win-screen" role="dialog" aria-label="Stage cleared">
      {/* Trophy emoji with glow */}
      <div style={{ fontSize: "5rem", lineHeight: 1, filter: "drop-shadow(0 0 20px rgba(245,200,66,0.8))" }}>
        🏆
      </div>

      <div>
        <h2 className="win-title">VICTORY!</h2>
        <p className="win-subtitle">{enemyName} has been defeated!</p>
      </div>

      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: "240px" }}>
        คุณผ่าน Stage 1 แล้ว!<br />ขอบคุณที่เล่น Bam&apos;s Quest 🎉
      </p>

      <button
        id="btn-play-again"
        className="win-button"
        onClick={goToStart}
        aria-label="Play again"
      >
        เล่นอีกครั้ง
      </button>
    </div>
  );
}
