import { create } from "zustand";
import type { GameState, ScriptData, ScriptNode, GamePhase, ActionNode } from "@/types/game";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getNodeById(script: ScriptData, stageId: string, nodeId: string): ScriptNode | undefined {
  const stage = script[stageId];
  if (!stage) return undefined;
  return stage.sequence.find((n) => n.id === nodeId);
}

function getNextLinearId(script: ScriptData, stageId: string, currentId: string): string | undefined {
  const stage = script[stageId];
  if (!stage) return undefined;
  const idx = stage.sequence.findIndex((n) => n.id === currentId);
  if (idx === -1 || idx >= stage.sequence.length - 1) return undefined;
  return stage.sequence[idx + 1].id;
}

function resolvePhase(node: ScriptNode | undefined): GamePhase {
  if (!node) return "dialogue";
  if (node.type === "quiz") return "quiz";
  if (node.type === "choice") return "choice";
  if (node.type === "action") return "action";
  return "dialogue";
}

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>((set, get) => ({
  // ── Initial state ─────────────────────────────────────────
  script: null,
  currentStage: "intro_stage",
  phase: "start",

  currentNodeId: "",

  enemyName: "",
  enemyMaxHp: 100,
  enemyHp: 100,

  // Progression — all stages unlocked for play
  unlockedLocations: ["tofu_mansion", "stage_2_tofu", "salmon_pool"],

  // ── Actions ───────────────────────────────────────────────

  loadScript: (data: ScriptData) => {
    set({ script: data });
  },

  goToIntro: () => {
    set({ phase: "intro" });
  },

  goToMap: () => {
    set({ phase: "map" });
  },

  startStage: (stageId: string) => {
    const { script } = get();
    if (!script) return;
    const targetKey = stageId === "tofu_mansion" ? "stage_2_tofu" : stageId;
    const stage = script[targetKey];
    if (!stage || !stage.sequence.length) return;

    const firstNode = stage.sequence[0];
    set({
      currentStage: targetKey,
      enemyName: stage.enemy_name ?? "",
      enemyMaxHp: stage.enemy_max_hp ?? 100,
      enemyHp: stage.enemy_max_hp ?? 100,
      currentNodeId: firstNode.id,
      phase: resolvePhase(firstNode),
    });
  },

  advanceSequence: (nextId?: string) => {
    const { script, currentStage, currentNodeId, enemyHp } = get();
    if (!script) return;

    // Determine target node id
    const targetId = nextId ?? getNextLinearId(script, currentStage, currentNodeId);
    if (!targetId) {
      // ── End of sequence ──────────────────────────────────
      if (currentStage === "stage_1_noble_nueng") {
        // Noble stage: unlock tofu_mansion and return to map
        get().unlockLocation("tofu_mansion");
        set({ phase: "map" });
      } else if (currentStage === "stage_2_tofu") {
        // Tofu stage: unlock salmon_pool and return to map
        get().unlockLocation("salmon_pool");
        set({ phase: "map" });
      } else if (
        enemyHp <= 0 ||
        currentStage === "salmon_pool" ||
        currentStage === "stage_3_boss_biggui"
      ) {
        // Other combat stages or salmon pool: show win screen
        set({ phase: "win" });
      }
      return;
    }

    const node = getNodeById(script, currentStage, targetId);
    if (!node) return;

    // If node is an action node (e.g. change_scene, open_map, or fail)
    if (node.type === "action") {
      const actionNode = node as ActionNode;
      if (actionNode.action === "change_scene" && actionNode.target) {
        get().startStage(actionNode.target);
        return;
      }
      if (actionNode.action === "open_map" || actionNode.target === "map") {
        set({ phase: "map" });
        return;
      }
      if (actionNode.action === "fail" || actionNode.action === "game_over") {
        set({ phase: "fail" });
        return;
      }
      // enter_combat_scene: trigger combat scene view for boss stage, advance automatically for quiz stages
      if (actionNode.action === "enter_combat_scene") {
        if (currentStage === "salmon_pool" || currentStage === "stage_3_boss_biggui") {
          set({ currentNodeId: targetId, phase: "action" });
          return;
        }
        const afterId = getNextLinearId(script, currentStage, targetId);
        if (!afterId) return;
        const afterNode = getNodeById(script, currentStage, afterId);
        if (!afterNode) return;
        set({ currentNodeId: afterId, phase: resolvePhase(afterNode) });
        return;
      }
      // end_combat_scene: advance automatically to next node in sequence
      if (actionNode.action === "end_combat_scene") {
        const afterId = getNextLinearId(script, currentStage, targetId);
        if (!afterId) return;
        const afterNode = getNodeById(script, currentStage, afterId);
        if (!afterNode) return;
        set({ currentNodeId: afterId, phase: resolvePhase(afterNode) });
        return;
      }
    }

    set({
      currentNodeId: targetId,
      phase: resolvePhase(node),
    });
  },

  applyDamage: (amount: number) => {
    const { enemyHp } = get();
    const newHp = Math.max(0, enemyHp - amount);
    set({ enemyHp: newHp });
  },

  triggerFail: () => {
    set({ phase: "fail" });
  },

  unlockLocation: (locationId: string) => {
    const { unlockedLocations } = get();
    if (!unlockedLocations.includes(locationId)) {
      set({ unlockedLocations: [...unlockedLocations, locationId] });
    }
  },

  goToStart: () => {
    set({ phase: "start" });
  },
}));
