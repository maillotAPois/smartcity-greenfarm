import { useGameStore } from "./gameStore";
import type { ModuleType } from "./types";

export const useCredits = () => useGameStore((s) => s.economy.credits);
export const usePopulation = () => useGameStore((s) => s.population);
export const useLevel = () => useGameStore((s) => s.progression.level);
export const useSpeed = () => useGameStore((s) => s.speed);
export const useTick = () => useGameStore((s) => s.tick);

export const useModuleState = (module: ModuleType) =>
  useGameStore((s) => s.modules[module]);

export const useModuleMetrics = (module: ModuleType) =>
  useGameStore((s) => s.modules[module].metrics);

export const useModuleBuildings = (module: ModuleType) =>
  useGameStore((s) => s.modules[module].buildings);

export const useActiveEvents = () => useGameStore((s) => s.activeEvents);
export const useActiveMissions = () =>
  useGameStore((s) => s.missions.filter((m) => !m.completed));

export const useUnreadNotifications = () =>
  useGameStore((s) => s.notifications.filter((n) => !n.read));

export const useTotalIncome = () => useGameStore((s) => s.economy.income);
export const useTotalExpenses = () => useGameStore((s) => s.economy.expenses);
export const useNetIncome = () =>
  useGameStore((s) => s.economy.income - s.economy.expenses);

export const useSatisfactionScore = () =>
  useGameStore((s) => s.satisfactionScore);

// Farm selectors
export const useFarmState = () => useGameStore((s) => s.farmState);
export const useInventory = () => useGameStore((s) => s.farmState.inventory);
export const useOrders = () => useGameStore((s) => s.farmState.orders);
export const usePlots = () => useGameStore((s) => s.farmState.plots);
export const useAnimalPens = () => useGameStore((s) => s.farmState.animalPens);
export const useProcessingQueues = () => useGameStore((s) => s.farmState.processingQueues);
export const useTotalInventoryCount = () =>
  useGameStore((s) =>
    Object.values(s.farmState.inventory).reduce((sum, qty) => sum + qty, 0),
  );
