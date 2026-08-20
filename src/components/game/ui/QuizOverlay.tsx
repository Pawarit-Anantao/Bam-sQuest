"use client";

import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import type { QuizNode, QuizChoice } from "@/types/game";

interface QuizOverlayProps {
  node: QuizNode;
}

// ─────────────────────────────────────────────────────────────
// QuizOverlay — Figma Gameplay 2 (#34:213)
// - Correct answer  → deals damage to enemy, advance sequence
// - Wrong answer    → immediate game over (no second chance)
// - No color feedback (no correct/incorrect highlight)
// ─────────────────────────────────────────────────────────────
export default function QuizOverlay({ node }: QuizOverlayProps) {
  const { applyDamage, advanceSequence, triggerFail } = useGameStore();
  const [locked, setLocked] = useState(false);

  // Reset lock when node changes (new quiz question)
  useEffect(() => {
    setLocked(false);
  }, [node.id]);

  const handleChoice = useCallback((choice: QuizChoice) => {
    if (locked) return;
    setLocked(true);

    if (!choice.is_correct) {
      // Wrong answer → game over immediately
      setTimeout(() => {
        triggerFail();
      }, 300);
      return;
    }

    // Correct answer → deal damage and continue
    setTimeout(() => {
      if (choice.damage > 0) {
        applyDamage(choice.damage);
      }
      advanceSequence(choice.next_id);
    }, 300);
  }, [locked, applyDamage, advanceSequence, triggerFail]);

  return (
    <div className="combat-quiz-wrapper" role="dialog" aria-modal="true" aria-label="Quiz">
      {/* Speaker Badge — black pill, white text */}
      {node.speaker && (
        <div className="vn-speaker-badge combat-quiz-speaker">
          <span>{node.speaker}</span>
        </div>
      )}

      {/* White card */}
      <div className="combat-quiz-card">
        {/* Question text */}
        <p className="vn-dialogue-text combat-quiz-question">{node.text}</p>

        {/* Answer choices — no color feedback, plain white buttons */}
        <div className="combat-quiz-choices">
          {node.choices.map((choice, idx) => (
            <button
              key={idx}
              id={`btn-quiz-choice-${idx}`}
              className="combat-quiz-choice"
              onClick={() => handleChoice(choice)}
              disabled={locked}
              aria-label={choice.text}
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
