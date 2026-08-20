// ─────────────────────────────────────────────────────────────
// TypeScript types for the entire game
// ─────────────────────────────────────────────────────────────

export type ScriptNodeType = "dialogue" | "quiz" | "choice" | "action";

export interface DialogueNode {
  id: string;
  type: "dialogue";
  speaker: string;
  sprite?: string;
  text: string;
  next_id?: string; // if omitted, advance linearly
}

export interface QuizChoice {
  text: string;
  is_correct: boolean;
  damage: number;
  next_id: string;
}

export interface QuizNode {
  id: string;
  type: "quiz";
  text: string;
  speaker?: string;
  sprite?: string;
  choices: QuizChoice[];
}

export interface SimpleChoice {
  text: string;
  next_id: string;
}

export interface ChoiceNode {
  id: string;
  type: "choice";
  choices: SimpleChoice[];
}

export interface ActionNode {
  id: string;
  type: "action";
  action: string;
  target: string;
}

export type ScriptNode = DialogueNode | QuizNode | ChoiceNode | ActionNode;

export interface StageData {
  enemy_name?: string;
  enemy_max_hp?: number;
  enemy_sprite?: string; // path relative to /public/assets/
  background?: string;   // path relative to /public/assets/
  sequence: ScriptNode[];
}

export interface ScriptData {
  [stageId: string]: StageData;
}

// ─────────────────────────────────────────────────────────────
// Zustand store shape
// ─────────────────────────────────────────────────────────────

export type GamePhase = "start" | "intro" | "dialogue" | "quiz" | "choice" | "action" | "win" | "fail" | "map" | "loading";

export interface GameState {
  // Meta
  script: ScriptData | null;
  currentStage: string;
  phase: GamePhase;

  // Sequence
  currentNodeId: string;

  // Enemy
  enemyName: string;
  enemyMaxHp: number;
  enemyHp: number;

  // Progression — tracks which map locations have been unlocked
  unlockedLocations: string[];

  // Actions
  loadScript: (data: ScriptData) => void;
  goToIntro: () => void;
  goToMap: () => void;
  startStage: (stageId: string) => void;
  advanceSequence: (nextId?: string) => void;
  applyDamage: (amount: number) => void;
  goToStart: () => void;
  triggerFail: () => void;
  unlockLocation: (locationId: string) => void;
}
