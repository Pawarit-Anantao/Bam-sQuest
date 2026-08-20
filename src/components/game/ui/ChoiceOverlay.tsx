"use client";

import Image from "next/image";
import { useGameStore } from "@/store/gameStore";
import type { ChoiceNode, SimpleChoice } from "@/types/game";

interface ChoiceOverlayProps {
  node: ChoiceNode;
}

export default function ChoiceOverlay({ node }: ChoiceOverlayProps) {
  const { advanceSequence } = useGameStore();

  const handleSelect = (choice: SimpleChoice) => {
    advanceSequence(choice.next_id);
  };

  return (
    <div className="choice-backdrop" role="dialog" aria-modal="true" aria-label="Choice Selection">
      <div className="choice-content">
        {/* Question Prompt Header (Figma #32:123) */}
        <h2 className="choice-prompt-title">หมาแบมจะตอบว่าอะไร</h2>

        {/* Choice Buttons List (Figma #32:119 & #32:121) */}
        <div className="choice-list">
          {node.choices.map((choice, idx) => (
            <button
              key={idx}
              id={`btn-dialogue-choice-${idx}`}
              className="choice-card-btn"
              onClick={() => handleSelect(choice)}
              aria-label={choice.text}
            >
              <span>{choice.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bam Sprite on Down Right (Figma #32:144) */}
      <div className="choice-bam-sprite-container">
        <Image
          src="/assets/Bam sprites/Bam_smile.png"
          alt="แบม"
          width={344}
          height={554}
          className="choice-bam-img"
          unoptimized
          priority
        />
      </div>
    </div>
  );
}
