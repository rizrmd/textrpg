import React from "react";
import type { BattleState } from "../types";
import { generateLootImageUrl, rarityColor } from "../utils";

interface LootPhaseProps {
  battleState: BattleState;
  onPickLoot: (item: string | { name: string; rarity: string }) => void;
}

const LootPhase: React.FC<LootPhaseProps> = ({ battleState, onPickLoot }) => {
  return (
    <div className="p-4 text-center flex-1">
      <h4 className="m-0 mb-2.5 text-orange-400 font-mono">
        {battleState.availableLoot.some((loot) => loot.name === "Restart")
          ? "GAME OVER"
          : "ENEMY DROPPED:"}
      </h4>
      <div className="flex gap-2.5 justify-center flex-wrap">
        {battleState.availableLoot.some((loot) => loot.name === "Restart") ? (
          <button
            onClick={() => onPickLoot("Restart")}
            className="px-4 py-2.5 bg-red-600 text-white cursor-pointer text-sm"
          >
            RESTART
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4 items-center">
            {battleState.availableLoot.map((loot, index) => (
              <button
                key={index}
                onClick={() => onPickLoot(loot)}
                className="px-4! py-2.5 bg-black text-black cursor-pointer text-sm flex flex-col items-center"
              >
                <img
                  src={generateLootImageUrl(loot.name)}
                  alt={loot.name}
                  className="w-12 h-12 mb-1"
                />
                <div className="text-xs text-center text-white">{loot.name}</div>
                <div className="text-xs text-center">
                  <span className={rarityColor(loot.rarity)}>{loot.rarity}</span>
                </div>
              </button>
            ))}
            </div>
            
            <button
              onClick={() => onPickLoot("Skip")}
              className="px-4! py-2.5 bg-gray-600 text-white cursor-pointer text-sm"
            >
              SKIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LootPhase;