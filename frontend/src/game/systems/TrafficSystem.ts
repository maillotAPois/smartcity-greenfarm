import { BuildingType, type ModuleState } from "@/game/state/types";

export interface CrossModuleEffects {
  energyCoverage: number;
  securityScore: number;
  wasteEfficiency: number;
  foodSupply: number;
}

export function updateMetrics(
  module: ModuleState,
  effects: CrossModuleEffects,
): Record<string, number> {
  const buildings = module.buildings;
  const roadCount = buildings.filter((b) => b.type === BuildingType.ROAD).length;
  const lightCount = buildings.filter((b) => b.type === BuildingType.SMART_TRAFFIC_LIGHT).length;
  const busCount = buildings.filter((b) => b.type === BuildingType.BUS_STATION).length;
  const metroCount = buildings.filter((b) => b.type === BuildingType.METRO_LINE).length;
  const highwayCount = buildings.filter((b) => b.type === BuildingType.HIGHWAY_INTERCHANGE).length;

  const baseFlow = Math.min(100, roadCount * 5 + lightCount * 10 + busCount * 8 + metroCount * 15 + highwayCount * 12);
  const energyPenalty = effects.energyCoverage < 50 ? (50 - effects.energyCoverage) * 0.3 : 0;
  const trafficFlow = Math.max(0, baseFlow - energyPenalty);

  const publicTransit = Math.min(100, busCount * 15 + metroCount * 25);
  const congestion = Math.max(0, 100 - trafficFlow);
  const avgCondition = buildings.length > 0
    ? buildings.reduce((sum, b) => sum + b.condition, 0) / buildings.length
    : 50;

  return {
    trafficFlow,
    publicTransit,
    congestion,
    roadCondition: avgCondition,
  };
}

export function checkFailure(module: ModuleState): string | null {
  const metrics = module.metrics;
  if ((metrics["trafficFlow"] ?? 50) < 10) {
    return "Traffic system is critically congested. Emergency intervention needed.";
  }
  const poorBuildings = module.buildings.filter((b) => b.condition < 15);
  if (poorBuildings.length > 3) {
    return "Multiple traffic infrastructure elements are in critical condition.";
  }
  return null;
}

export function getRevenue(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.revenue, 0);
}

export function getExpenses(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.operatingCost, 0);
}
