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

function BuffIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f5c842"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "-0.12em", marginRight: "3px", marginLeft: "6px" }}
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export default function TurnbasedCombat() {
  const { goToMap } = useGameStore();

  // Boss (บิ๊กกุย) State — 4 skills: attack(15), heal(15), defense(15), buff(+5 for 3 turns, non-stackable)
  const [bossHp, setBossHp] = useState(100);
  const bossMaxHp = 100;
  const [bossShield, setBossShield] = useState(0);
  const [bossBuffTurns, setBossBuffTurns] = useState(0);

  // Player (ผู้กล้าแบม) State
  const [playerHp, setPlayerHp] = useState(100);
  const playerMaxHp = 100;
  const [playerShield, setPlayerShield] = useState(0);

  // Speaker & Combat Text State
  const [speakerName, setSpeakerName] = useState<string>("ผู้กล้าแบม");
  const [combatLog, setCombatLog] = useState<string>("ตาของคุณ! เลือกการ์ดสกิลเพื่อต่อสู้กับบิ๊กกุย");

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hitAnimation, setHitAnimation] = useState<"boss-hit" | "player-hit" | null>(null);

  const [isVictory, setIsVictory] = useState(false);
  const [isDefeat, setIsDefeat] = useState(false);

  // Player action handler
  const handleUseSkill = (skillType: "attack" | "heal" | "block") => {
    if (!isPlayerTurn || isAnimating || isVictory || isDefeat) return;

    setIsAnimating(true);
    setSpeakerName("ผู้กล้าแบม");
    let logMsg = "";
    let newBossHp = bossHp;

    if (skillType === "attack") {
      const dmg = 20;
      setHitAnimation("boss-hit");

      // Reduce boss shield first, remaining hits boss HP
      setBossShield((prevShield) => {
        let remainingDmg = dmg;
        let newShield = prevShield;

        if (prevShield > 0) {
          if (prevShield >= dmg) {
            newShield = prevShield - dmg;
            remainingDmg = 0;
          } else {
            remainingDmg = dmg - prevShield;
            newShield = 0;
          }
        }

        setBossHp((prevHp) => {
          newBossHp = Math.max(0, prevHp - remainingDmg);
          return newBossHp;
        });

        return newShield;
      });

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

    // Pass turn to Boss after 0.9s
    setTimeout(() => {
      setHitAnimation(null);
      setIsPlayerTurn(false);
      executeBossTurn();
    }, 900);
  };

  // Boss (บิ๊กกุย) Strategic AI turn — Smart decision making under 4-skill set
  const executeBossTurn = () => {
    setSpeakerName("บิ๊กกุย");
    setCombatLog("บิ๊กกุย กำลังวิเคราะห์สถานการณ์เพื่อเลือกทักษะ...");

    setTimeout(() => {
      // Current buff bonus: +5 power if active (non-stackable)
      const isBuffActive = bossBuffTurns > 0;
      const powerBoost = isBuffActive ? 5 : 0;
      const baseSkillVal = 15 + powerBoost; // 15 base or 20 if buffed

      // Decrement buff turn count if active
      if (isBuffActive) {
        setBossBuffTurns((prev) => Math.max(0, prev - 1));
      }

      // Strategic AI Skill Selection logic
      let chosenSkill: "attack" | "heal" | "defense" | "buff";

      if (!isBuffActive && Math.random() < 0.7) {
        // Priority 1: Cast buff on turn 1 or when expired
        chosenSkill = "buff";
      } else if (bossHp <= 45 && Math.random() < 0.75) {
        // Priority 2: Heal when HP falls below 45%
        chosenSkill = "heal";
      } else if (playerHp + playerShield <= baseSkillVal && Math.random() < 0.85) {
        // Priority 3: Attack if player is within kill range
        chosenSkill = "attack";
      } else if (bossShield < 15 && playerHp > 40 && Math.random() < 0.6) {
        // Priority 4: Shield up if boss shield is low
        chosenSkill = "defense";
      } else {
        // Priority 5: Tactical mix
        const roll = Math.random();
        if (roll < 0.55) chosenSkill = "attack";
        else if (roll < 0.8) chosenSkill = "defense";
        else chosenSkill = "heal";
      }

      // Execute chosen Boss Skill
      if (chosenSkill === "attack") {
        setHitAnimation("player-hit");

        setPlayerShield((prevShield) => {
          let remainingDmg = baseSkillVal;
          let newShield = prevShield;

          if (prevShield > 0) {
            if (prevShield >= baseSkillVal) {
              newShield = prevShield - baseSkillVal;
              remainingDmg = 0;
            } else {
              remainingDmg = baseSkillVal - prevShield;
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

        setCombatLog(
          `บิ๊กกุย ใช้สกิลโจมตี! สร้างความเสียหาย ${baseSkillVal} แต้มแก่ ผู้กล้าแบม`
        );
      } else if (chosenSkill === "heal") {
        setBossHp((prev) => Math.min(bossMaxHp, prev + baseSkillVal));
        setCombatLog(
          `บิ๊กกุย ใช้สกิลฟื้นฟู! ฟื้นฟู HP ${baseSkillVal} แต้มแก่ตนเอง`
        );
      } else if (chosenSkill === "defense") {
        setBossShield((prev) => prev + baseSkillVal);
        setCombatLog(
          `บิ๊กกุย ใช้สกิลป้องกัน! เพิ่มเกราะป้องกัน ${baseSkillVal} แต้ม`
        );
      } else if (chosenSkill === "buff") {
        // Sets buff for 3 turns (non-stackable +5 bonus)
        setBossBuffTurns(3);
        setCombatLog(
          `บิ๊กกุย ใช้สกิลบัฟ! เพิ่มพลังสกิลทุกทักษะ +5 แต้ม เป็นเวลา 3 ตา!`
        );
      }

      setTimeout(() => {
        setHitAnimation(null);
        setIsPlayerTurn(true);
        setIsAnimating(false);
      }, 1000);
    }, 900);
  };

  // Reset Battle
  const handleRestart = () => {
    setBossHp(100);
    setBossShield(0);
    setBossBuffTurns(0);
    setPlayerHp(100);
    setPlayerShield(0);
    setIsPlayerTurn(true);
    setIsAnimating(false);
    setHitAnimation(null);
    setSpeakerName("ผู้กล้าแบม");
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
          <span className="combat-hp-name">
            บิ๊กกุย
            {bossShield > 0 && (
              <>
                <ShieldIcon />
                <span>+{bossShield}</span>
              </>
            )}
            {bossBuffTurns > 0 && (
              <span style={{ color: "#f5c842", marginLeft: "4px", fontSize: "13px" }}>
                <BuffIcon />
                <span>+5 ({bossBuffTurns} ตา)</span>
              </span>
            )}
          </span>
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
        {/* Status Text — Standard VN Dialogue Box with dynamic Speaker Name (ผู้กล้าแบม / บิ๊กกุย) */}
        <div className="vn-dialogue-wrapper turnbased-dialogue-box">
          <div className="vn-speaker-badge">
            <span>{speakerName}</span>
          </div>
          <div className="vn-dialogue-card">
            <p className="vn-dialogue-text">{combatLog}</p>
          </div>
        </div>

        {/* ── 3 Skill Cards Container ── */}
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
