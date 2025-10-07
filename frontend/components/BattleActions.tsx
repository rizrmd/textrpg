import React from "react";
import type { BattleState, Cooldowns } from "../types";

interface BattleActionsProps {
  battleState: BattleState;
  cooldowns: Cooldowns;
  onAttack: () => void;
}

const BattleActions: React.FC<BattleActionsProps> = ({
  battleState,
  cooldowns,
  onAttack,
}) => {
  return (
    <>
      <div className="bg-black p-4 text-center text-sm">
        {battleState.battleLog[battleState.battleLog.length - 1]}
      </div>

      {!battleState.lootPhase &&
        !battleState.waitingForNext &&
        !battleState.locationSelectionPhase && (
          <div className="flex gap-2.5 justify-center flex-shrink-0">
            <button
              onClick={onAttack}
              disabled={
                battleState.player.hp <= 0 ||
                battleState.enemy.hp <= 0 ||
                battleState.lootPhase ||
                battleState.waitingForNext ||
                battleState.locationSelectionPhase ||
                cooldowns.attack > 0
              }
              className={`px-6! py-4 text-lg transition-opacity duration-300 ${
                battleState.player.hp > 0 &&
                battleState.enemy.hp > 0 &&
                !battleState.lootPhase &&
                !battleState.waitingForNext &&
                !battleState.locationSelectionPhase &&
                cooldowns.attack === 0
                  ? "bg-green-400 text-black cursor-pointer opacity-100"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              {cooldowns.attack > 0
                ? `ATTACK (${(cooldowns.attack / 1000).toFixed(1)}s)`
                : "ATTACK"}
            </button>
          </div>
        )}
    </>
  );
};

export default BattleActions;