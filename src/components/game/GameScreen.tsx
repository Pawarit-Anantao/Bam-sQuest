"use client";

import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import type { DialogueNode, QuizNode, ChoiceNode } from "@/types/game";
import HPBar from "./ui/HPBar";
import DialogueBox from "./ui/DialogueBox";
import QuizOverlay from "./ui/QuizOverlay";
import ChoiceOverlay from "./ui/ChoiceOverlay";
import StageWin from "./ui/StageWin";
import StageFail from "./ui/StageFail";
import MapScreen from "./ui/MapScreen";
import Image from "next/image";

import StageSelectModal from "./ui/StageSelectModal";
import TurnbasedCombat from "./TurnbasedCombat";

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

// ─────────────────────────────────────────────────────────────
// Game Screen — Dual Sprite VN Gameplay (Mobile & Desktop)
// ─────────────────────────────────────────────────────────────
export default function GameScreen() {
  const { script, currentStage, currentNodeId, phase, enemyHp, goToMap } = useGameStore();

  const [isStageSelectOpen, setIsStageSelectOpen] = useState(false);

  // Active Bam expression state
  const [activeBamSprite, setActiveBamSprite] = useState<string>("Bam_normal");

  // Track whether we've passed the enter_combat_scene action for the noble stage
  const combatEnteredRef = useRef(false);
  const [inCombatScene, setInCombatScene] = useState(false);

  // Resolve current script node
  const stage = script?.[currentStage];
  const currentNode = stage?.sequence.find((n) => n.id === currentNodeId);

  const isWin = phase === "win";
  const isQuiz = phase === "quiz";
  const isDialogue = phase === "dialogue" && currentNode?.type === "dialogue";
  const isChoice = phase === "choice" && currentNode?.type === "choice";

  const dialogueNode = isDialogue ? (currentNode as DialogueNode) : null;
  const speaker = dialogueNode?.speaker ?? "";

  // Update Bam's expression if current node specifies a Bam sprite
  useEffect(() => {
    if (dialogueNode?.sprite && dialogueNode.sprite.startsWith("Bam")) {
      const cleanName = dialogueNode.sprite.replace(".png", "");
      setActiveBamSprite(cleanName);
    }
  }, [dialogueNode]);

  const isNobleStage = currentStage === "stage_1_noble_nueng";
  const isTofuStage = currentStage === "stage_2_tofu" || currentStage === "tofu_mansion";

  // Is Aun active speaker?
  const isAunActive = speaker === "อ้วน";
  // Is Bam active speaker?
  const isBamActive = speaker === "แบม";
  // Is Noble active speaker?
  const isNobleActive = speaker === "ขุนนางหนึ่ง";
  // Is Tofu active speaker?
  const isTofuActive = speaker === "โทฟุ";

  // Determine if we are actively in combat (requires enemyHp > 0 and quiz)
  const isCombatScene = enemyHp > 0 && isQuiz;

  // Standard Dual Character Sprites (Bam & Aun) — show during non-combat cutscenes (intro/exploration)
  const showVnSprites =
    !isCombatScene &&
    (currentStage === "intro_stage" ||
      currentStage === "stage_1_exploration" ||
      (isDialogue && !isNobleStage && !isTofuStage));

  // Noble stage conversation sprites (Bam & Noble) — show before entering combat AND after enemy HP is out (0)
  const showNoblePrecombatSprites = !isCombatScene && isNobleStage && isDialogue;

  // Tofu stage conversation sprites (Bam & Tofu) — show during dialogue scenes
  const showTofuPrecombatSprites = !isCombatScene && isTofuStage && isDialogue;

  const isMapExploration = currentStage === "stage_1_exploration";

  // Combat scene: show ONLY the enemy sprite in center while enemy HP > 0
  const showEnemySprite = isCombatScene && !isWin;

  // Background style override if custom non-default background set
  const customBgStyle =
    stage?.background &&
    stage.background !== "vn_prologue2_bg.png" &&
    stage.background !== "bg_desktop.png" &&
    stage.background !== "map_mobile_bg.png"
      ? { backgroundImage: `url('/assets/${stage.background}')` }
      : undefined;

  if (phase === "map") {
    return <MapScreen />;
  }

  // Final Stage: บ่อแซลมอนวิเศษ — Turn-Based Boss Battle against บิ๊กกุย (pha.png)
  if (currentStage === "salmon_pool") {
    return <TurnbasedCombat />;
  }

  return (
    <div className="vn-viewport">
      {/* ─── Layer 1: Background & Sprites ───────────────── */}
      <div className="game-canvas-layer">
        {/* Background — always standard VN bg (vn_prologue2_bg.png / bg_desktop.png)
            for all cutscenes and combat. Map screen uses its own bg via MapScreen component. */}
        <div className={`vn-bg-image ${isMapExploration ? "vn-bg-map" : ""}`} style={customBgStyle} />

        {/* Top-left Logo (Click to open Stage Select Modal) */}
        <div className="vn-top-logo">
          <button
            className="vn-top-logo-btn"
            onClick={() => setIsStageSelectOpen(true)}
            aria-label="เลือกบท / ฉากที่ต้องการเล่น"
            title="เลือกบท / ฉากที่ต้องการเล่น"
          >
            <Image
              src="/assets/logo/logo_negative.png"
              alt="Logo"
              width={219}
              height={116}
              className="vn-logo-img"
              priority
            />
          </button>
        </div>

        {/* Top-right Map Button */}
        <button
          className="vn-top-map-btn"
          onClick={goToMap}
          aria-label="ไปยังแผนที่"
          title="ไปยังแผนที่"
        >
          <MapIcon />
          <span>แผนที่</span>
        </button>

        {/* Standard Dual Character Sprites (Bam on Left, Aun on Right) — intro/prologue */}
        {showVnSprites && (
          <div className="vn-dual-sprites-container">
            {/* Left Sprite: Bam */}
            <div
              className={`vn-sprite-wrapper vn-sprite-left ${
                isBamActive ? "active" : isAunActive ? "inactive" : "neutral"
              }`}
            >
              <Image
                key={activeBamSprite}
                src={`/assets/Bam sprites/${activeBamSprite}.png`}
                alt="แบม"
                width={509}
                height={771}
                className="vn-sprite-img"
                style={{ width: "auto", height: "100%" }}
                unoptimized
                priority
              />
            </div>

            {/* Right Sprite: Aun (aun.png) */}
            <div
              className={`vn-sprite-wrapper vn-sprite-right ${
                isAunActive ? "active" : isBamActive ? "inactive" : "neutral"
              }`}
            >
              <Image
                src="/assets/aun.png"
                alt="อ้วน"
                width={509}
                height={771}
                className="vn-sprite-img"
                style={{ width: "auto", height: "100%" }}
                unoptimized
                priority
              />
            </div>
          </div>
        )}

        {/* Noble Stage Pre-Combat: Bam (left) + Noble ขุนนางหนึ่ง (right) */}
        {showNoblePrecombatSprites && (
          <div className="vn-dual-sprites-container">
            {/* Left Sprite: Bam */}
            <div
              className={`vn-sprite-wrapper vn-sprite-left ${
                isBamActive ? "active" : isNobleActive ? "inactive" : "neutral"
              }`}
            >
              <Image
                key={activeBamSprite}
                src={`/assets/Bam sprites/${activeBamSprite}.png`}
                alt="แบม"
                width={509}
                height={771}
                className="vn-sprite-img"
                style={{ width: "auto", height: "100%" }}
                unoptimized
                priority
              />
            </div>

            {/* Right Sprite: ขุนนางหนึ่ง (1.png) */}
            <div
              className={`vn-sprite-wrapper vn-sprite-right ${
                isNobleActive ? "active" : isBamActive ? "inactive" : "neutral"
              }`}
            >
              <Image
                src="/assets/1.png"
                alt="ขุนนางหนึ่ง"
                width={509}
                height={771}
                className="vn-sprite-img"
                style={{ width: "auto", height: "100%" }}
                unoptimized
                priority
              />
            </div>
          </div>
        )}

        {/* Tofu Stage Pre-Combat: Bam (left) + Tofu (right) */}
        {showTofuPrecombatSprites && (
          <div className="vn-dual-sprites-container">
            {/* Left Sprite: Bam */}
            <div
              className={`vn-sprite-wrapper vn-sprite-left ${
                isBamActive ? "active" : isTofuActive || isAunActive ? "inactive" : "neutral"
              }`}
            >
              <Image
                key={activeBamSprite}
                src={`/assets/Bam sprites/${activeBamSprite}.png`}
                alt="แบม"
                width={509}
                height={771}
                className="vn-sprite-img"
                style={{ width: "auto", height: "100%" }}
                unoptimized
                priority
              />
            </div>

            {/* Right Sprite: โทฟุ (tofu.png) */}
            <div
              className={`vn-sprite-wrapper vn-sprite-right ${
                isTofuActive || isAunActive ? "active" : isBamActive ? "inactive" : "neutral"
              }`}
            >
              <Image
                src="/assets/tofu.png"
                alt="โทฟุ"
                width={509}
                height={771}
                className="vn-sprite-img"
                style={{ width: "auto", height: "100%" }}
                unoptimized
                priority
              />
            </div>
          </div>
        )}

        {/* ── Combat Enemy — centered, HP bar above head */}
        {showEnemySprite && (
          <div className="combat-enemy-actor">
            {/* HP bar floats above the sprite's head */}
            {!isWin && <HPBar />}
            {/* Enemy sprite — centered, large */}
            <Image
              src={`/assets/${stage?.enemy_sprite ?? "1.png"}`}
              alt={stage?.enemy_name ?? "Enemy"}
              width={509}
              height={771}
              className="combat-enemy-sprite-img"
              priority
              unoptimized
            />
          </div>
        )}
      </div>

      {/* ─── Layer 2: React UI Overlay ───────────────────── */}
      <div className="game-ui-layer">
        {/* HP Bar is now inside the combat-enemy-actor container above the sprite's head */}

        {/* Dialogue box */}
        {isDialogue && dialogueNode && (
          <DialogueBox node={dialogueNode} />
        )}

        {/* Choice overlay */}
        {isChoice && (
          <ChoiceOverlay node={currentNode as ChoiceNode} />
        )}

        {/* Quiz overlay */}
        {isQuiz && (
          <QuizOverlay node={currentNode as QuizNode} />
        )}

        {/* Win screen */}
        {isWin && <StageWin />}

        {/* Fail screen (Figma node #65:131) */}
        {phase === "fail" && <StageFail />}

        {/* Stage Select Modal */}
        <StageSelectModal
          isOpen={isStageSelectOpen}
          onClose={() => setIsStageSelectOpen(false)}
        />
      </div>
    </div>
  );
}

