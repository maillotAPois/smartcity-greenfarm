import type { AnimalPen, FarmItemType } from "@/game/state/types";

export function advanceAnimalProduction(
  pens: AnimalPen[],
  currentTick: number,
): AnimalPen[] {
  return pens.map((pen) => {
    if (pen.readyToCollect) return pen;
    const elapsed = currentTick - pen.lastProducedTick;
    if (elapsed >= pen.productionInterval) {
      return { ...pen, readyToCollect: true };
    }
    return pen;
  });
}

export function collectProduct(
  pen: AnimalPen,
  currentTick: number,
): { updatedPen: AnimalPen; productType: FarmItemType; quantity: number } | null {
  if (!pen.readyToCollect) return null;
  return {
    updatedPen: {
      ...pen,
      readyToCollect: false,
      lastProducedTick: currentTick,
    },
    productType: pen.productType,
    quantity: pen.quantity,
  };
}

export function getAnimalProgress(pen: AnimalPen, currentTick: number): number {
  if (pen.readyToCollect) return 1;
  if (pen.productionInterval === 0) return 0;
  const elapsed = currentTick - pen.lastProducedTick;
  return Math.min(1, elapsed / pen.productionInterval);
}
