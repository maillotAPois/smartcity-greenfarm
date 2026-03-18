import { BuildingType, ModuleType } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";
import { BUILDINGS } from "@/game/data/buildings";
import { isFarmBuilding } from "@/game/renderer/MapRenderer";

interface BuildMenuProps {
  onSelect: (type: BuildingType) => void;
}

export default function BuildMenu({ onSelect }: BuildMenuProps) {
  const selectedModule = useGameStore((s) => s.selectedModule);
  const unlockedBuildings = useGameStore((s) => s.progression.unlockedBuildings);
  const credits = useGameStore((s) => s.economy.credits);
  const level = useGameStore((s) => s.progression.level);

  const allTypes = Object.values(BuildingType).filter((bt) => {
    const def = BUILDINGS[bt];
    if (selectedModule && def.module !== selectedModule) return false;
    return true;
  });

  // When Farm module is selected, show farm buildings first
  const isFarmSelected = selectedModule === ModuleType.FARM;
  const farmTypes = isFarmSelected ? allTypes.filter((bt) => isFarmBuilding(bt)) : [];
  const supportTypes = isFarmSelected ? allTypes.filter((bt) => !isFarmBuilding(bt)) : [];
  const sortedTypes = isFarmSelected ? [...farmTypes, ...supportTypes] : allTypes;

  const renderButton = (bt: BuildingType) => {
    const def = BUILDINGS[bt];
    const unlocked = unlockedBuildings.includes(bt);
    const affordable = credits >= def.baseCost;
    const meetsLevel = level >= def.requiredLevel;
    const canBuild = unlocked && affordable && meetsLevel;

    return (
      <button
        key={bt}
        onClick={() => canBuild && onSelect(bt)}
        disabled={!canBuild}
        className={`text-left rounded p-2 text-sm ${
          canBuild
            ? "bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium">{def.name}</span>
          <span className={affordable ? "text-green-400" : "text-red-400"}>
            {def.baseCost}c
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">{def.description}</div>
        {!unlocked && (
          <div className="text-xs text-yellow-500 mt-1">
            Requires Lv.{def.requiredLevel}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="p-3">
      <h3 className="text-white font-bold text-sm mb-3">Build</h3>
      <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
        {isFarmSelected && farmTypes.length > 0 && (
          <>
            <div className="text-green-400 text-xs font-bold uppercase tracking-wide">Farm Buildings</div>
            {farmTypes.map(renderButton)}
            {supportTypes.length > 0 && (
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wide mt-2">City Support</div>
            )}
            {supportTypes.map(renderButton)}
          </>
        )}
        {!isFarmSelected && sortedTypes.map(renderButton)}
      </div>
    </div>
  );
}
