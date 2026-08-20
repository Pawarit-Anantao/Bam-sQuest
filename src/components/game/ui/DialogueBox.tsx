"use client";

import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import type { DialogueNode } from "@/types/game";

// ─────────────────────────────────────────────────────────────
// Typewriter hook
// ─────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 32) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  const finish = useCallback(() => {
    setDisplayed(text);
    setDone(true);
  }, [text]);

  return { displayed, done, finish };
}

// ─────────────────────────────────────────────────────────────
// Component — Figma node 30:47 (prolouge 2)
// ─────────────────────────────────────────────────────────────
interface DialogueBoxProps {
  node: DialogueNode;
}

export default function DialogueBox({ node }: DialogueBoxProps) {
  const { advanceSequence } = useGameStore();
  const { displayed, done, finish } = useTypewriter(node.text);

  const handleClick = () => {
    if (!done) {
      finish();
      return;
    }
    advanceSequence(node.next_id);
  };

  return (
    <div className="vn-dialogue-wrapper" role="region" aria-label="Dialogue">
      {/* Speaker Badge — Black badge, white text, 8px radius */}
      <div className="vn-speaker-badge">
        <span>{node.speaker}</span>
      </div>

      {/* Main Dialogue Card — White card, 8px radius */}
      <div className="vn-dialogue-card">
        <p className="vn-dialogue-text">{displayed}</p>

        {/* Next Hint "ต่อไป" */}
        <span className="vn-dialogue-next" aria-hidden="true">
          {done ? "ต่อไป" : "..."}
        </span>
      </div>

      {/* Invisible full-area tap target */}
      <button
        id="btn-dialogue-advance"
        onClick={handleClick}
        aria-label="Advance dialogue"
        className="vn-dialogue-tap-target"
      />
    </div>
  );
}
