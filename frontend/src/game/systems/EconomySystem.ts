import { ModuleType, type GameState, type EconomyState, type ModuleState } from "@/game/state/types";
import * as TrafficSystem from "./TrafficSystem";
import * as EnergySystem from "./EnergySystem";
import * as SecuritySystem from "./SecuritySystem";
import * as WasteSystem from "./WasteSystem";
import * as FarmSystem from "./FarmSystem";

type ModuleSystemMap = {
  getRevenue: (module: ModuleState) => number;
  getExpenses: (module: ModuleState) => number;
};

const SYSTEMS: Record<ModuleType, ModuleSystemMap> = {
  [ModuleType.TRAFFIC]: TrafficSystem,
  [ModuleType.ENERGY]: EnergySystem,
  [ModuleType.SECURITY]: SecuritySystem,
  [ModuleType.WASTE]: WasteSystem,
  [ModuleType.FARM]: FarmSystem,
};

export function calculateTotalIncome(state: GameState): number {
  let total = 0;
  for (const moduleType of Object.values(ModuleType)) {
    const moduleState = state.modules[moduleType];
    const system = SYSTEMS[moduleType];
    total += system.getRevenue(moduleState);
  }
  return total;
}

export function calculateTotalExpenses(state: GameState): number {
  let total = 0;
  for (const moduleType of Object.values(ModuleType)) {
    const moduleState = state.modules[moduleType];
    const system = SYSTEMS[moduleType];
    total += system.getExpenses(moduleState);
  }
  const loanInterest = state.economy.loans.reduce(
    (sum, loan) => sum + loan.amount * loan.interestRate,
    0,
  );
  total += loanInterest;
  return total;
}

export function processLoans(economy: EconomyState): EconomyState {
  const updatedLoans = economy.loans
    .map((loan) => ({
      ...loan,
      remainingTicks: loan.remainingTicks - 1,
    }))
    .filter((loan) => loan.remainingTicks > 0);

  return {
    ...economy,
    loans: updatedLoans,
  };
}

export function checkBankruptcy(economy: EconomyState): boolean {
  const recentHistory = economy.creditHistory.slice(-10);
  if (recentHistory.length < 10) return false;
  return recentHistory.every((c) => c < 0);
}
