"use client";

import { useGameStore } from "@/store/gameStore";

// ─────────────────────────────────────────────────────────────
// HP Bar — Figma node #34:230 & #34:232
// Black rectangular track (362×40) with 4px border
// White fill rectangle overlaid on top representing current HP
// ─────────────────────────────────────────────────────────────
export default function HPBar() {
  const { enemyName, enemyHp, enemyMaxHp } = useGameStore();

  const pct = enemyMaxHp > 0 ? Math.max(0, (enemyHp / enemyMaxHp) * 100) : 0;

  return (
    <div className="combat-hp-bar-wrapper" role="status" aria-label={`${enemyName} HP`}>
      {/* HP numeric label above bar */}
      <div className="combat-hp-label">
        <span className="combat-hp-name">{enemyName}</span>
        <span className="combat-hp-value">{enemyHp} / {enemyMaxHp}</span>
      </div>

      {/* Track + Fill — stacked, same position (Figma #34:230 & #34:232) */}
      <div className="combat-hp-track">
        <div
          className="combat-hp-fill"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={enemyHp}
          aria-valuemin={0}
          aria-valuemax={enemyMaxHp}
        />
      </div>
    </div>
  );
}
