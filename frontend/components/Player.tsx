import React, { useState } from 'react';
import { useFloating, useHover, useInteractions, offset, flip, shift } from "@floating-ui/react";
import type { Character, FlyingText } from '../types';

interface PlayerProps {
  player: Character;
  flyingTexts: FlyingText[];
  generateEquipmentImageUrl: (item: string) => string;
  setSelectedEquipmentType: (type: string | null) => void;
  setShowEquipmentPopup: (show: boolean) => void;
  locations: { name: string }[];
}

const generateEmptySlotImageUrl = (type: string): string => {
  const prompt = `empty ${type} equipment slot icon, placeholder, centered, no cropping`;
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://pollinations.ai/p/${encodedPrompt}?width=256&height=256&nologo=true`;
};

const getEquipmentDisplayType = (type: string): string => {
  switch (type) {
    case "weapon": return "Sword";
    case "amulet": return "Necklace";
    case "ring": return "A Cheap Wedding Ring";
    case "armor": return "medieval robe";
    case "helmet": return "medieval helmet";
    case "shield": return "silver shield only";
    case "boots": return "medieval boots";
    default: return type;
  }
};

const EQUIPMENT_SLOTS = [
  { type: "weapon" as const, label: "W" },
  { type: "armor" as const, label: "A" },
  { type: "shield" as const, label: "S" },
  { type: "helmet" as const, label: "H" },
  { type: "boots" as const, label: "B" },
  { type: "ring" as const, label: "R" },
  { type: "amulet" as const, label: "M" },
];

const Player: React.FC<PlayerProps> = ({
  player,
  flyingTexts,
  generateEquipmentImageUrl,
  setSelectedEquipmentType,
  setShowEquipmentPopup,
  locations,
}) => {
  const [hoveredSlot, setHoveredSlot] = useState<{ type: string; equipped: string | undefined } | null>(null);

  // Type guard to ensure hoveredSlot is not null when rendering tooltip
  const renderTooltip = (slot: { type: string; equipped: string | undefined }) => {
    const slotType = slot.type;
    const emptySlotType = getEquipmentDisplayType(slotType);

    return (
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="bg-black/90 border border-gray-400 p-3 shadow-lg z-50 max-w-xs"
        {...getFloatingProps()}
      >
        <div className="flex items-center gap-2 mb-2">
          {slot.equipped ? (
            <img
              src={generateEquipmentImageUrl(slotType)}
              alt={slotType}
              className="w-8 h-8 flex-shrink-0"
            />
          ) : (
            <img
              src={generateEmptySlotImageUrl(emptySlotType)}
              alt={`Empty ${slotType} slot`}
              className="w-8 h-8 flex-shrink-0 opacity-50"
            />
          )}
          <div>
            <div className="text-white font-semibold text-sm capitalize">
              {slotType} Slot
            </div>
            {slot.equipped ? (
              <div className="text-green-400 text-xs">
                Equipped: {slot.equipped}
              </div>
            ) : (
              <div className="text-gray-400 text-xs">
                Empty slot - Click to equip
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const { refs, floatingStyles, context } = useFloating({
    open: hoveredSlot !== null,
    onOpenChange: (open) => {
      if (!open) setHoveredSlot(null);
    },
    middleware: [offset(8), flip(), shift()],
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 mb-2.5 flex flex-col item-stretch border-b border-gray-800">
      {/* Header with name and stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-yellow-400 text-lg font-bold">
            {player.name}
          </div>

        </div>


        <div className="text-gray-300 text-xs">
          {locations[player.currentLocationIndex]?.name || 'Unknown'}
        </div>

      </div>

      {/* Health Section */}
      <div className="mb-2!">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-4 text-sm">
            <div className="text-red-400">
              <span className="font-semibold">ATK:</span> {player.attack}
            </div>
            <div className="text-blue-400">
              <span className="font-semibold">DEF:</span> {player.defense}
            </div>
            <div className="text-purple-400 font-semibold">
              Level {player.level}
            </div>
            <div className="text-cyan-400 text-sm">
              EXP: {player.experience}/{player.level * 100}
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-green-400 font-semibold text-sm">HEALTH</span>
            <span className="text-white text-sm">
              {player.hp}/{player.maxHp}
            </span>
          </div>
        </div>
        <div className="w-full h-4 bg-gray-800 overflow-hidden border border-gray-700">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-green-400 transition-all duration-500 ease-out"
            style={{
              width: `${(player.hp / player.maxHp) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-7 gap-2">
        {EQUIPMENT_SLOTS.map(({ type, label }) => {
          const eq = player.equipment[
            type as keyof typeof player.equipment
          ]!;
 
          const eq_type = getEquipmentDisplayType(type);
          return (
            <button
              key={type}
              ref={hoveredSlot?.type === type ? refs.setReference : null}
              className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-200 bg-transparent border-none p-0"
              onClick={() => {
                setSelectedEquipmentType(type);
                setShowEquipmentPopup(true);
              }}
              onMouseEnter={() => setHoveredSlot({ type, equipped: player.equipment[type as keyof typeof player.equipment] })}
              onMouseLeave={() => setHoveredSlot(null)}
              aria-label={`Equipment slot: ${type}${player.equipment[type as keyof typeof player.equipment] ? ` - ${player.equipment[type as keyof typeof player.equipment]}` : ' - empty'}`}
              {...getReferenceProps()}
            >
              <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center mb-1 hover:border-gray-400 transition-colors">
                {eq ? (
                  <img
                    src={generateEquipmentImageUrl(
                      eq
                    )}
                    alt={type}
                    className="w-6 h-6"
                  />
                ) : (
                  <img
                    src={generateEmptySlotImageUrl(eq_type)}
                    alt={`Empty ${type} slot`}
                    className="w-6 h-6 opacity-50"
                  />
                )}
              </div>
              <span className="text-xs text-gray-400 font-mono">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Flying Text Effects */}
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

      {/* Equipment Tooltip */}
      {hoveredSlot && renderTooltip(hoveredSlot)}
    </div>
  );
};

export default Player;