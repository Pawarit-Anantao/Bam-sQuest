"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";

interface StageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "-0.12em", marginLeft: "6px" }}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function StageSelectModal({ isOpen, onClose }: StageSelectModalProps) {
  const { startStage, goToIntro, unlockedLocations } = useGameStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTofuUnlocked = unlockedLocations.includes("tofu_mansion") || unlockedLocations.includes("stage_2_tofu");
  const isSalmonUnlocked = unlockedLocations.includes("salmon_pool");

  const handleSelectStage = (
    stageType: "intro" | "stage",
    stageId?: string,
    isUnlocked: boolean = true,
    stageName?: string
  ) => {
    if (!isUnlocked) {
      setToastMsg(`"${stageName}" ยังไม่ปลดล็อก — ต้องเล่นผ่านด่านก่อนหน้าอย่างน้อย 1 ครั้ง`);
      setTimeout(() => setToastMsg(null), 3200);
      return;
    }

    onClose();
    if (stageType === "intro") {
      goToIntro();
    } else if (stageId) {
      startStage(stageId);
    }
  };

  return (
    <div className="stage-select-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="เลือกบท / ฉาก">
      <div className="stage-select-card" onClick={(e) => e.stopPropagation()}>
        {/* Header with Close Button */}
        <div className="stage-select-header">
          <h2 className="stage-select-title">เลือกบท / ฉากที่ต้องการเล่น</h2>
          <button className="stage-select-close-btn" onClick={onClose} aria-label="ปิด">
            ✕
          </button>
        </div>

        <p className="stage-select-subtitle">เลือกบทเพื่อเล่นซ้ำ (เล่นได้เฉพาะด่านที่เคยปลดล็อกแล้ว)</p>

        {/* Toast Warning inside Modal */}
        {toastMsg && (
          <div className="stage-select-toast" role="alert">
            {toastMsg}
          </div>
        )}

        {/* Stage List Buttons */}
        <div className="stage-select-list">
          {/* 1. บทนำ */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("intro", undefined, true, "หมาแบมไปต่างโลก")}
          >
            <span className="stage-item-badge">บทนำ</span>
            <span className="stage-item-name">หมาแบมไปต่างโลก</span>
          </button>

          {/* 2. บทที่ 1 */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("stage", "intro_stage", true, "การตื่นขึ้นของผู้กล้าแบม")}
          >
            <span className="stage-item-badge">บทที่ 1</span>
            <span className="stage-item-name">การตื่นขึ้นของผู้กล้าแบม</span>
          </button>

          {/* 3. บทที่ 2 */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("stage", "stage_1_exploration", true, "การเดินทางสู่กุยแลนด์")}
          >
            <span className="stage-item-badge">บทที่ 2</span>
            <span className="stage-item-name">การเดินทางสู่กุยแลนด์</span>
          </button>

          {/* 4. บทที่ 3 */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("stage", "stage_1_noble_nueng", true, "ปราสาทขุนนางหนึ่ง")}
          >
            <span className="stage-item-badge">บทที่ 3</span>
            <span className="stage-item-name">ปราสาทขุนนางหนึ่ง</span>
          </button>

          {/* 5. บทที่ 4 - คฤหาสน์โทฟุ (requires completing Castle 1) */}
          <button
            className={`stage-select-item ${isTofuUnlocked ? "" : "stage-item-locked"}`}
            onClick={() => handleSelectStage("stage", "stage_2_tofu", isTofuUnlocked, "คฤหาสน์โทฟุ")}
          >
            <span className="stage-item-badge">บทที่ 4</span>
            <span className="stage-item-name">
              คฤหาสน์โทฟุ {!isTofuUnlocked && <LockIcon />}
            </span>
          </button>

          {/* 6. บทสุดท้าย - บ่อแซลมอนวิเศษ (requires completing Tofu Mansion) */}
          <button
            className={`stage-select-item ${isSalmonUnlocked ? "" : "stage-item-locked"}`}
            onClick={() => handleSelectStage("stage", "salmon_pool", isSalmonUnlocked, "บ่อแซลมอนวิเศษ")}
          >
            <span className="stage-item-badge">บทสุดท้าย</span>
            <span className="stage-item-name">
              บ่อแซลมอนวิเศษ {!isSalmonUnlocked && <LockIcon />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
