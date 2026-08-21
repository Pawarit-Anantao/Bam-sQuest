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

function WhiteFireDust() {
  const particles = [
    { id: 1, left: "4%", size: 3, duration: 5.2, delay: 0.1 },
    { id: 2, left: "11%", size: 4, duration: 6.8, delay: 1.5 },
    { id: 3, left: "18%", size: 2, duration: 4.5, delay: 0.8 },
    { id: 4, left: "24%", size: 5, duration: 7.1, delay: 2.2 },
    { id: 5, left: "29%", size: 3, duration: 5.9, delay: 0.4 },
    { id: 6, left: "35%", size: 4, duration: 6.3, delay: 3.1 },
    { id: 7, left: "41%", size: 2, duration: 4.8, delay: 1.2 },
    { id: 8, left: "47%", size: 5, duration: 7.5, delay: 2.7 },
    { id: 9, left: "53%", size: 3, duration: 5.4, delay: 0.6 },
    { id: 10, left: "59%", size: 4, duration: 6.1, delay: 1.8 },
    { id: 11, left: "64%", size: 2, duration: 4.2, delay: 3.5 },
    { id: 12, left: "71%", size: 5, duration: 7.8, delay: 0.3 },
    { id: 13, left: "77%", size: 3, duration: 5.6, delay: 2.0 },
    { id: 14, left: "83%", size: 4, duration: 6.5, delay: 1.0 },
    { id: 15, left: "89%", size: 2, duration: 4.9, delay: 2.8 },
    { id: 16, left: "95%", size: 5, duration: 7.2, delay: 0.5 },
    { id: 17, left: "7%", size: 3, duration: 5.1, delay: 3.2 },
    { id: 18, left: "15%", size: 4, duration: 6.4, delay: 2.4 },
    { id: 19, left: "22%", size: 2, duration: 4.7, delay: 1.1 },
    { id: 20, left: "32%", size: 5, duration: 7.9, delay: 0.7 },
    { id: 21, left: "44%", size: 3, duration: 5.3, delay: 2.9 },
    { id: 22, left: "56%", size: 4, duration: 6.7, delay: 1.6 },
    { id: 23, left: "67%", size: 2, duration: 4.4, delay: 3.8 },
    { id: 24, left: "74%", size: 5, duration: 7.0, delay: 0.2 },
    { id: 25, left: "81%", size: 3, duration: 5.8, delay: 2.1 },
    { id: 26, left: "88%", size: 4, duration: 6.2, delay: 1.4 },
    { id: 27, left: "93%", size: 2, duration: 4.6, delay: 3.0 },
    { id: 28, left: "49%", size: 4, duration: 6.9, delay: 2.5 },
  ];

  return (
    <div className="white-fire-dust-overlay" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="white-dust-ember"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
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

  // Boss Ultimate Charger (0 to 3 squares). Full (3) triggers 50 damage ultimate attack!
  const [bossUltCharge, setBossUltCharge] = useState(0);
  const bossUltChargeRef = useRef(bossUltCharge);
  bossUltChargeRef.current = bossUltCharge;

  // Boss Last Stand mechanic tracking (Boss survives at 1 HP once for 1 final turn)
  const [bossHasLastStand, setBossHasLastStand] = useState(false);
  const bossHasLastStandRef = useRef(bossHasLastStand);
  bossHasLastStandRef.current = bossHasLastStand;

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

      const rawNextBossHp = bossHpRef.current - remainingDmg;
      let nextBossHp = Math.max(0, rawNextBossHp);

      // Boss Last Stand Mechanic: When boss takes lethal damage for the first time, HP clamps to 1 HP for 1 final turn!
      if (rawNextBossHp <= 0 && !bossHasLastStandRef.current) {
        nextBossHp = 1;
        bossHasLastStandRef.current = true;
        setBossHasLastStand(true);
        logMsg = `ผู้กล้าแบม โจมตีหนัก! บิ๊กกุย ทนทานด้วยพลังเฮือกสุดท้ายเหลือ 1 HP!`;
      } else {
        logMsg = `ผู้กล้าแบม ใช้การ์ดโจมตี! สร้างความเสียหาย 20 แต้มแก่ บิ๊กกุย`;
      }

      bossShieldRef.current = newBossShield;
      bossHpRef.current = nextBossHp;

      setBossShield(newBossShield);
      setBossHp(nextBossHp);

      // Check Victory — only if boss HP reaches 0 (after last stand turn)
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

  // Boss (บิ๊กกุย) Strategic AI turn — Ultimate charger & 4-skill set
  const executeBossTurn = () => {
    setSpeakerName("บิ๊กกุย");
    setCombatLog("บิ๊กกุย กำลังวิเคราะห์สถานการณ์เพื่อเลือกทักษะ...");

    setTimeout(() => {
      // Check if Ultimate Skill Charger is Full (3/3)
      if (bossUltChargeRef.current >= 3) {
        // Randomly choose 40 Damage Attack or 40 Heal (50% chance each)
        const isUltAttack = Math.random() < 0.5;

        if (isUltAttack) {
          setHitAnimation("player-hit");
          const ultDmg = 40;

          let remainingDmg = ultDmg;
          let currentShield = playerShieldRef.current;
          let newPlayerShield = currentShield;

          if (currentShield > 0) {
            if (currentShield >= ultDmg) {
              newPlayerShield = currentShield - ultDmg;
              remainingDmg = 0;
            } else {
              remainingDmg = ultDmg - currentShield;
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
            `บิ๊กกุย ปลดปล่อยบังไค! สร้างความเสียหาย 40 แต้มมหาศาล!`
          );

          if (nextPlayerHp <= 0) {
            setTimeout(() => setIsDefeat(true), 600);
          }
        } else {
          const ultHeal = 40;
          const nextBossHp = Math.min(bossMaxHp, bossHpRef.current + ultHeal);
          bossHpRef.current = nextBossHp;
          setBossHp(nextBossHp);

          setCombatLog(
            `บิ๊กกุย ปลดปล่อยบังไค! ฟื้นฟู HP 40 แต้มมหาศาล!`
          );
        }

        // Reset Ultimate Charger
        bossUltChargeRef.current = 0;
        setBossUltCharge(0);

        setTimeout(() => {
          setHitAnimation(null);
          setIsPlayerTurn(true);
          setIsAnimating(false);
        }, 1000);

        return;
      }

      // Increment Ultimate Charger by 1 on normal action turn
      const nextUltCharge = Math.min(3, bossUltChargeRef.current + 1);
      bossUltChargeRef.current = nextUltCharge;
      setBossUltCharge(nextUltCharge);

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
        const nextShield = Math.min(40, bossShieldRef.current + baseSkillVal);
        bossShieldRef.current = nextShield;
        setBossShield(nextShield);
        setCombatLog(
          `บิ๊กกุย ใช้สกิลป้องกัน! เพิ่มเกราะป้องกัน ${baseSkillVal} แต้ม`
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
    setBossUltCharge(0);
    bossUltChargeRef.current = 0;
    setBossHasLastStand(false);
    bossHasLastStandRef.current = false;
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

      {/* White Fire Dust / Floating Ambient Embers Layer */}
      <WhiteFireDust />

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

        {/* 3 White Boxes Ultimate Skill Charger — Prominently displayed under HP track */}
        <div className="boss-ult-bar-row" title={`Ultimate Charge: ${bossUltCharge}/3`}>
          <span className="boss-ult-bar-text">ไม้ตาย:</span>
          <div className="boss-ult-boxes-row">
            <div className={`boss-ult-box ${bossUltCharge >= 1 ? "filled" : ""}`} />
            <div className={`boss-ult-box ${bossUltCharge >= 2 ? "filled" : ""}`} />
            <div className={`boss-ult-box ${bossUltCharge >= 3 ? "filled full" : ""}`} />
          </div>
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

        {/* 3 White Boxes Ultimate Skill Charger floating over Boss Sprite */}
        <div className="boss-sprite-ult-charger" title={`Ultimate Charge: ${bossUltCharge}/3`}>
          <div className={`boss-ult-box ${bossUltCharge >= 1 ? "filled" : ""}`} />
          <div className={`boss-ult-box ${bossUltCharge >= 2 ? "filled" : ""}`} />
          <div className={`boss-ult-box ${bossUltCharge >= 3 ? "filled full" : ""}`} />
        </div>
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
