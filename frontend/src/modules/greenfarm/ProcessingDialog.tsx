import { useGameStore } from "@/game/state/gameStore";
import { RECIPES } from "@/game/data/recipes";
import { ITEMS } from "@/game/data/items";
import { getSlotProgress } from "@/game/systems/ProcessingSystem";
import * as InventorySystem from "@/game/systems/InventorySystem";
import type { Building, FarmItemType } from "@/game/state/types";

interface ProcessingDialogProps {
  buildingId: string;
  onClose: () => void;
}

export default function ProcessingDialog({ buildingId, onClose }: ProcessingDialogProps) {
  const queue = useGameStore((s) => s.farmState.processingQueues.find((q) => q.buildingId === buildingId));
  const inventory = useGameStore((s) => s.farmState.inventory);
  const tick = useGameStore((s) => s.tick);
  const startProcessing = useGameStore((s) => s.startProcessing);
  const collectProcessed = useGameStore((s) => s.collectProcessed);
  const building = useGameStore((s) => {
    for (const m of Object.values(s.modules)) {
      const b = m.buildings.find((b: Building) => b.id === buildingId);
      if (b) return b;
    }
    return null;
  });

  if (!queue || !building) return null;

  const availableRecipes = RECIPES.filter((r) => r.buildingType === building.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-5 w-96 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold">{building.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">X</button>
        </div>

        {/* Active slots */}
        <div className="mb-4">
          <h4 className="text-gray-300 text-sm font-medium mb-2">Processing Slots</h4>
          {queue.slots.map((slot, idx) => {
            const progress = getSlotProgress(slot, tick);
            if (slot.ready && slot.output) {
              return (
                <div key={idx} className="bg-green-900 rounded p-2 mb-2 flex justify-between items-center">
                  <span className="text-green-300 text-sm">{ITEMS[slot.output].name} ready!</span>
                  <button
                    onClick={() => collectProcessed(buildingId, idx)}
                    className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded"
                  >
                    Collect
                  </button>
                </div>
              );
            }
            if (slot.recipeId) {
              const recipe = RECIPES.find((r) => r.id === slot.recipeId);
              return (
                <div key={idx} className="bg-gray-700 rounded p-2 mb-2">
                  <div className="text-gray-300 text-sm mb-1">{recipe?.name ?? "Processing..."}</div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{Math.round(progress * 100)}%</div>
                </div>
              );
            }
            return (
              <div key={idx} className="bg-gray-700 rounded p-2 mb-2 text-gray-500 text-sm">
                Empty slot
              </div>
            );
          })}
        </div>

        {/* Available recipes */}
        <div>
          <h4 className="text-gray-300 text-sm font-medium mb-2">Recipes</h4>
          {availableRecipes.map((recipe) => {
            const hasIngredients = InventorySystem.hasItems(inventory, recipe.inputs);
            const hasEmptySlot = queue.slots.some((s) => !s.recipeId && !s.ready);
            const canStart = hasIngredients && hasEmptySlot;

            return (
              <button
                key={recipe.id}
                disabled={!canStart}
                onClick={() => startProcessing(buildingId, recipe.id)}
                className={`w-full text-left rounded p-2 mb-1 text-sm ${
                  canStart
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-750 text-gray-500 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{recipe.name}</span>
                  <span className="text-gray-400">{recipe.duration}t</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {Object.entries(recipe.inputs).map(([item, qty]) => (
                    <span key={item} className={`mr-2 ${
                      (inventory[item] ?? 0) >= (qty ?? 0) ? "text-green-400" : "text-red-400"
                    }`}>
                      {ITEMS[item as FarmItemType].name}: {inventory[item] ?? 0}/{qty}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
