"use client";

import { useState } from "react";
import Image from "next/image";
import { useGameStore } from "@/store/gameStore";
import StageFail from "./ui/StageFail";

function MapIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "-0.18em", marginRight: "6px" }}
      aria-hidden="true"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function ShieldIcon() {
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
      style={{ display: "inline-block", verticalAlign: "-0.12em", marginRight: "4px", marginLeft: "6px" }}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function TurnbasedCombat() {
  const { goToMap } = useGameStore();

  // Turn-based Combat State
  const [bossHp, setBossHp] = useState(100);
  const bossMaxHp = 100;

  const [playerHp, setPlayerHp] = useState(100);
  const playerMaxHp = 100;

  const [playerShield, setPlayerShield] = useState(0);

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hitAnimation, setHitAnimation] = useState<"boss-hit" | "player-hit" | null>(null);

  const [combatLog, setCombatLog] = useState<string>("ตาของคุณ! เลือกการ์ดสกิลเพื่อต่อสู้กับบิ๊กกุย");

  const [isVictory, setIsVictory] = useState(false);
  const [isDefeat, setIsDefeat] = useState(false);

  // Player action handler
  const handleUseSkill = (skillType: "attack" | "heal" | "block") => {
    if (!isPlayerTurn || isAnimating || isVictory || isDefeat) return;

    setIsAnimating(true);
    let logMsg = "";
    let newBossHp = bossHp;

    if (skillType === "attack") {
      const dmg = 20;
      newBossHp = Math.max(0, bossHp - dmg);
      setBossHp(newBossHp);
      setHitAnimation("boss-hit");
      logMsg = `ผู้กล้าแบม ใช้การ์ดโจมตี! สร้างความเสียหาย 20 แต้มแก่ บิ๊กกุย`;
    } else if (skillType === "heal") {
      const healAmt = 15;
      const newHp = Math.min(playerMaxHp, playerHp + healAmt);
      setPlayerHp(newHp);
      logMsg = `ผู้กล้าแบม ใช้การ์ดฟื้นฟู! ฟื้นฟู HP 15 แต้ม`;
    } else if (skillType === "block") {
      const shieldAmt = 20;
      setPlayerShield((prev) => prev + shieldAmt);
      logMsg = `ผู้กล้าแบม ใช้การ์ดป้องกัน! เพิ่มเกราะป้องกัน 20 แต้ม`;
    }

    setCombatLog(logMsg);

    // Check Victory
    if (newBossHp <= 0) {
      setTimeout(() => {
        setIsVictory(true);
        setIsAnimating(false);
      }, 600);
      return;
    }

    // Pass turn to Boss after 0.8s
    setTimeout(() => {
      setHitAnimation(null);
      setIsPlayerTurn(false);
      executeBossTurn(newBossHp);
    }, 900);
  };

  // Boss (บิ๊กกุย) AI turn
  const executeBossTurn = (currentBossHp: number) => {
    setCombatLog("ตาของ บิ๊กกุย กำลังเตรียมโจมตี...");

    setTimeout(() => {
      const bossDmg = 20;
      setHitAnimation("player-hit");

      setPlayerShield((prevShield) => {
        let remainingDmg = bossDmg;
        let newShield = prevShield;

        if (prevShield > 0) {
          if (prevShield >= bossDmg) {
            newShield = prevShield - bossDmg;
            remainingDmg = 0;
          } else {
            remainingDmg = bossDmg - prevShield;
            newShield = 0;
          }
        }

        setPlayerHp((prevHp) => {
          const newHp = Math.max(0, prevHp - remainingDmg);
          if (newHp <= 0) {
            setTimeout(() => setIsDefeat(true), 600);
          }
          return newHp;
        });

        return newShield;
      });

      setCombatLog(`บิ๊กกุย ใช้ หมัดมหาพรหม! โจมตีผู้กล้าแบม ${bossDmg} แต้ม`);

      setTimeout(() => {
        setHitAnimation(null);
        setIsPlayerTurn(true);
        setIsAnimating(false);
      }, 900);
    }, 1000);
  };

  // Reset Battle
  const handleRestart = () => {
    setBossHp(100);
    setPlayerHp(100);
    setPlayerShield(0);
    setIsPlayerTurn(true);
    setIsAnimating(false);
    setHitAnimation(null);
    setCombatLog("ตาของคุณ! เลือกการ์ดสกิลเพื่อต่อสู้กับบิ๊กกุย");
    setIsVictory(false);
    setIsDefeat(false);
  };

  return (
    <div className="turnbased-viewport">
      {/* Background Layer — same standard VN background (vn_prologue2_bg.png) */}
      <div className="vn-bg-image turnbased-bg-image" />

      {/* Top Logo */}
      <div className="turnbased-top-logo">
        <Image
          src="/assets/logo/logo_negative.png"
          alt="Logo"
          width={219}
          height={116}
          className="turnbased-logo-img"
          priority
        />
      </div>

      {/* Top-right Map Button */}
      <button
        className="vn-top-map-btn turnbased-top-map-btn"
        onClick={goToMap}
        aria-label="ไปยังแผนที่"
        title="ไปยังแผนที่"
      >
        <MapIcon />
        <span>แผนที่</span>
      </button>

      {/* Top Boss HP Bar UI */}
      <div className="combat-hp-bar-wrapper boss-hp-bar-wrapper" role="status" aria-label="บิ๊กกุย HP">
        <div className="combat-hp-label">
          <span className="combat-hp-name">บิ๊กกุย</span>
          <span className="combat-hp-value">{bossHp} / {bossMaxHp}</span>
        </div>
        <div className="combat-hp-track">
          <div
            className="combat-hp-fill"
            style={{ width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%` }}
            role="progressbar"
            aria-valuenow={bossHp}
            aria-valuemin={0}
            aria-valuemax={bossMaxHp}
          />
        </div>
      </div>

      {/* Boss Sprite (pha.png) — Sits underneath UI layers (z-index: 2) so UIs overlap over it */}
      <div className={`turnbased-boss-sprite-wrapper ${hitAnimation === "boss-hit" ? "anim-boss-hit" : ""}`}>
        <Image
          src="/assets/pha.png"
          alt="บิ๊กกุย"
          width={529}
          height={749}
          className="turnbased-boss-img"
          priority
          unoptimized
        />
      </div>

      {/* ── Player Section & UI Overlay ── */}
      <div className="turnbased-player-section">
        {/* Status Text — Standard VN Dialogue Box */}
        <div className="vn-dialogue-wrapper turnbased-dialogue-box">
          <div className="vn-speaker-badge">
            <span>บ่อแซลมอนวิเศษ</span>
          </div>
          <div className="vn-dialogue-card">
            <p className="vn-dialogue-text">{combatLog}</p>
          </div>
        </div>

        {/* ── 3 Skill Cards Container (Figma node #76:207, #76:208, #76:209) ── */}
        <div className="turnbased-skills-container">
          {/* Card 1: Heal 15 */}
          <button
            className={`turnbased-skill-card ${!isPlayerTurn || isAnimating ? "disabled" : ""}`}
            onClick={() => handleUseSkill("heal")}
            disabled={!isPlayerTurn || isAnimating}
            aria-label="การ์ดฟื้นฟู 15 HP"
          >
            <Image
              src="/assets/skills/heal 15.png"
              alt="Heal 15"
              width={122}
              height={267}
              className="turnbased-card-img"
              unoptimized
            />
          </button>

          {/* Card 2: Attack 20 */}
          <button
            className={`turnbased-skill-card ${!isPlayerTurn || isAnimating ? "disabled" : ""}`}
            onClick={() => handleUseSkill("attack")}
            disabled={!isPlayerTurn || isAnimating}
            aria-label="การ์ดโจมตี 20 Damage"
          >
            <Image
              src="/assets/skills/attack 20.png"
              alt="Attack 20"
              width={122}
              height={267}
              className="turnbased-card-img"
              unoptimized
            />
          </button>

          {/* Card 3: Block 20 */}
          <button
            className={`turnbased-skill-card ${!isPlayerTurn || isAnimating ? "disabled" : ""}`}
            onClick={() => handleUseSkill("block")}
            disabled={!isPlayerTurn || isAnimating}
            aria-label="การ์ดป้องกัน 20 Shield"
          >
            <Image
              src="/assets/skills/block 20.png"
              alt="Block 20"
              width={122}
              height={267}
              className="turnbased-card-img"
              unoptimized
            />
          </button>
        </div>

        {/* Player HP & Shield Bar — Positioned below skill cards, strictly centered */}
        <div className="player-hp-bar-wrapper" role="status" aria-label="ผู้กล้าแบม HP">
          <div className="combat-hp-label">
            <span className="combat-hp-name">
              ผู้กล้าแบม
              {playerShield > 0 && (
                <>
                  <ShieldIcon />
                  <span>+{playerShield}</span>
                </>
              )}
            </span>
            <span className="combat-hp-value">{playerHp} / {playerMaxHp}</span>
          </div>
          <div className="combat-hp-track">
            <div
              className="combat-hp-fill"
              style={{ width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%` }}
              role="progressbar"
              aria-valuenow={playerHp}
              aria-valuemin={0}
              aria-valuemax={playerMaxHp}
            />
          </div>
        </div>
      </div>

      {/* ── Victory Overlay ── */}
      {isVictory && (
        <div className="turnbased-overlay victory-overlay" role="dialog" aria-label="Victory">
          <div className="turnbased-modal-content">
            <h2 className="turnbased-modal-title">ชัยชนะสุดยิ่งใหญ่!</h2>
            <p className="turnbased-modal-desc">
              ผู้กล้าแบม ปราบ บิ๊กกุย ได้สำเร็จและทวงคืนบ่อแซลมอนวิเศษให้แก่กุยโทเปีย!
            </p>
            <button className="turnbased-modal-btn" onClick={goToMap}>
              กลับสู่แผนที่
            </button>
          </div>
        </div>
      )}

      {/* ── Defeat / Game Over Overlay — Same StageFail component as other stages ── */}
      {isDefeat && <StageFail />}
    </div>
  );
}
