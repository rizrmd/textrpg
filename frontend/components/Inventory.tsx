import React, { useState } from "react";
import { useFloating, useHover, useInteractions, offset, flip, shift } from "@floating-ui/react";
import type { BattleState } from "../types";
import { generateLootImageUrl } from "../utils";

interface InventoryProps {
  battleState: BattleState;
  onItemClick: (itemName: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ battleState, onItemClick }) => {
  const [hoveredItem, setHoveredItem] = useState<{ item: any; index: number } | null>(null);

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
    <div className="p-6 mt-2">
      <div className="flex gap-2 flex-wrap">
        {battleState.player.inventory.map((item, index) => (
          <div
            key={index}
            ref={hoveredItem?.index === index ? refs.setReference : null}
            className="w-12 h-12 bg-gray-700 flex items-center justify-center text-xs cursor-pointer hover:bg-gray-600 relative"
            onClick={() => onItemClick(item.name)}
            onMouseEnter={() => setHoveredItem({ item, index })}
            onMouseLeave={() => setHoveredItem(null)}
            {...getReferenceProps()}
          >
            <img
              src={generateLootImageUrl(item.name)}
              alt={item.name}
              className="w-10 h-10"
            />
          </div>
        ))}
        {battleState.player.inventory.length === 0 && (
          <div className="text-xs text-gray-500">No items</div>
        )}
      </div>

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
        </div>
      )}
    </div>
  );
};

export default Inventory;