"use client";

import { useGameStore } from "@/store/gameStore";
import StartScreen from "@/components/game/StartScreen";
import IntroScreen from "@/components/game/IntroScreen";
import GameScreen from "@/components/game/GameScreen";

export default function GameRoot() {
  const { phase } = useGameStore();

  if (phase === "start") {
    return <StartScreen />;
  }

  if (phase === "intro") {
    return <IntroScreen />;
  }

  return <GameScreen />;
}
