import React, { useState, useEffect } from "react";
import "./index.css";

interface Character {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  equipment: {
    weapon?: string;
    armor?: string;
    shield?: string;
    helmet?: string;
    boots?: string;
    ring?: string;
    amulet?: string;
  };
  inventory: { name: string; rarity: string }[];
}

interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

interface BattleState {
  player: Character;
  enemy: Enemy;
  enemyImageUrl: string;
  battleLog: string[];
  isPlayerTurn: boolean;
  lootPhase: boolean;
  availableLoot: { name: string; rarity: string }[];
  currentLocationIndex: number;
  locations: Array<{
    name: string;
    enemies: Character[];
    defeated: number;
    connections: number[];
  }>;
  waitingForNext: boolean;
  countdown: number;
  locationSelectionPhase: boolean;
}

interface FlyingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  target: "player" | "enemy";
}

const App: React.FC = () => {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [flyingTexts, setFlyingTexts] = useState<FlyingText[]>([]);
  const [previousHp, setPreviousHp] = useState({ player: 100, enemy: 50 });
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );
  const [cooldowns, setCooldowns] = useState({ attack: 0 });

  useEffect(() => {
    const websocket = new WebSocket(`ws://${window.location.host}/ws`);

    websocket.onopen = () => {
      console.log("Connected to battle server");
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "state") {
          setBattleState((prev) => {
            if (prev) {
              const hpDiff = {
                player: message.data.player.hp - prev.player.hp,
                enemy: message.data.enemy.hp - prev.enemy.hp,
              };

              const newFlyingTexts: FlyingText[] = [];

              if (hpDiff.player !== 0) {
                newFlyingTexts.push({
                  id: Date.now() + 1,
                  text:
                    hpDiff.player > 0
                      ? `+${hpDiff.player}`
                      : `${hpDiff.player}`,
                  x: 0,
                  y: 0,
                  color: hpDiff.player > 0 ? "#00ff00" : "#ff0000",
                  target: "player",
                });
              }

              if (hpDiff.enemy !== 0) {
                newFlyingTexts.push({
                  id: Date.now() + 2,
                  text:
                    hpDiff.enemy > 0 ? `+${hpDiff.enemy}` : `${hpDiff.enemy}`,
                  x: 0,
                  y: 0,
                  color: hpDiff.enemy > 0 ? "#00ff00" : "#ff0000",
                  target: "enemy",
                });
              }

              if (newFlyingTexts.length > 0) {
                setFlyingTexts((prev) => [...prev, ...newFlyingTexts]);
                setTimeout(() => {
                  setFlyingTexts((prev) =>
                    prev.filter(
                      (ft) => !newFlyingTexts.some((nft) => nft.id === ft.id)
                    )
                  );
                }, 2000);
              }
            }
            return message.data;
          });
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from battle server");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  // Update cooldowns in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => ({
        attack: Math.max(0, prev.attack - 100)
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const generateEquipmentImageUrl = (item: string): string => {
    const safeItem = item || "Sword";
    const prompt = `an icon of ${safeItem}, centered, no cropping`;
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://pollinations.ai/p/${encodedPrompt}?width=256&height=256&nologo=true`;
  };

  const generateLootImageUrl = (item: string): string => {
    const safeItem = item || "Sword";
    const prompt = `an icon of ${safeItem}, centered, no cropping`;
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://pollinations.ai/p/${encodedPrompt}?width=256&height=256&nologo=true`;
  };

  const rarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-400";
      case "Uncommon":
        return "text-green-400";
      case "Rare":
        return "text-blue-400";
      case "Epic":
        return "text-purple-400";
      default:
        return "text-white";
    }
  };

  const renderEquipment = (item?: string, type?: string) => {
    if (!item) {
      const emoji =
        {
          weapon: "⚔️",
          armor: "🛡️",
          shield: "🔰",
          helmet: "🪖",
          boots: "👢",
          ring: "💍",
          amulet: "📿",
        }[type || "weapon"] || "❓";
      return (
        <div className="flex flex-col items-center opacity-50">
          <div className="text-2xl">{emoji}</div>
          <div className="text-xs text-center capitalize">{type}</div>
          <div className="text-[10px] text-white">None</div>
        </div>
      );
    }
    const parts = item.split(" ");
    const rarity = parts[0]!;
    const name = parts.slice(1).join(" ");
    return (
      <div className="flex flex-col items-center">
        <img
          src={generateEquipmentImageUrl(item)}
          alt={item}
          className="w-8 h-8 mb-1"
        />
        <div className="text-xs text-center">{name}</div>
        <div className="text-xs text-center">
          <span className={rarityColor(rarity)}>{rarity}</span>
        </div>
      </div>
    );
  };

  const getEquipmentDetails = (type: string, item?: string) => {
    if (!item) return "No equipment";
    if (item.includes("Sword")) return "+2 Attack";
    if (item.includes("Bow")) return "+3 Attack";
    if (item.includes("Dagger")) return "+2 Attack";
    if (item.includes("Shield")) return "+2 Defense";
    if (item.includes("Armor")) return "+20 Max HP";
    if (item.includes("Helmet")) return "+1 Defense";
    if (item.includes("Boots")) return "+1 Defense";
    if (item.includes("Ring")) return "+1 Attack";
    if (item.includes("Amulet")) return "+1 Defense";
    return "Unknown item";
  };

  const handleAction = (
    action: "attack" | "heal" | "reset" | "pickLoot" | "selectLocation",
    item?: string | { name: string; rarity: string },
    locationIndex?: number
  ) => {
    if (action === "pickLoot" && item === "Skip") {
      // Skip is handled the same as picking loot
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (action === "pickLoot" && item) {
        ws.send(JSON.stringify({ action, item }));
      } else if (action === "selectLocation" && locationIndex !== undefined) {
        ws.send(JSON.stringify({ action, locationIndex }));
      } else {
        ws.send(JSON.stringify({ action }));
      }
    }
    // Set cooldown for attack
    if (action === "attack") {
      const cooldownTime = 1000; // 1 second
      setCooldowns(prev => ({ ...prev, attack: cooldownTime }));
      setTimeout(() => {
        setCooldowns(prev => ({ ...prev, attack: 0 }));
      }, cooldownTime);
    }
  };

  if (!battleState) {
    return <div className="text-green-400 text-center mt-12">Loading...</div>;
  }

  return (
    <>
      <div className="w-full h-screen bg-gray-900 flex flex-col font-mono text-green-400 overflow-hidden max-w-md mx-auto p-5">
        {/* Player Info - Top 20% */}
        <div className="h-1/5 bg-gray-800 p-4 mb-2.5 relative overflow-hidden">
          <h3 className="m-0 mb-1.5 text-yellow-400 font-mono">
            {battleState.player.name}
          </h3>
          <div className="text-xs relative">
            <div>
              HP: {battleState.player.hp}/{battleState.player.maxHp}
            </div>
            <div className="w-full h-4 bg-gray-600 my-0.5 overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all duration-300"
                style={{
                  width: `${
                    (battleState.player.hp / battleState.player.maxHp) * 100
                  }%`,
                }}
              />
            </div>
            <div>
              ATK: {battleState.player.attack} | DEF:{" "}
              {battleState.player.defense}
            </div>

            {/* Equipment */}
            <div className="mt-1.5 text-xs">
              <div className="gap-2 flex">
                {[
                  "weapon",
                  "armor",
                  "shield",
                  "helmet",
                  "boots",
                  "ring",
                  "amulet",
                ].map((type) => (
                  <div
                    key={type}
                    className="cursor-pointer inline-flex flex-col items-center"
                    onClick={() => {
                      if (battleState.lootPhase) return;
                      setSelectedEquipment(
                        selectedEquipment === type ? null : type
                      );
                    }}
                  >
                    {renderEquipment(
                      battleState.player.equipment[
                        type as keyof typeof battleState.player.equipment
                      ],
                      type
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory */}
            {battleState.player.inventory.length > 0 && (
              <div className="mt-1.5 text-xs">
                <div className="text-orange-400">Inventory:</div>
                <div>
                  {battleState.player.inventory
                    .map((inv) => `${inv.rarity} ${inv.name}`)
                    .join(", ")}
                </div>
              </div>
            )}

            {selectedEquipment && (
              <div className="mt-1.5 p-1.5 bg-gray-700 text-xs text-yellow-400">
                {getEquipmentDetails(
                  selectedEquipment,
                  battleState.player.equipment[
                    selectedEquipment as keyof typeof battleState.player.equipment
                  ]
                )}
              </div>
            )}

            {flyingTexts
              .filter((ft) => ft.target === "player")
              .map((ft) => (
                <div
                  key={ft.id}
                  className="absolute top-2.5 left-1/2 transform -translate-x-1/2 text-xl font-bold pointer-events-none"
                  style={{
                    color: ft.color,
                    textShadow: `0 0 5px ${ft.color}`,
                    animation: "flyUp 2s ease-out forwards",
                  }}
                >
                  {ft.text}
                </div>
              ))}
          </div>
        </div>

        {/* Enemy - Center 40% */}
        <div className="flex-1 bg-gray-800 p-4 mb-2.5 flex flex-col items-center justify-center relative">
          <h3 className="m-0 mb-2.5 text-red-400 font-mono">
            {battleState.enemy.name}
          </h3>
          <div className="text-center mb-2.5">
            <img
              src={battleState.enemyImageUrl}
              alt={battleState.enemy.name}
              className="w-[450px] h-[330px] object-cover"
            />
          </div>
          <div className="text-xs text-gray-400 mb-1.5">
            {battleState.locations[battleState.currentLocationIndex]!.name}
          </div>
          <div className="text-sm relative w-full">
            <div>
              HP: {battleState.enemy.hp}/{battleState.enemy.maxHp}
            </div>
            <div className="w-full h-5 bg-gray-600 my-1.5 overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{
                  width: `${
                    (battleState.enemy.hp / battleState.enemy.maxHp) * 100
                  }%`,
                }}
              />
            </div>
            <div>
              ATK: {battleState.enemy.attack} | DEF: {battleState.enemy.defense}
            </div>

            {flyingTexts
              .filter((ft) => ft.target === "enemy")
              .map((ft) => (
                <div
                  key={ft.id}
                  className="absolute top-2.5 left-1/2 transform -translate-x-1/2 text-xl font-bold pointer-events-none"
                  style={{
                    color: ft.color,
                    textShadow: `0 0 5px ${ft.color}`,
                    animation: "flyUp 2s ease-out forwards",
                  }}
                >
                  {ft.text}
                </div>
              ))}
          </div>
        </div>

        {/* Actions and Battle Log - Bottom */}
        <div className="h-2/5 flex flex-col gap-2.5">
          {!battleState.lootPhase && (
            <>
              <div className="bg-black p-4 text-center text-sm">
                {battleState.battleLog[battleState.battleLog.length - 1]}
              </div>

              {!battleState.lootPhase &&
                !battleState.waitingForNext &&
                !battleState.locationSelectionPhase && (
                  <div className="flex gap-2.5 justify-center flex-shrink-0">
                     <button
                       onClick={() => handleAction("attack")}
                       disabled={
                         battleState.player.hp <= 0 ||
                         battleState.enemy.hp <= 0 ||
                         battleState.lootPhase ||
                         battleState.waitingForNext ||
                         battleState.locationSelectionPhase ||
                         cooldowns.attack > 0
                       }
                       className={`px-8 py-4 text-lg font-mono transition-opacity duration-300 ${
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
          )}

          {battleState.lootPhase && (
            <div className="bg-gray-800 p-4 text-center flex-1">
              <h4 className="m-0 mb-2.5 text-orange-400 font-mono">
                {battleState.availableLoot.some(
                  (loot) => loot.name === "Restart"
                )
                  ? "GAME OVER"
                  : "ENEMY DROPPED:"}
              </h4>
              <div className="flex gap-2.5 justify-center flex-wrap">
                {battleState.availableLoot.some(
                  (loot) => loot.name === "Restart"
                ) ? (
                  <button
                    onClick={() => handleAction("pickLoot", "Restart")}
                    className="px-4 py-2.5 bg-red-600 text-white font-mono cursor-pointer text-sm"
                  >
                    RESTART
                  </button>
                ) : (
                  <>
                    {battleState.availableLoot.map((loot, index) => (
                      <button
                        key={index}
                        onClick={() => handleAction("pickLoot", loot)}
                        className="px-4 py-2.5 bg-orange-400 text-black font-mono cursor-pointer text-sm flex flex-col items-center"
                      >
                        <img
                          src={generateLootImageUrl(loot.name)}
                          alt={loot.name}
                          className="w-12 h-12 mb-1"
                        />
                        <div className="text-xs text-center">{loot.name}</div>
                        <div className="text-xs text-center">
                          <span className={rarityColor(loot.rarity)}>
                            {loot.rarity}
                          </span>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => handleAction("pickLoot", "Skip")}
                      className="px-4 py-2.5 bg-gray-600 text-white font-mono cursor-pointer text-sm"
                    >
                      [SKIP]
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {battleState.locationSelectionPhase && (
            <div className="bg-gray-800 p-4 text-center flex-1">
              <h4 className="m-0 mb-2.5 text-blue-400 font-mono">
                CHOOSE NEXT LOCATION:
              </h4>
              <div className="flex gap-2.5 justify-center flex-wrap">
                {battleState.locations[
                  battleState.currentLocationIndex
                ]!.connections.map((locationIndex) => (
                  <button
                    key={locationIndex}
                    onClick={() =>
                      handleAction("selectLocation", undefined, locationIndex)
                    }
                    className="px-4 py-2.5 bg-blue-500 text-white font-mono cursor-pointer text-sm"
                  >
                    {battleState.locations[locationIndex]!.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
      @keyframes flyUp {
        0% {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateX(-50%) translateY(-40px);
          opacity: 0;
        }
      }
    `}</style>
    </>
  );
};

export default App;
