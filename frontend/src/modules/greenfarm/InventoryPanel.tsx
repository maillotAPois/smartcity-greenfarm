import { useGameStore } from "@/game/state/gameStore";
import { ITEMS } from "@/game/data/items";
import type { FarmItemType } from "@/game/state/types";

export default function InventoryPanel() {
  const inventory = useGameStore((s) => s.farmState.inventory);
  const storageCapacity = useGameStore((s) => s.farmState.storageCapacity);
  const sellItem = useGameStore((s) => s.sellItem);

  const totalCount = Object.values(inventory).reduce((s, q) => s + q, 0);
  const entries = Object.entries(inventory).filter(([, qty]) => qty > 0);

  return (
    <div>
      <div className="text-gray-400 text-xs mb-3">
        Storage: {totalCount}/{storageCapacity}
      </div>
      {entries.length === 0 && (
        <p className="text-gray-500 text-sm">Inventory is empty.</p>
      )}
      <div className="space-y-1">
        {entries.map(([itemType, qty]) => {
          const def = ITEMS[itemType as FarmItemType];
          if (!def) return null;
          return (
            <div
              key={itemType}
              className="bg-gray-700 rounded px-3 py-2 flex justify-between items-center text-sm"
            >
              <div>
                <span className="text-white">{def.name}</span>
                <span className="text-gray-400 ml-2">x{qty}</span>
              </div>
              <button
                onClick={() => sellItem(itemType as FarmItemType, 1)}
                className="bg-yellow-700 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded"
              >
                Sell ({def.sellPrice}c)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
