import { ModuleType, type GameState } from "@/game/state/types";
import { formatDate } from "./GameClock";
import type { CrossModuleEffects } from "@/game/systems/TrafficSystem";
import * as TrafficSystem from "@/game/systems/TrafficSystem";
import * as EnergySystem from "@/game/systems/EnergySystem";
import * as SecuritySystem from "@/game/systems/SecuritySystem";
import * as WasteSystem from "@/game/systems/WasteSystem";
import * as FarmSystem from "@/game/systems/FarmSystem";
import * as EconomySystem from "@/game/systems/EconomySystem";
import * as CropSystem from "@/game/systems/CropSystem";
import * as AnimalSystem from "@/game/systems/AnimalSystem";
import * as ProcessingSystem from "@/game/systems/ProcessingSystem";
import * as OrderSystem from "@/game/systems/OrderSystem";
import { calculateFarmBonuses } from "@/game/systems/FarmBonusSystem";
import { calculatePopulationGrowth, calculateModuleSatisfaction } from "@/game/state/actions";

interface ModuleSystem {
  updateMetrics: (module: GameState["modules"][ModuleType], effects: CrossModuleEffects) => Record<string, number>;
  checkFailure: (module: GameState["modules"][ModuleType]) => string | null;
}

const SYSTEMS: Record<ModuleType, ModuleSystem> = {
  [ModuleType.TRAFFIC]: TrafficSystem,
  [ModuleType.ENERGY]: EnergySystem,
  [ModuleType.SECURITY]: SecuritySystem,
  [ModuleType.WASTE]: WasteSystem,
  [ModuleType.FARM]: FarmSystem,
};

export function simulateTick(state: GameState): Partial<GameState> {
  const newTick = state.tick + 1;
  const newDate = formatDate(newTick);

  // Build cross-module effects from previous tick metrics
  const crossEffects: CrossModuleEffects = {
    energyCoverage: state.modules[ModuleType.ENERGY].metrics["energyCoverage"] ?? 50,
    securityScore: state.modules[ModuleType.SECURITY].metrics["securityScore"] ?? 50,
    wasteEfficiency: state.modules[ModuleType.WASTE].metrics["wasteEfficiency"] ?? 50,
    foodSupply: state.modules[ModuleType.FARM].metrics["foodSupply"] ?? 50,
  };

  // Update each module
  const updatedModules = { ...state.modules };
  const notifications = [...state.notifications];

  for (const moduleType of Object.values(ModuleType)) {
    const system = SYSTEMS[moduleType];
    const moduleState = state.modules[moduleType];
    const newMetrics = system.updateMetrics(moduleState, crossEffects);

    // Degrade building condition slightly each tick
    const updatedBuildings = moduleState.buildings.map((b) => ({
      ...b,
      condition: Math.max(0, b.condition - 0.05),
    }));

    updatedModules[moduleType] = {
      ...moduleState,
      metrics: newMetrics,
      buildings: updatedBuildings,
    };

    // Check for failures (grace period: no failure alerts before tick 100)
    if (newTick > 100) {
      const failure = system.checkFailure(updatedModules[moduleType]);
      if (failure) {
        notifications.push({
          id: `fail_${moduleType}_${newTick}`,
          message: failure,
          type: "error",
          tick: newTick,
          read: false,
        });
      }
    }
  }

  // Update economy
  const income = EconomySystem.calculateTotalIncome({ ...state, modules: updatedModules });
  const expenses = EconomySystem.calculateTotalExpenses({ ...state, modules: updatedModules });
  const netIncome = income - expenses;
  const newCredits = state.economy.credits + netIncome;
  const updatedEconomy = EconomySystem.processLoans({
    ...state.economy,
    credits: newCredits,
    income,
    expenses,
    creditHistory: [...state.economy.creditHistory.slice(-99), newCredits],
  });

  if (EconomySystem.checkBankruptcy(updatedEconomy)) {
    notifications.push({
      id: `bankruptcy_${newTick}`,
      message: "The city is bankrupt. Take immediate action.",
      type: "error",
      tick: newTick,
      read: false,
    });
  }

  // Calculate satisfaction
  const moduleSatisfactions = Object.values(ModuleType).map(
    (mt) => calculateModuleSatisfaction(updatedModules[mt]),
  );
  const avgSatisfaction = moduleSatisfactions.reduce((a, b) => a + b, 0) / moduleSatisfactions.length;
  const satisfactionScore = Math.round(avgSatisfaction);

  // Population growth
  const popGrowth = calculatePopulationGrowth(satisfactionScore, state.population);
  const population = Math.max(0, state.population + popGrowth);

  // Remove expired events
  const activeEvents = state.activeEvents.filter(
    (e) => newTick - e.tick < e.duration,
  );

  // -- Farm systems tick --
  const farmBonuses = calculateFarmBonuses({ ...state, modules: updatedModules });
  let farmState = { ...state.farmState };

  // Advance crop growth
  farmState = {
    ...farmState,
    plots: CropSystem.advanceCropGrowth(farmState.plots, newTick),
  };

  // Advance animal production
  farmState = {
    ...farmState,
    animalPens: AnimalSystem.advanceAnimalProduction(farmState.animalPens, newTick),
  };

  // Advance processing queues
  farmState = {
    ...farmState,
    processingQueues: ProcessingSystem.advanceProcessing(farmState.processingQueues, newTick),
  };

  // Tick orders (generate new ones, expire old ones)
  const maxOrders = 3;
  farmState = {
    ...farmState,
    orders: OrderSystem.tickOrders(
      farmState.orders,
      newTick,
      maxOrders,
      state.progression.level,
      farmBonuses.orderFrequencyBonus,
    ),
  };

  return {
    tick: newTick,
    date: newDate,
    modules: updatedModules,
    economy: updatedEconomy,
    population,
    satisfactionScore,
    activeEvents,
    notifications,
    farmState,
  };
}
