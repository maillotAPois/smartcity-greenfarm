import type { ProcessingQueue, ProcessingSlot, Recipe, Inventory, FarmItemType } from "@/game/state/types";
import * as InventorySystem from "./InventorySystem";

export function startRecipe(
  queue: ProcessingQueue,
  recipe: Recipe,
  inventory: Inventory,
  currentTick: number,
  speedBonus: number = 0,
): { updatedQueue: ProcessingQueue; updatedInventory: Inventory } | null {
  if (!InventorySystem.hasItems(inventory, recipe.inputs)) return null;

  const emptySlotIndex = queue.slots.findIndex((s) => !s.recipeId && !s.ready);
  if (emptySlotIndex === -1) return null;

  const duration = Math.max(1, Math.round(recipe.duration * (1 - speedBonus)));
  const newSlot: ProcessingSlot = {
    recipeId: recipe.id,
    startedAtTick: currentTick,
    duration,
    output: recipe.output,
    outputQuantity: recipe.outputQuantity,
    ready: false,
  };

  const updatedSlots = [...queue.slots];
  updatedSlots[emptySlotIndex] = newSlot;

  return {
    updatedQueue: { ...queue, slots: updatedSlots },
    updatedInventory: InventorySystem.removeItems(inventory, recipe.inputs),
  };
}

export function advanceProcessing(
  queues: ProcessingQueue[],
  currentTick: number,
): ProcessingQueue[] {
  return queues.map((queue) => ({
    ...queue,
    slots: queue.slots.map((slot) => {
      if (!slot.recipeId || slot.ready) return slot;
      const elapsed = currentTick - slot.startedAtTick;
      if (elapsed >= slot.duration) {
        return { ...slot, ready: true };
      }
      return slot;
    }),
  }));
}

export function collectOutput(
  queue: ProcessingQueue,
  slotIndex: number,
): { updatedQueue: ProcessingQueue; output: FarmItemType; quantity: number } | null {
  const slot = queue.slots[slotIndex];
  if (!slot || !slot.ready || !slot.output) return null;

  const updatedSlots = [...queue.slots];
  updatedSlots[slotIndex] = {
    recipeId: undefined,
    startedAtTick: 0,
    duration: 0,
    output: undefined,
    outputQuantity: 0,
    ready: false,
  };

  return {
    updatedQueue: { ...queue, slots: updatedSlots },
    output: slot.output,
    quantity: slot.outputQuantity,
  };
}

export function getSlotProgress(slot: ProcessingSlot, currentTick: number): number {
  if (!slot.recipeId) return 0;
  if (slot.ready) return 1;
  if (slot.duration === 0) return 0;
  const elapsed = currentTick - slot.startedAtTick;
  return Math.min(1, elapsed / slot.duration);
}
