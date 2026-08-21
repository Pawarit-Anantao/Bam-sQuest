"use client";

import Image from "next/image";
import { useGameStore } from "@/store/gameStore";

// ─────────────────────────────────────────────────────────────
// SalmonCardReward Component — Final Story Reward Screen
// Heading -> Image -> Description -> Back to First Page Button
// ─────────────────────────────────────────────────────────────
export default function SalmonCardReward() {
  const { goToMap, goToStart } = useGameStore();

  return (
    <div className="fail-backdrop" role="dialog" aria-modal="true" aria-label="รับตั๋วกินแซลมอน">
      <div className="fail-content" style={{ gap: "1.2rem", maxWidth: "540px" }}>
        {/* Heading */}
        <h1 className="fail-title" style={{ marginBottom: "0.5rem" }}>
          ตั๋วกินแซลมอน!
        </h1>

        {/* Image: /assets/slmoncard.png */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "380px",
            height: "220px",
            margin: "0.2rem auto",
            filter: "drop-shadow(0 12px 28px rgba(255, 120, 80, 0.35))",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Image
            src="/assets/slmoncard.png"
            alt="Salmon Ticket"
            fill
            sizes="(max-width: 768px) 90vw, 380px"
            style={{ objectFit: "contain" }}
            priority
            unoptimized
          />
        </div>

        {/* Description */}
        <p className="fail-description" style={{ margin: "0.5rem 0 1.8rem 0", maxWidth: "460px" }}>
          ตั๋วกินแซลม่อนสำหรับผู้เข้าร่วมงานแซลมอนประจำกุยโทเปีย สามารถกินแซลมอนได้ไม่อั้น
        </p>

        {/* Action Buttons — Back to Map & Back to Start Page */}
        <div className="fail-button-container" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            id="btn-back-to-map"
            className="fail-restart-btn"
            onClick={goToMap}
            aria-label="กลับสู่แผนที่"
          >
            <span>กลับสู่แผนที่</span>
          </button>
          <button
            id="btn-back-to-first-page"
            className="fail-restart-btn"
            style={{ opacity: 0.85 }}
            onClick={goToStart}
            aria-label="กลับสู่หน้าแรก"
          >
            <span>กลับสู่หน้าแรก</span>
          </button>
        </div>
      </div>
    </div>
  );
}
