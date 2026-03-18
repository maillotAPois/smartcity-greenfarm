import { BuildingType, type ModuleState } from "@/game/state/types";
import type { CrossModuleEffects } from "./TrafficSystem";

export function updateMetrics(
  module: ModuleState,
  _effects: CrossModuleEffects,
): Record<string, number> {
  const buildings = module.buildings;
  const solarCount = buildings.filter((b) => b.type === BuildingType.SOLAR_PANEL).length;
  const windCount = buildings.filter((b) => b.type === BuildingType.WIND_TURBINE).length;
  const batteryCount = buildings.filter((b) => b.type === BuildingType.BATTERY_STORAGE).length;
  const gridCount = buildings.filter((b) => b.type === BuildingType.SMART_GRID_HUB).length;
  const nuclearCount = buildings.filter((b) => b.type === BuildingType.NUCLEAR_PLANT).length;

  const generation = solarCount * 10 + windCount * 15 + nuclearCount * 80;
  const storage = batteryCount * 30;
  const gridEfficiency = gridCount > 0 ? Math.min(100, 60 + gridCount * 15) : 40;
  const energyCoverage = Math.min(100, (generation * gridEfficiency) / 100 + storage * 0.2);
  const renewableRatio = nuclearCount > 0
    ? ((solarCount * 10 + windCount * 15) / Math.max(1, generation)) * 100
    : 100;

  return {
    generation,
    storage,
    gridEfficiency,
    energyCoverage,
    renewableRatio,
  };
}

export function checkFailure(module: ModuleState): string | null {
  const metrics = module.metrics;
  if ((metrics["energyCoverage"] ?? 50) < 15) {
    return "Energy supply is critically low. Blackouts imminent.";
  }
  return null;
}

export function getRevenue(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.revenue, 0);
}

export function getExpenses(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.operatingCost, 0);
}
