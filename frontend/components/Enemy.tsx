import React, { useState, useEffect } from "react";
import type { BattleState, FlyingText } from "../types";

interface EnemyProps {
  battleState: BattleState;
  flyingTexts: FlyingText[];
}

const Enemy: React.FC<EnemyProps> = ({ battleState, flyingTexts }) => {
  const hpPercentage = (battleState.enemy.hp / battleState.enemy.maxHp) * 100;
  const isDefeated = battleState.lootPhase;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image loaded state when enemy changes
  useEffect(() => {
    setImageLoaded(false);
  }, [battleState.enemy.name, battleState.enemyImageUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={`flex-1 mb-6 flex flex-col items-stretch justify-center relative shadow-2xl`}>
      {/* Enemy Name with glow effect */}
      <div className="absolute top-[-2px] left-0 right-0 z-10 h-[100px]  bg-gradient-to-b from-black  to-transparent">
        <h3 className={`m-0 text-3xl! w-full h-full text-center pt-[30px] text-red-600 font-title px-4 py-2`}>
          {battleState.enemy.name}
        </h3>
      </div>


      {/* Enemy Image Container with frame */}
      <div className="relative mb-6">

        <div className="absolute bottom-[-10px] left-0 right-0 z-10 h-[50px]  bg-gradient-to-t from-black  to-transparent">

        </div>
        <div className={`absolute inset-0 blur-sm ${!isDefeated ? 'bg-gray-500/20' : 'bg-red-500/20'
          }`}></div>
        {battleState.loadingEnemyImage && !imageLoaded ? (
          <div className="w-full h-64 flex items-center justify-center text-8xl">
            ⚔️
          </div>
        ) : (
          <img
            src={battleState.enemyImageUrl}
            alt={battleState.enemy.name}
            className={`w-full object-cover`}
            onLoad={handleImageLoad}
          />
        )}
      </div>

      {/* Stats Panel */}
      <div className={`w-full max-w-md bg-black/60 p-2!`}>
        {/* HP Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-red-300 font-semibold">HP</span>
            <span className="text-white font-mono">
              {battleState.enemy.hp}/{battleState.enemy.maxHp}
            </span>
          </div>
          <div className={`w-full h-6 bg-gray-700 overflow-hidden border-2 ${isDefeated ? 'border-gray-500/50' : 'border-red-500/50'
            }`}>
            <div
              className={`h-full transition-all duration-500 ease-out relative ${isDefeated
                  ? 'bg-gradient-to-r from-gray-600 to-gray-500'
                  : 'bg-gradient-to-r from-red-600 to-red-400'
                }`}
              style={{ width: `${hpPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Combat Stats */}
        <div className="flex justify-between text-sm">
          <div className="text-orange-400">
            <span className="font-semibold">ATK:</span> {battleState.enemy.attack}
          </div>
          <div className="text-blue-400">
            <span className="font-semibold">DEF:</span> {battleState.enemy.defense}
          </div>
        </div>
      </div>

      {/* Flying Text Effects */}
      {flyingTexts
        .filter((ft) => ft.target === "enemy")
        .map((ft) => (
          <div
            key={ft.id}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 text-3xl font-black pointer-events-none z-10"
            style={{
              color: ft.color,
              textShadow: `0 0 10px ${ft.color}, 0 0 20px ${ft.color}`,
              animation: "flyUp 2.5s ease-out forwards",
            }}
          >
            {ft.text}
          </div>
        ))}
    </div>
  );
};

export default Enemy;