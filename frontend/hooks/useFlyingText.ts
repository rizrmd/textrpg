import { useEffect } from "react";
import type { BattleState } from "../types";
import { useFlyingTextStore } from "../stores/flyingTextStore";

export const useFlyingText = (battleState: BattleState | null) => {
  const { flyingTexts, previousHp, addFlyingTexts, removeFlyingTexts, setPreviousHp } = useFlyingTextStore();

  useEffect(() => {
    if (battleState) {
      const hpDiff = {
        player: battleState.player.hp - previousHp.player,
        enemy: battleState.enemy.hp - previousHp.enemy,
      };

      const newFlyingTexts: { id: number; text: string; x: number; y: number; color: string; target: "player" | "enemy" }[] = [];

      if (hpDiff.player !== 0) {
        newFlyingTexts.push({
          id: Date.now() + 1,
          text: hpDiff.player > 0 ? `+${hpDiff.player}` : `${hpDiff.player}`,
          x: 0,
          y: 0,
          color: hpDiff.player > 0 ? "#00ff00" : "#ff0000",
          target: "player",
        });
      }

      if (hpDiff.enemy !== 0) {
        newFlyingTexts.push({
          id: Date.now() + 2,
          text: hpDiff.enemy > 0 ? `+${hpDiff.enemy}` : `${hpDiff.enemy}`,
          x: 0,
          y: 0,
          color: hpDiff.enemy > 0 ? "#00ff00" : "#ff0000",
          target: "enemy",
        });
      }

      if (newFlyingTexts.length > 0) {
        addFlyingTexts(newFlyingTexts);
        setTimeout(() => {
          removeFlyingTexts(newFlyingTexts.map(ft => ft.id));
        }, 2000);
      }

      setPreviousHp({
        player: battleState.player.hp,
        enemy: battleState.enemy.hp,
      });
    }
  }, [battleState, previousHp.player, previousHp.enemy, addFlyingTexts, removeFlyingTexts, setPreviousHp]);

  return flyingTexts;
};