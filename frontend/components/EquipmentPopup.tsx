import React, { useState } from "react";
import { useFloating, useHover, useInteractions, offset, flip, shift } from "@floating-ui/react";
import { generateLootImageUrl, getEquipmentDetails, rarityColor } from "../utils";
import type { LootItem } from "../types";

interface EquipmentPopupProps {
  equipmentType: string;
  availableEquipment: LootItem[];
  currentlyEquipped?: string;
  onClose: () => void;
  onEquip: (itemName: string) => void;
  onUse: (itemName: string) => void;
}

const EquipmentPopup: React.FC<EquipmentPopupProps> = ({
  equipmentType,
  availableEquipment,
  currentlyEquipped,
  onClose,
  onEquip,
  onUse,
}) => {
  const [hoveredItem, setHoveredItem] = useState<{ item: LootItem; index: number } | null>(null);
  const isConsumable = (itemName: string) => itemName.includes("Potion");

  const { refs, floatingStyles, context } = useFloating({
    open: hoveredItem !== null,
    onOpenChange: (open) => {
      if (!open) setHoveredItem(null);
    },
    middleware: [offset(8), flip(), shift()],
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 p-4! mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-yellow-400 text-lg font-bold capitalize">
            {equipmentType} Equipment
          </h3>
        </div>

        {availableEquipment.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No {equipmentType} equipment available
          </div>
        ) : (
          <div className="space-y-3">
            {availableEquipment.map((item, index) => {
              const isEquipped = item.name === currentlyEquipped;
              const isConsumableItem = isConsumable(item.name);

              return (
                <div
                  key={`${item.name}-${index}`}
                  ref={hoveredItem?.index === index ? refs.setReference : null}
                  className={`flex items-center gap-4 p-4! border ${
                    isEquipped
                      ? "border-yellow-400 bg-yellow-400 bg-opacity-10"
                      : "border-gray-600 bg-gray-700"
                  }`}
                  onMouseEnter={() => setHoveredItem({ item, index })}
                  onMouseLeave={() => setHoveredItem(null)}
                  {...getReferenceProps()}
                >
                  <img
                    src={generateLootImageUrl(item.name)}
                    alt={item.name}
                    className="w-12 h-12 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium truncate">
                        {item.name}
                      </span>
                      {isEquipped && (
                        <span className="text-yellow-400 text-xs font-bold">
                          EQUIPPED
                        </span>
                      )}
                    </div>
                    <div className={`text-xs ${rarityColor(item.rarity)} mb-1`}>
                      {item.rarity}
                    </div>
                    <div className="text-xs text-gray-300">
                      {getEquipmentDetails(item.name)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {isConsumableItem ? (
                      <button
                        onClick={() => {
                          onUse(item.name);
                          onClose();
                        }}
                        className="bg-blue-600 text-white px-3 py-1 text-xs hover:bg-blue-700 transition-colors"
                      >
                        USE
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onEquip(item.name);
                          onClose();
                        }}
                        disabled={isEquipped}
                        className={`px-3 py-1 text-xs transition-colors ${
                          isEquipped
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {isEquipped ? "EQUIPPED" : "EQUIP"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tooltip */}
        {hoveredItem && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={`bg-black/90 border ${getRarityColor(hoveredItem.item.rarity)} p-3 shadow-lg z-50 max-w-xs`}
            {...getFloatingProps()}
          >
            <div className="flex items-center gap-2 mb-2">
              <img
                src={generateLootImageUrl(hoveredItem.item.name)}
                alt={hoveredItem.item.name}
                className="w-8 h-8 flex-shrink-0"
              />
              <div>
                <div className="text-white font-semibold text-sm">{hoveredItem.item.name}</div>
                <div className={`text-xs font-medium ${getRarityColor(hoveredItem.item.rarity).split(' ')[0]}`}>
                  {hoveredItem.item.rarity}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-300">
              {getEquipmentDetails(hoveredItem.item.name)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentPopup;