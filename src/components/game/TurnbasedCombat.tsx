"use client";

import { useState, useRef } from "react";
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
      stroke="#ffffff"
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

  // Boss (บิ๊กกุย) State — synchronized with Refs to prevent stale closures in async timeouts
  const [bossHp, setBossHp] = useState(100);
  const bossHpRef = useRef(bossHp);
  bossHpRef.current = bossHp;

  const bossMaxHp = 100;

  const [bossShield, setBossShield] = useState(0);
  const bossShieldRef = useRef(bossShield);
  bossShieldRef.current = bossShield;

  const [bossBuffTurns, setBossBuffTurns] = useState(0);
  const bossBuffTurnsRef = useRef(bossBuffTurns);
  bossBuffTurnsRef.current = bossBuffTurns;

  // Player (ผู้กล้าแบม) State — synchronized with Refs
  const [playerHp, setPlayerHp] = useState(100);
  const playerHpRef = useRef(playerHp);
  playerHpRef.current = playerHp;

  const playerMaxHp = 100;

  const [playerShield, setPlayerShield] = useState(0);
  const playerShieldRef = useRef(playerShield);
  playerShieldRef.current = playerShield;

  // Speaker & Combat Text State
  const [speakerName, setSpeakerName] = useState<string>("ผู้กล้าแบม");
  const [combatLog, setCombatLog] = useState<string>("ตาของคุณ! เลือกการ์ดสกิลเพื่อต่อสู้กับบิ๊กกุย");

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hitAnimation, setHitAnimation] = useState<"boss-hit" | "player-hit" | null>(null);

  const [isVictory, setIsVictory] = useState(false);
  const [isDefeat, setIsDefeat] = useState(false);

  // Player action handler
  const handleUseSkill = (
    skillType: "attack" | "heal" | "block",
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e?.currentTarget) {
      e.currentTarget.blur();
    }
    if (!isPlayerTurn || isAnimating || isVictory || isDefeat) return;

    setIsAnimating(true);
    setSpeakerName("ผู้กล้าแบม");
    let logMsg = "";
    let isFinished = false;

    if (skillType === "attack") {
      const dmg = 20;
      setHitAnimation("boss-hit");

      let remainingDmg = dmg;
      let currentBossShield = bossShieldRef.current;
      let newBossShield = currentBossShield;

      if (currentBossShield > 0) {
        if (currentBossShield >= dmg) {
          newBossShield = currentBossShield - dmg;
          remainingDmg = 0;
        } else {
          remainingDmg = dmg - currentBossShield;
          newBossShield = 0;
        }
      }

      const nextBossHp = Math.max(0, bossHpRef.current - remainingDmg);

      bossShieldRef.current = newBossShield;
      bossHpRef.current = nextBossHp;

      setBossShield(newBossShield);
      setBossHp(nextBossHp);

      logMsg = `ผู้กล้าแบม ใช้การ์ดโจมตี! สร้างความเสียหาย 20 แต้มแก่ บิ๊กกุย`;

      // Check Victory
      if (nextBossHp <= 0) {
        isFinished = true;
        setTimeout(() => {
          setIsVictory(true);
          setIsAnimating(false);
        }, 600);
      }
    } else if (skillType === "heal") {
      const healAmt = 15;
      const nextPlayerHp = Math.min(playerMaxHp, playerHpRef.current + healAmt);
      playerHpRef.current = nextPlayerHp;
      setPlayerHp(nextPlayerHp);
      logMsg = `ผู้กล้าแบม ใช้การ์ดฟื้นฟู! ฟื้นฟู HP 15 แต้ม`;
    } else if (skillType === "block") {
      const shieldAmt = 20;
      playerShieldRef.current = shieldAmt;
      setPlayerShield(shieldAmt); // Non-stackable max 20 shield
      logMsg = `ผู้กล้าแบม ใช้การ์ดป้องกัน! รับเกราะป้องกัน 20 แต้ม`;
    }

    setCombatLog(logMsg);

    if (isFinished) return;

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
      const isBuffActive = bossBuffTurnsRef.current > 0;
      const powerBoost = isBuffActive ? 5 : 0;
      const baseSkillVal = 15 + powerBoost; // 15 base or 20 if buffed

      // Decrement buff turn count if active
      if (isBuffActive) {
        const nextBuffTurns = Math.max(0, bossBuffTurnsRef.current - 1);
        bossBuffTurnsRef.current = nextBuffTurns;
        setBossBuffTurns(nextBuffTurns);
      }

      // Aggressive Strategic AI Skill Selection logic — Attacks player more frequently
      let chosenSkill: "attack" | "heal" | "defense" | "buff";

      const currentEffectivePlayerHp = playerHpRef.current + playerShieldRef.current;
      const currentBossHp = bossHpRef.current;

      if (currentEffectivePlayerHp <= baseSkillVal && Math.random() < 0.95) {
        // Priority 1: Finish off player if within kill range (95% chance)
        chosenSkill = "attack";
      } else if (!isBuffActive && Math.random() < 0.65) {
        // Priority 2: Cast buff on turn 1 or when expired to boost attack
        chosenSkill = "buff";
      } else if (currentBossHp <= 30 && Math.random() < 0.45) {
        // Priority 3: Emergency heal only when HP drops very low (≤ 30%)
        chosenSkill = "heal";
      } else {
        // Priority 4: Aggressive attack focus (80% Attack, 12% Defense, 8% Heal)
        const roll = Math.random();
        if (roll < 0.8) chosenSkill = "attack";
        else if (roll < 0.92) chosenSkill = "defense";
        else chosenSkill = "heal";
      }

      // Execute chosen Boss Skill
      if (chosenSkill === "attack") {
        setHitAnimation("player-hit");

        let remainingDmg = baseSkillVal;
        let currentShield = playerShieldRef.current;
        let newPlayerShield = currentShield;

        if (currentShield > 0) {
          if (currentShield >= baseSkillVal) {
            newPlayerShield = currentShield - baseSkillVal;
            remainingDmg = 0;
          } else {
            remainingDmg = baseSkillVal - currentShield;
            newPlayerShield = 0;
          }
        }

        const currentHp = playerHpRef.current;
        const nextPlayerHp = Math.max(0, currentHp - remainingDmg);

        playerShieldRef.current = newPlayerShield;
        playerHpRef.current = nextPlayerHp;

        setPlayerShield(newPlayerShield);
        setPlayerHp(nextPlayerHp);

        setCombatLog(
          `บิ๊กกุย ใช้สกิลโจมตี! สร้างความเสียหาย ${baseSkillVal} แต้มแก่ ผู้กล้าแบม`
        );

        if (nextPlayerHp <= 0) {
          setTimeout(() => setIsDefeat(true), 600);
        }
      } else if (chosenSkill === "heal") {
        const nextBossHp = Math.min(bossMaxHp, bossHpRef.current + baseSkillVal);
        bossHpRef.current = nextBossHp;
        setBossHp(nextBossHp);
        setCombatLog(
          `บิ๊กกุย ใช้สกิลฟื้นฟู! ฟื้นฟู HP ${baseSkillVal} แต้มแก่ตนเอง`
        );
      } else if (chosenSkill === "defense") {
        bossShieldRef.current = baseSkillVal;
        setBossShield(baseSkillVal);
        setCombatLog(
          `บิ๊กกุย ใช้สกิลป้องกัน! รับเกราะป้องกัน ${baseSkillVal} แต้ม`
        );
      } else if (chosenSkill === "buff") {
        // Sets buff for 3 turns (non-stackable +5 bonus)
        bossBuffTurnsRef.current = 3;
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
    bossHpRef.current = 100;
    setBossShield(0);
    bossShieldRef.current = 0;
    setBossBuffTurns(0);
    bossBuffTurnsRef.current = 0;
    setPlayerHp(100);
    playerHpRef.current = 100;
    setPlayerShield(0);
    playerShieldRef.current = 0;
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
              <span style={{ color: "#ffffff", marginLeft: "4px", fontSize: "13px" }}>
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
            onClick={(e) => handleUseSkill("heal", e)}
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
            onClick={(e) => handleUseSkill("attack", e)}
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
            onClick={(e) => handleUseSkill("block", e)}
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
