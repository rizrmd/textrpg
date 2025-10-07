  import React, { useEffect } from "react";
  import "./index.css";
  import Player from "./components/Player";
  import Enemy from "./components/Enemy";
  import BattleActions from "./components/BattleActions";
  import LootPhase from "./components/LootPhase";
  import Inventory from "./components/Inventory";
  import LocationSelection from "./components/LocationSelection";
  import EquipmentPopup from "./components/EquipmentPopup";
  import { useWebSocket } from "./hooks/useWebSocket";
  import { useFlyingText } from "./hooks/useFlyingText";
  import { useUIStore } from "./stores/uiStore";
  import { useCooldownsStore } from "./stores/cooldownsStore";

const App: React.FC = () => {
  const { battleState, sendAction } = useWebSocket();
  const flyingTexts = useFlyingText(battleState);
  const { selectedEquipmentType, showEquipmentPopup, setSelectedEquipmentType, setShowEquipmentPopup } = useUIStore();
  const { attack: attackCooldown, setCooldowns, updateAttackCooldown } = useCooldownsStore();

  // Update cooldowns in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      updateAttackCooldown(Math.max(0, attackCooldown - 100));
    }, 100);
    return () => clearInterval(interval);
  }, [attackCooldown, updateAttackCooldown]);



  const handleAction = (
    action: "attack" | "heal" | "reset" | "pickLoot" | "selectLocation",
    item?: string | { name: string; rarity: string },
    locationIndex?: number
  ) => {
    if (action === "pickLoot" && item === "Skip") {
      // Skip is handled the same as picking loot
    }
    sendAction(action, item, locationIndex);
    // Set cooldown for attack
    if (action === "attack") {
      const cooldownTime = 1000; // 1 second
      updateAttackCooldown(cooldownTime);
      setTimeout(() => {
        updateAttackCooldown(0);
      }, cooldownTime);
    }
  };

  if (!battleState) {
    return <div className="text-green-400 text-center mt-12">Loading...</div>;
  }

  const handleItemClick = (itemName: string) => {
    if (itemName.includes("Potion")) {
      handleAction("heal", itemName);
    } else {
      // Determine equipment type from item name
      let equipmentType = '';
      const itemNameLower = itemName.toLowerCase();
      if (itemNameLower.includes('sword') || itemNameLower.includes('bow') || itemNameLower.includes('dagger')) {
        equipmentType = 'weapon';
      } else if (itemNameLower.includes('armor')) {
        equipmentType = 'armor';
      } else if (itemNameLower.includes('shield')) {
        equipmentType = 'shield';
      } else if (itemNameLower.includes('helmet')) {
        equipmentType = 'helmet';
      } else if (itemNameLower.includes('boots')) {
        equipmentType = 'boots';
      } else if (itemNameLower.includes('ring')) {
        equipmentType = 'ring';
      } else if (itemNameLower.includes('amulet')) {
        equipmentType = 'amulet';
      }

      if (equipmentType) {
        setSelectedEquipmentType(equipmentType);
        setShowEquipmentPopup(true);
      }
    }
  };

  const handleEquipmentEquip = (itemName: string) => {
    // Equip logic would go here
    console.log(`Equipping: ${itemName}`);
  };

  const handleEquipmentUse = (itemName: string) => {
    handleAction("heal", itemName);
  };

  if (!battleState) {
    return <div className="text-green-400 text-center mt-12">Loading...</div>;
  }

  return (
    <>
      <div className="w-full h-screen bg-black flex flex-col text-green-400 overflow-hidden max-w-md mx-auto p-5">
        <Player
          player={battleState.player}
          flyingTexts={flyingTexts}
          generateEquipmentImageUrl={(item) => `https://pollinations.ai/p/${encodeURIComponent(`an icon of ${item || "Sword"}, centered, no cropping`)}?width=256&height=256&nologo=true`}
          setSelectedEquipmentType={setSelectedEquipmentType}
          setShowEquipmentPopup={setShowEquipmentPopup}
          locations={battleState.locations}
        />

        <Enemy battleState={battleState} flyingTexts={flyingTexts} />

        {/* Actions and Battle Log - Bottom */}
        <div className="h-2/5 flex flex-col gap-2.5">
          {!battleState.lootPhase && (
            <BattleActions
              battleState={battleState}
              cooldowns={{ attack: attackCooldown }}
              onAttack={() => handleAction("attack")}
            />
          )}

          {battleState.lootPhase && (
            <LootPhase
              battleState={battleState}
              onPickLoot={(item) => handleAction("pickLoot", item)}
            />
          )}

          {/* Inventory Display */}
          {!battleState.lootPhase && !battleState.locationSelectionPhase && (
            <Inventory
              battleState={battleState}
              onItemClick={handleItemClick}
            />
          )}

          {battleState.locationSelectionPhase && (
            <LocationSelection
              battleState={battleState}
              onSelectLocation={(locationIndex) =>
                handleAction("selectLocation", undefined, locationIndex)
              }
            />
          )}
        </div>
      </div>

      {/* Equipment Popup Modal */}
      {showEquipmentPopup && selectedEquipmentType && (
        <EquipmentPopup
          equipmentType={selectedEquipmentType}
          availableEquipment={battleState.player.inventory.filter(item => {
            const itemName = item.name.toLowerCase();
            const type = selectedEquipmentType.toLowerCase();
            if (type === 'weapon') return itemName.includes('sword') || itemName.includes('bow') || itemName.includes('dagger');
            if (type === 'armor') return itemName.includes('armor');
            if (type === 'shield') return itemName.includes('shield');
            if (type === 'helmet') return itemName.includes('helmet');
            if (type === 'boots') return itemName.includes('boots');
            if (type === 'ring') return itemName.includes('ring');
            if (type === 'amulet') return itemName.includes('amulet');
            return false;
          })}
          currentlyEquipped={battleState.player.equipment[selectedEquipmentType as keyof typeof battleState.player.equipment] || undefined}
          onClose={() => setShowEquipmentPopup(false)}
          onEquip={handleEquipmentEquip}
          onUse={handleEquipmentUse}
        />
      )}

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
