import { BuildingType, type ModuleState } from "@/game/state/types";
import type { CrossModuleEffects } from "./TrafficSystem";

export function updateMetrics(
  module: ModuleState,
  effects: CrossModuleEffects,
): Record<string, number> {
  const buildings = module.buildings;

  // Legacy buildings still contribute to food supply
  const gardenCount = buildings.filter((b) => b.type === BuildingType.COMMUNITY_GARDEN).length;
  const greenCount = buildings.filter((b) => b.type === BuildingType.GREENHOUSE).length;
  const verticalCount = buildings.filter((b) => b.type === BuildingType.VERTICAL_FARM).length;
  const hydroCount = buildings.filter((b) => b.type === BuildingType.HYDROPONICS_LAB).length;
  const aquaCount = buildings.filter((b) => b.type === BuildingType.AQUAPONICS_CENTER).length;

  // New farm buildings
  const fieldCount = buildings.filter((b) => b.type === BuildingType.FIELD).length;
  const coopCount = buildings.filter((b) => b.type === BuildingType.CHICKEN_COOP).length;
  const pastureCount = buildings.filter((b) => b.type === BuildingType.COW_PASTURE).length;
  const hiveCount = buildings.filter((b) => b.type === BuildingType.BEE_HIVE).length;
  const millCount = buildings.filter((b) => b.type === BuildingType.MILL).length;
  const bakeryCount = buildings.filter((b) => b.type === BuildingType.BAKERY).length;
  const dairyCount = buildings.filter((b) => b.type === BuildingType.DAIRY).length;

  const legacyYield = gardenCount * 5 + greenCount * 15 + verticalCount * 30 + hydroCount * 25 + aquaCount * 35;
  const farmBuildingYield = fieldCount * 3 + coopCount * 5 + pastureCount * 8 + hiveCount * 6 + millCount * 4 + bakeryCount * 6 + dairyCount * 6;

  const farmYield = legacyYield + farmBuildingYield;
  const energyBonus = effects.energyCoverage > 70 ? 10 : 0;
  const wastePenalty = effects.wasteEfficiency < 30 ? 15 : 0;
  const foodSupply = Math.min(100, farmYield + energyBonus - wastePenalty);

  const allTypes = new Set(buildings.map((b) => b.type));
  const diversity = Math.min(100, allTypes.size * 10);

  const totalFarmBuildings = fieldCount + coopCount + pastureCount + hiveCount + millCount + bakeryCount + dairyCount;
  const productionRatio = buildings.length > 0
    ? (totalFarmBuildings / buildings.length) * 100
    : 0;

  return {
    farmYield: Math.max(0, farmYield),
    foodSupply: Math.max(0, foodSupply),
    diversity,
    productionRatio,
  };
}

export function checkFailure(module: ModuleState): string | null {
  const metrics = module.metrics;
  if ((metrics["foodSupply"] ?? 50) < 5) {
    return "Food supply is critically low. Citizens are going hungry.";
  }
  return null;
}

export function getRevenue(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.revenue, 0);
}

export function getExpenses(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.operatingCost, 0);
}
