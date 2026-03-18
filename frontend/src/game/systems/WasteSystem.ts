import { BuildingType, type ModuleState } from "@/game/state/types";
import type { CrossModuleEffects } from "./TrafficSystem";

export function updateMetrics(
  module: ModuleState,
  effects: CrossModuleEffects,
): Record<string, number> {
  const buildings = module.buildings;
  const binCount = buildings.filter((b) => b.type === BuildingType.TRASH_BIN_NETWORK).length;
  const recycleCount = buildings.filter((b) => b.type === BuildingType.RECYCLING_CENTER).length;
  const compostCount = buildings.filter((b) => b.type === BuildingType.COMPOSTING_FACILITY).length;
  const wteCount = buildings.filter((b) => b.type === BuildingType.WASTE_TO_ENERGY).length;
  const smartBinCount = buildings.filter((b) => b.type === BuildingType.SMART_BIN).length;

  const collection = Math.min(100, binCount * 8 + smartBinCount * 12);
  const recyclingRate = Math.min(100, recycleCount * 20 + compostCount * 15);
  const energyRecovery = wteCount * 25;
  const energyPenalty = effects.energyCoverage < 40 ? 10 : 0;
  const wasteEfficiency = Math.min(100, collection * 0.4 + recyclingRate * 0.4 + energyRecovery * 0.2 - energyPenalty);
  const pollution = Math.max(0, 100 - wasteEfficiency);

  return {
    collection,
    recyclingRate,
    energyRecovery,
    wasteEfficiency: Math.max(0, wasteEfficiency),
    pollution,
  };
}

export function checkFailure(module: ModuleState): string | null {
  const metrics = module.metrics;
  if ((metrics["wasteEfficiency"] ?? 50) < 10) {
    return "Waste management has collapsed. Health hazards are spreading.";
  }
  if ((metrics["pollution"] ?? 50) > 90) {
    return "Pollution levels are critically high.";
  }
  return null;
}

export function getRevenue(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.revenue, 0);
}

export function getExpenses(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.operatingCost, 0);
}
