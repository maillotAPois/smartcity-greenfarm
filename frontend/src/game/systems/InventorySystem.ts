import type { Inventory } from "@/game/state/types";

export function addItem(
  inventory: Inventory,
  itemType: string,
  quantity: number,
): Inventory {
  return {
    ...inventory,
    [itemType]: (inventory[itemType] ?? 0) + quantity,
  };
}

export function removeItem(
  inventory: Inventory,
  itemType: string,
  quantity: number,
): Inventory {
  const current = inventory[itemType] ?? 0;
  const newQty = Math.max(0, current - quantity);
  const result = { ...inventory };
  if (newQty === 0) {
    delete result[itemType];
  } else {
    result[itemType] = newQty;
  }
  return result;
}

export function hasItems(
  inventory: Inventory,
  items: Partial<Record<string, number>>,
): boolean {
  for (const [key, needed] of Object.entries(items)) {
    if ((inventory[key] ?? 0) < (needed ?? 0)) return false;
  }
  return true;
}

export function removeItems(
  inventory: Inventory,
  items: Partial<Record<string, number>>,
): Inventory {
  let result = { ...inventory };
  for (const [key, qty] of Object.entries(items)) {
    result = removeItem(result, key, qty ?? 0);
  }
  return result;
}

export function getTotalCount(inventory: Inventory): number {
  return Object.values(inventory).reduce((sum, qty) => sum + qty, 0);
}

export function isFull(inventory: Inventory, capacity: number): boolean {
  return getTotalCount(inventory) >= capacity;
}
