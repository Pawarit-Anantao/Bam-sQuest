"use client";

import { useGameStore } from "@/store/gameStore";

interface StageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StageSelectModal({ isOpen, onClose }: StageSelectModalProps) {
  const { startStage, goToIntro, unlockedLocations } = useGameStore();

  if (!isOpen) return null;

  const isTofuUnlocked = unlockedLocations.includes("tofu_mansion");

  const handleSelectStage = (stageType: "intro" | "stage", stageId?: string) => {
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

        <p className="stage-select-subtitle">คลิกเลือกบทหรือฉากเพื่อเล่นซ้ำได้ตลอดเวลา</p>

        {/* Stage List Buttons */}
        <div className="stage-select-list">
          {/* 1. บทนำ */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("intro")}
          >
            <span className="stage-item-badge">บทนำ</span>
            <span className="stage-item-name">หมาแบมไปต่างโลก</span>
          </button>

          {/* 2. บทที่ 1 */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("stage", "intro_stage")}
          >
            <span className="stage-item-badge">บทที่ 1</span>
            <span className="stage-item-name">การตื่นขึ้นของผู้กล้าแบม</span>
          </button>

          {/* 3. บทที่ 2 */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("stage", "stage_1_exploration")}
          >
            <span className="stage-item-badge">บทที่ 2</span>
            <span className="stage-item-name">การเดินทางสู่กุยแลนด์</span>
          </button>

          {/* 4. บทที่ 3 */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("stage", "stage_1_noble_nueng")}
          >
            <span className="stage-item-badge">บทที่ 3</span>
            <span className="stage-item-name">ปราสาทขุนนางหนึ่ง</span>
          </button>

          {/* 5. บทที่ 4 - คฤหาสน์โทฟุ */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("stage", "tofu_mansion")}
          >
            <span className="stage-item-badge">บทที่ 4</span>
            <span className="stage-item-name">คฤหาสน์โทฟุ</span>
          </button>

          {/* 6. บทสุดท้าย - บ่อแซลมอนวิเศษ */}
          <button
            className="stage-select-item"
            onClick={() => handleSelectStage("stage", "salmon_pool")}
          >
            <span className="stage-item-badge">บทสุดท้าย</span>
            <span className="stage-item-name">บ่อแซลมอนวิเศษ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
