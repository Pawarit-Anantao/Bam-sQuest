"use client";

import { useGameStore } from "@/store/gameStore";

// ─────────────────────────────────────────────────────────────
// StageFail Component — Game Error / Mission Failed (Figma #65:131)
// ─────────────────────────────────────────────────────────────
export default function StageFail() {
  const { startStage, currentStage } = useGameStore();

  const handleRestart = () => {
    startStage(currentStage || "intro_stage");
  };

  return (
    <div className="fail-backdrop" role="dialog" aria-modal="true" aria-label="ภารกิจล้มเหลว">
      <div className="fail-content">
        {/* Main Title (Figma #65:146) */}
        <h1 className="fail-title">ภารกิจล้มเหลว</h1>

        {/* Subtext Description (Figma #65:151) */}
        <p className="fail-description">
          แบมพ่ายแพ้ต่อความขี้เกียจ อ้วนไม่สามารถทวงอาณาจักรกลับมาได้
          <br />
          กุยแลนด์ยังคงต้องการผู้กล้าต่อไป ........
        </p>

        {/* Restart Button (Figma #65:160) */}
        <div className="fail-button-container">
          <button
            id="btn-fail-restart"
            className="fail-restart-btn"
            onClick={handleRestart}
            aria-label="เริ่มใหม่"
          >
            <span>เริ่มใหม่</span>
          </button>
        </div>
      </div>
    </div>
  );
}
