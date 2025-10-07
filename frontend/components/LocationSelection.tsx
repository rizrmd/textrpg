import React from "react";
import type { BattleState } from "../types";

interface LocationSelectionProps {
  battleState: BattleState;
  onSelectLocation: (locationIndex: number) => void;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({
  battleState,
  onSelectLocation,
}) => {
  return (
    <div className="bg-gray-800 p-4 text-center flex-1">
      <h4 className="m-0 mb-2.5 text-blue-400 font-mono">
        CHOOSE NEXT LOCATION:
      </h4>
        <div className="flex gap-2.5 justify-center flex-wrap">
          {battleState.locations[
            battleState.player.currentLocationIndex
          ]!.connections.map((locationIndex) => {
           const location = battleState.locations[locationIndex];
           if (!location) return null;
           return (
             <button
               key={locationIndex}
               onClick={() => onSelectLocation(locationIndex)}
               className="px-4 py-2.5 bg-blue-500 text-white cursor-pointer text-sm"
             >
               {location.name}
             </button>
           );
         })}
      </div>
    </div>
  );
};

export default LocationSelection;