import type { CropPlot, CropType, FarmItemType } from "@/game/state/types";
import { CROPS } from "@/game/data/crops";

export function plantCrop(
  plot: CropPlot,
  cropType: CropType,
  currentTick: number,
  growthBonus: number = 0,
): CropPlot {
  const def = CROPS[cropType];
  const duration = Math.max(1, Math.round(def.growthTicks * (1 - growthBonus)));
  return {
    ...plot,
    cropType,
    plantedAtTick: currentTick,
    growthDuration: duration,
    stage: "growing",
    quantity: def.yield,
  };
}

export function advanceCropGrowth(
  plots: CropPlot[],
  currentTick: number,
): CropPlot[] {
  return plots.map((plot) => {
    if (plot.stage !== "growing" || !plot.cropType) return plot;
    const elapsed = currentTick - plot.plantedAtTick;
    if (elapsed >= plot.growthDuration) {
      return { ...plot, stage: "ready" };
    }
    return plot;
  });
}

export function harvestCrop(
  plot: CropPlot,
): { updatedPlot: CropPlot; itemType: FarmItemType; quantity: number } | null {
  if (plot.stage !== "ready" || !plot.cropType) return null;
  const def = CROPS[plot.cropType];
  return {
    updatedPlot: {
      ...plot,
      cropType: undefined,
      plantedAtTick: 0,
      growthDuration: 0,
      stage: "empty",
      quantity: 0,
    },
    itemType: def.itemType,
    quantity: plot.quantity,
  };
}

export function getCropProgress(plot: CropPlot, currentTick: number): number {
  if (plot.stage === "empty") return 0;
  if (plot.stage === "ready") return 1;
  if (plot.growthDuration === 0) return 0;
  const elapsed = currentTick - plot.plantedAtTick;
  return Math.min(1, elapsed / plot.growthDuration);
}
