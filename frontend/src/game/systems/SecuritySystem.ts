import { BuildingType, type ModuleState } from "@/game/state/types";
import type { CrossModuleEffects } from "./TrafficSystem";

export function updateMetrics(
  module: ModuleState,
  effects: CrossModuleEffects,
): Record<string, number> {
  const buildings = module.buildings;
  const cctvCount = buildings.filter((b) => b.type === BuildingType.CCTV_CAMERA).length;
  const policeCount = buildings.filter((b) => b.type === BuildingType.POLICE_STATION).length;
  const fireCount = buildings.filter((b) => b.type === BuildingType.FIRE_STATION).length;
  const dispatchCount = buildings.filter((b) => b.type === BuildingType.DISPATCH_CENTER).length;
  const droneCount = buildings.filter((b) => b.type === BuildingType.DRONE_HUB).length;

  const surveillance = Math.min(100, cctvCount * 8 + droneCount * 20);
  const responseTime = Math.max(0, 100 - (policeCount * 15 + fireCount * 15 + dispatchCount * 20));
  const trafficPenalty = effects.energyCoverage < 40 ? 15 : 0;
  const securityScore = Math.min(100, surveillance * 0.3 + (100 - responseTime) * 0.5 + dispatchCount * 10 - trafficPenalty);
  const fireSafety = Math.min(100, fireCount * 25 + dispatchCount * 15);

  return {
    surveillance,
    responseTime,
    securityScore: Math.max(0, securityScore),
    fireSafety,
  };
}

export function checkFailure(module: ModuleState): string | null {
  const metrics = module.metrics;
  if ((metrics["securityScore"] ?? 50) < 10) {
    return "Security is critically low. Crime rates are spiking.";
  }
  if ((metrics["fireSafety"] ?? 50) < 10) {
    return "Fire safety is critically low. Buildings are at risk.";
  }
  return null;
}

export function getRevenue(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.revenue, 0);
}

export function getExpenses(module: ModuleState): number {
  return module.buildings.reduce((sum, b) => sum + b.operatingCost, 0);
}
