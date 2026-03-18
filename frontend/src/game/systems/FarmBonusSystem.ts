import { ModuleType, type GameState } from "@/game/state/types";

export interface FarmBonuses {
  growthBonus: number;
  processingBonus: number;
  orderFrequencyBonus: number;
  cropProtection: number;
}

export function calculateFarmBonuses(state: GameState): FarmBonuses {
  const wasteEfficiency = state.modules[ModuleType.WASTE].metrics["wasteEfficiency"] ?? 0;
  const energyCoverage = state.modules[ModuleType.ENERGY].metrics["energyCoverage"] ?? 0;
  const trafficFlow = state.modules[ModuleType.TRAFFIC].metrics["trafficFlow"] ?? 0;
  const securityScore = state.modules[ModuleType.SECURITY].metrics["securityScore"] ?? 0;

  // Waste > 70: compost boost -> crops grow 15% faster
  const growthBonus = wasteEfficiency > 70 ? 0.15 : 0;

  // Energy > 70: processing 20% faster; < 30: processing 25% slower
  let processingBonus = 0;
  if (energyCoverage > 70) {
    processingBonus = 0.20;
  } else if (energyCoverage < 30) {
    processingBonus = -0.25;
  }

  // Traffic > 70: orders 20% more frequent
  const orderFrequencyBonus = trafficFlow > 70 ? 0.20 : 0;

  // Security score: crop protection 0-100%
  const cropProtection = Math.min(100, Math.max(0, securityScore)) / 100;

  return { growthBonus, processingBonus, orderFrequencyBonus, cropProtection };
}
