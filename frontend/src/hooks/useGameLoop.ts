import { useEffect, useRef } from "react";
import { GameLoop } from "@/game/engine/GameLoop";
import { useGameStore } from "@/game/state/gameStore";

export function useGameLoop() {
  const loopRef = useRef<GameLoop | null>(null);
  const speed = useGameStore((s) => s.speed);
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    const loop = new GameLoop();
    loopRef.current = loop;

    loop.onTick(() => {
      useGameStore.getState().doTick();
    });

    loop.start();

    return () => {
      loop.destroy();
      loopRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (loopRef.current) {
      loopRef.current.setSpeed(speed);
    }
  }, [speed]);

  return { tick, speed };
}
