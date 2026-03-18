import type { Building, ModuleState } from "./types";

export function calculateUpgradeCost(baseCost: number, level: number): number {
  return Math.floor(baseCost * Math.pow(1.15, level));
}

export function calculateXpRequired(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level));
}

export function calculateMaintenanceCost(building: Building): number {
  return Math.floor(building.operatingCost * 0.02 * building.level);
}

export function calculateModuleSatisfaction(module: ModuleState): number {
  const metrics = Object.values(module.metrics);
  if (metrics.length === 0) return 50;
  const sum = metrics.reduce((acc, val) => acc + val, 0);
  return Math.min(100, Math.max(0, sum / metrics.length));
}

export function calculatePopulationGrowth(
  satisfaction: number,
  currentPop: number,
): number {
  const growthRate = (satisfaction - 50) / 1000;
  const growth = Math.floor(currentPop * growthRate);
  return Math.max(-Math.floor(currentPop * 0.01), growth);
}
