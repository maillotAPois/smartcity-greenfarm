import { useGameStore } from "@/game/state/gameStore";
import { UPGRADES } from "@/game/data/upgrades";
import { calculateUpgradeCost } from "@/game/state/actions";
import { BUILDINGS } from "@/game/data/buildings";

export default function UpgradeTree() {
  const selectedBuildingId = useGameStore((s) => s.selectedBuilding);
  const modules = useGameStore((s) => s.modules);
  const credits = useGameStore((s) => s.economy.credits);
  const upgradeBuilding = useGameStore((s) => s.upgradeBuilding);

  if (!selectedBuildingId) {
    return (
      <div className="p-4 text-gray-400 text-sm">
        Select a building to view upgrades.
      </div>
    );
  }

  // Find the building across all modules
  let building = null;
  for (const m of Object.values(modules)) {
    const found = m.buildings.find((b) => b.id === selectedBuildingId);
    if (found) {
      building = found;
      break;
    }
  }

  if (!building) {
    return (
      <div className="p-4 text-gray-400 text-sm">
        Building not found.
      </div>
    );
  }

  const upgrades = UPGRADES[building.type] ?? [];
  const def = BUILDINGS[building.type];
  const upgradeCost = calculateUpgradeCost(def.baseCost, building.level);

  return (
    <div className="p-4">
      <h3 className="text-white font-bold mb-1">{building.name}</h3>
      <p className="text-gray-400 text-xs mb-3">
        Level {building.level} | Condition: {Math.round(building.condition)}%
      </p>

      <button
        onClick={() => upgradeBuilding(building.id)}
        disabled={credits < upgradeCost}
        className={`w-full mb-4 px-3 py-2 rounded text-sm font-medium ${
          credits >= upgradeCost
            ? "bg-blue-600 text-white hover:bg-blue-500"
            : "bg-gray-700 text-gray-500 cursor-not-allowed"
        }`}
      >
        Upgrade to Lv.{building.level + 1} ({upgradeCost} credits)
      </button>

      {upgrades.length > 0 && (
        <div>
          <h4 className="text-gray-300 text-xs font-medium mb-2">
            Available Upgrades
          </h4>
          {upgrades.map((u, idx) => (
            <div
              key={idx}
              className="bg-gray-700 rounded p-2 mb-2 text-sm"
            >
              <div className="text-white font-medium">{u.name}</div>
              <div className="text-gray-400 text-xs">{u.description}</div>
              <div className="text-gray-500 text-xs mt-1">
                Cost: {u.baseCost} | Max Lv.{u.maxLevel}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
