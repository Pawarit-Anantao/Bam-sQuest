"use client";

import { useState } from "react";
import Image from "next/image";
import StageSelectModal from "./StageSelectModal";
import { useGameStore } from "@/store/gameStore";

function LockIcon() {
  return (
    <svg
      className="map-node-lock-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// MapScreen Component — Interactive Map (Figma #35:292 & #45:58)
// ─────────────────────────────────────────────────────────────
export default function MapScreen() {
  const { startStage, unlockedLocations } = useGameStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isStageSelectOpen, setIsStageSelectOpen] = useState(false);

  const isTofuUnlocked = unlockedLocations.includes("tofu_mansion");
  const isSalmonUnlocked = unlockedLocations.includes("salmon_pool");

  const handleSelectLocation = (id: string, name: string) => {
    if (id === "salmon_pool") {
      if (isSalmonUnlocked) {
        setToastMessage(`"${name}" - ยินดีด้วย! มาถึงบ่อแซลมอนวิเศษแล้ว`);
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage(`"${name}" ยังไม่ปลดล็อก — ชนะ คฤหาสโทฟุ ก่อน`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } else if (id === "nobles_castle") {
      startStage("stage_1_noble_nueng");
    } else if (id === "tofu_mansion") {
      if (isTofuUnlocked) {
        startStage("stage_2_tofu");
      } else {
        setToastMessage(`"${name}" ยังไม่ปลดล็อก — ชนะ ปราสาทขุนนางหนึ่ง ก่อน`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } else {
      setToastMessage(`"${name}" ยังไม่เปิดให้บริการในเวอร์ชันนี้`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="map-viewport" role="region" aria-label="แผนที่กุยโทเปีย">
      {/* Map Background Layer — map_mobile_bg.png on Mobile, map_desktop_bg.png on Desktop */}
      <div className="map-bg-image" />

      {/* Top Logo (Click to open Stage Select Modal) */}
      <div className="map-top-logo">
        <button
          className="map-top-logo-btn"
          onClick={() => setIsStageSelectOpen(true)}
          aria-label="เลือกบท / ฉากที่ต้องการเล่น"
          title="เลือกบท / ฉากที่ต้องการเล่น"
        >
          <Image
            src="/assets/logo/logo_negative.png"
            alt="Logo"
            width={219}
            height={116}
            className="map-logo-img"
            priority
          />
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="map-toast" role="alert">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Location Nodes Layer */}
      <div className="map-nodes-container">
        {/* 1. บ่อแซลมอนวิเศษ (Magic Salmon Pool) */}
        <button
          id="map-node-salmon-pool"
          className={`map-node-card node-salmon-pool ${isSalmonUnlocked ? "node-unlocked" : "node-locked"}`}
          onClick={() => handleSelectLocation("salmon_pool", "บ่อแซลมอนวิเศษ")}
          aria-label="บ่อแซลมอนวิเศษ"
        >
          <span className="map-node-text">บ่อแซลมอนวิเศษ</span>
          {!isSalmonUnlocked && <LockIcon />}
        </button>

        {/* 2. คฤหาสโทฟุ (Tofu Mansion) */}
        <button
          id="map-node-tofu-mansion"
          className={`map-node-card node-tofu-mansion ${isTofuUnlocked ? "node-unlocked" : "node-locked"}`}
          onClick={() => handleSelectLocation("tofu_mansion", "คฤหาสโทฟุ")}
          aria-label="คฤหาสโทฟุ"
        >
          <span className="map-node-text">คฤหาสโทฟุ</span>
          {!isTofuUnlocked && <LockIcon />}
        </button>

        {/* 3. ปราสาทขุนนางหนึ่ง (Nobles Castle 1) */}
        <button
          id="map-node-nobles-castle"
          className="map-node-card node-nobles-castle node-unlocked"
          onClick={() => handleSelectLocation("nobles_castle", "ปราสาทขุนนางหนึ่ง")}
          aria-label="ปราสาทขุนนางหนึ่ง"
        >
          <span className="map-node-text">ปราสาทขุนนางหนึ่ง</span>
        </button>
      </div>

      {/* Stage Select Modal */}
      <StageSelectModal
        isOpen={isStageSelectOpen}
        onClose={() => setIsStageSelectOpen(false)}
      />
    </div>
  );
}
