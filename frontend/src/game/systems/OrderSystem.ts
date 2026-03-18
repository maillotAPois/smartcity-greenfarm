import type { Order, Inventory, FarmItemType } from "@/game/state/types";
import * as InventorySystem from "./InventorySystem";

const ORDER_ITEMS_BY_LEVEL: FarmItemType[][] = [
  ["lettuce", "wheat", "herbs"],
  ["corn", "carrot", "egg"],
  ["flour", "feed", "tomato"],
  ["milk", "bread", "cheese"],
  ["honey", "strawberry", "cake", "pastry", "ice_cream", "sunflower"],
];

function getAvailableItems(playerLevel: number): FarmItemType[] {
  const items: FarmItemType[] = [];
  for (let i = 0; i < ORDER_ITEMS_BY_LEVEL.length; i++) {
    const minLevel = i * 2 + 1;
    if (playerLevel >= minLevel) {
      items.push(...ORDER_ITEMS_BY_LEVEL[i]);
    }
  }
  return items;
}

export function generateOrder(currentTick: number, playerLevel: number): Order {
  const available = getAvailableItems(playerLevel);
  const itemCount = 2 + Math.floor(Math.random() * 3); // 2-4 items
  const items: Partial<Record<FarmItemType, number>> = {};

  for (let i = 0; i < itemCount; i++) {
    const item = available[Math.floor(Math.random() * available.length)];
    items[item] = (items[item] ?? 0) + (1 + Math.floor(Math.random() * 3));
  }

  const complexity = Object.values(items).reduce((s, v) => s + v, 0);
  const rewardCredits = complexity * (10 + playerLevel * 2);
  const rewardXp = Math.floor(complexity * (3 + playerLevel));

  return {
    id: `order_${currentTick}_${Math.random().toString(36).slice(2, 6)}`,
    items,
    rewardCredits,
    rewardXp,
    createdAtTick: currentTick,
    expiresAtTick: currentTick + 200 + playerLevel * 20,
  };
}

export function tickOrders(
  orders: Order[],
  currentTick: number,
  maxOrders: number,
  playerLevel: number,
  _trafficBonus: number = 0,
): Order[] {
  // Remove expired orders
  let updated = orders.filter((o) => currentTick < o.expiresAtTick);

  // Generate new orders periodically (every ~50 ticks)
  if (updated.length < maxOrders && currentTick % 50 === 0) {
    updated = [...updated, generateOrder(currentTick, playerLevel)];
  }

  return updated;
}

export function fillOrder(
  order: Order,
  inventory: Inventory,
): { updatedInventory: Inventory; credits: number; xp: number } | null {
  if (!InventorySystem.hasItems(inventory, order.items)) return null;

  return {
    updatedInventory: InventorySystem.removeItems(inventory, order.items),
    credits: order.rewardCredits,
    xp: order.rewardXp,
  };
}
