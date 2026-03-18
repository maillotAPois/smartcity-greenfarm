import { useGameStore } from "@/game/state/gameStore";
import { ITEMS } from "@/game/data/items";
import * as InventorySystem from "@/game/systems/InventorySystem";
import type { FarmItemType } from "@/game/state/types";

export default function OrderPanel() {
  const orders = useGameStore((s) => s.farmState.orders);
  const inventory = useGameStore((s) => s.farmState.inventory);
  const tick = useGameStore((s) => s.tick);
  const fillOrder = useGameStore((s) => s.fillOrder);

  if (orders.length === 0) {
    return <p className="text-gray-500 text-sm">No active orders. Wait for trucks to arrive.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const canFill = InventorySystem.hasItems(inventory, order.items);
        const remaining = order.expiresAtTick - tick;

        return (
          <div key={order.id} className="bg-gray-700 rounded p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm font-medium">Order</span>
              <span className={`text-xs ${remaining < 50 ? "text-red-400" : "text-gray-400"}`}>
                {remaining}t left
              </span>
            </div>
            <div className="space-y-1 mb-2">
              {Object.entries(order.items).map(([item, qty]) => {
                const has = (inventory[item] ?? 0) >= (qty ?? 0);
                const def = ITEMS[item as FarmItemType];
                return (
                  <div key={item} className="flex justify-between text-sm">
                    <span className={has ? "text-green-400" : "text-red-400"}>
                      {has ? "[v]" : "[x]"} {def?.name ?? item}
                    </span>
                    <span className="text-gray-400">
                      {inventory[item] ?? 0}/{qty}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 text-xs">
                +{order.rewardCredits}c / +{order.rewardXp}xp
              </span>
              <button
                disabled={!canFill}
                onClick={() => fillOrder(order.id)}
                className={`text-xs px-3 py-1 rounded ${
                  canFill
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Fill Order
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
