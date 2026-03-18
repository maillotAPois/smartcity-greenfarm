import { create } from "zustand";
import {
  BuildingType,
  ModuleType,
  GameSpeed,
  type Building,
  type GameState,
  type ModuleState,
  type Notification,
  type GameEvent,
  type FarmGameState,
  type CropPlot,
  type AnimalPen,
  type ProcessingQueue,
  type ProcessingSlot,
  type CropType,
  type FarmItemType,
} from "./types";
import { BUILDINGS } from "@/game/data/buildings";
import { ANIMALS } from "@/game/data/animals";
import { CROPS } from "@/game/data/crops";
import { ITEMS } from "@/game/data/items";
import { RECIPES } from "@/game/data/recipes";
import { formatDate } from "@/game/engine/GameClock";
import { simulateTick } from "@/game/engine/SimulationEngine";
import { checkForEvents, resolveEvent as resolveEventEngine } from "@/game/engine/EventEngine";
import { calculateUpgradeCost, calculateXpRequired } from "./actions";
import * as ProgressionSystem from "@/game/systems/ProgressionSystem";
import * as InventorySystem from "@/game/systems/InventorySystem";
import * as CropSystem from "@/game/systems/CropSystem";
import * as AnimalSystem from "@/game/systems/AnimalSystem";
import * as ProcessingSystem from "@/game/systems/ProcessingSystem";
import * as OrderSystem from "@/game/systems/OrderSystem";

function createDefaultModule(unlocked: boolean): ModuleState {
  return {
    buildings: [],
    metrics: {},
    level: 1,
    unlocked,
  };
}

function createEmptyProcessingSlot(): ProcessingSlot {
  return {
    recipeId: undefined,
    startedAtTick: 0,
    duration: 0,
    output: undefined,
    outputQuantity: 0,
    ready: false,
  };
}

function createInitialFarmState(): FarmGameState {
  return {
    plots: [],
    animalPens: [],
    processingQueues: [],
    inventory: {},
    storageCapacity: 50,
    orders: [],
    totalHarvests: 0,
    totalOrdersFilled: 0,
    totalItemsProcessed: 0,
  };
}

function createInitialState(): GameState {
  return {
    tick: 0,
    date: formatDate(0),
    speed: GameSpeed.NORMAL,
    population: 1000,
    satisfactionScore: 75,
    cityName: "New SmartCity",
    modules: {
      [ModuleType.TRAFFIC]: createDefaultModule(true),
      [ModuleType.ENERGY]: createDefaultModule(true),
      [ModuleType.SECURITY]: createDefaultModule(true),
      [ModuleType.WASTE]: createDefaultModule(true),
      [ModuleType.FARM]: createDefaultModule(true),
    },
    economy: {
      credits: 10000,
      income: 0,
      expenses: 0,
      loans: [],
      creditHistory: [10000],
    },
    progression: {
      level: 1,
      xp: 0,
      xpToNextLevel: calculateXpRequired(1),
      totalXp: 0,
      unlockedBuildings: ProgressionSystem.getUnlocksForLevel(1),
      prestige: 0,
    },
    tutorial: {
      completed: false,
      step: 0,
    },
    activeEvents: [],
    missions: [],
    notifications: [],
    selectedModule: null,
    selectedBuilding: null,
    farmState: createInitialFarmState(),
  };
}

const PROCESSING_BUILDING_MAP: Record<string, true> = {
  [BuildingType.MILL]: true,
  [BuildingType.BAKERY]: true,
  [BuildingType.DAIRY]: true,
};

function getAnimalTypeForBuilding(type: BuildingType): "chicken" | "cow" | "bee" | null {
  if (type === BuildingType.CHICKEN_COOP) return "chicken";
  if (type === BuildingType.COW_PASTURE) return "cow";
  if (type === BuildingType.BEE_HIVE) return "bee";
  return null;
}

let buildingIdCounter = 0;

export interface GameActions {
  doTick: () => void;
  setSpeed: (speed: GameSpeed) => void;
  addBuilding: (type: BuildingType, position: { x: number; y: number }) => boolean;
  upgradeBuilding: (buildingId: string) => boolean;
  removeBuilding: (buildingId: string) => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  takeLoan: (amount: number, interestRate: number, durationTicks: number) => void;
  repayLoan: (index: number) => boolean;
  addXp: (amount: number) => void;
  triggerEvent: (event: GameEvent) => void;
  resolveEvent: (eventId: string, choiceId: string) => void;
  completeObjective: (missionId: string, objectiveIndex: number) => void;
  addNotification: (message: string, type: Notification["type"]) => void;
  dismissNotification: (id: string) => void;
  selectModule: (module: ModuleType | null) => void;
  selectBuilding: (buildingId: string | null) => void;
  nextTutorialStep: () => void;
  completeTutorial: () => void;
  saveState: () => string;
  loadState: (serialized: string) => void;
  plantCrop: (buildingId: string, cropType: CropType) => boolean;
  harvestCrop: (buildingId: string) => boolean;
  sellItem: (itemType: FarmItemType, qty: number) => boolean;
  collectAnimalProduct: (buildingId: string) => boolean;
  startProcessing: (buildingId: string, recipeId: string) => boolean;
  collectProcessed: (buildingId: string, slotIndex: number) => boolean;
  fillOrder: (orderId: string) => boolean;
}

export type GameStore = GameState & GameActions;

function extractGameState(store: GameStore): GameState {
  return {
    tick: store.tick,
    date: store.date,
    speed: store.speed,
    population: store.population,
    satisfactionScore: store.satisfactionScore,
    cityName: store.cityName,
    modules: store.modules,
    economy: store.economy,
    progression: store.progression,
    activeEvents: store.activeEvents,
    missions: store.missions,
    tutorial: store.tutorial,
    notifications: store.notifications,
    selectedModule: store.selectedModule,
    selectedBuilding: store.selectedBuilding,
    farmState: store.farmState,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  doTick: () => {
    const store = get();
    if (store.speed === GameSpeed.PAUSED) return;
    if (!store.tutorial.completed) return;

    const state = extractGameState(store);
    const updates = simulateTick(state);
    const newTick = updates.tick ?? state.tick;
    const updatedState: GameState = { ...state, ...updates };
    const newEvents = checkForEvents(updatedState, newTick);

    const eventNotifications: Notification[] = newEvents.map((e) => ({
      id: `notif_${e.id}`,
      message: `[${e.severity.toUpperCase()}] ${e.title}: ${e.description}`,
      type: (e.severity === "critical" ? "error" : e.severity === "high" ? "warning" : "info") as Notification["type"],
      tick: newTick,
      read: false,
    }));

    set({
      tick: updates.tick,
      date: updates.date,
      modules: updates.modules,
      economy: updates.economy,
      population: updates.population,
      satisfactionScore: updates.satisfactionScore,
      activeEvents: [...(updates.activeEvents ?? state.activeEvents), ...newEvents],
      notifications: [
        ...(updates.notifications ?? state.notifications),
        ...eventNotifications,
      ],
      farmState: updates.farmState ?? state.farmState,
    });
  },

  setSpeed: (speed) => set({ speed }),

  addBuilding: (type, position) => {
    const store = get();
    const def = BUILDINGS[type];
    if (!def) return false;
    if (store.economy.credits < def.baseCost) return false;
    if (!store.progression.unlockedBuildings.includes(type)) return false;

    const occupied = Object.values(store.modules).some((m: ModuleState) =>
      m.buildings.some((b) => b.position.x === position.x && b.position.y === position.y),
    );
    if (occupied) return false;

    buildingIdCounter += 1;
    const building: Building = {
      id: `bld_${buildingIdCounter}_${Date.now()}`,
      type,
      moduleType: def.module,
      name: def.name,
      level: 1,
      position,
      operatingCost: def.baseOperatingCost,
      revenue: def.baseRevenue,
      condition: 100,
      built_at_tick: store.tick,
    };

    const moduleState = store.modules[def.module];
    const newModules = {
      ...store.modules,
      [def.module]: {
        ...moduleState,
        buildings: [...moduleState.buildings, building],
      },
    };

    // Create farm entities for new farm buildings
    let farmState = { ...store.farmState };

    if (type === BuildingType.FIELD) {
      const newPlot: CropPlot = {
        buildingId: building.id,
        cropType: undefined,
        plantedAtTick: 0,
        growthDuration: 0,
        stage: "empty",
        quantity: 0,
      };
      farmState = { ...farmState, plots: [...farmState.plots, newPlot] };
    }

    const animalType = getAnimalTypeForBuilding(type);
    if (animalType) {
      const animalDef = ANIMALS[animalType];
      const newPen: AnimalPen = {
        buildingId: building.id,
        animalType,
        lastProducedTick: store.tick,
        productionInterval: animalDef.productionInterval,
        readyToCollect: false,
        productType: animalDef.productType,
        quantity: animalDef.quantity,
      };
      farmState = { ...farmState, animalPens: [...farmState.animalPens, newPen] };
    }

    if (PROCESSING_BUILDING_MAP[type]) {
      const newQueue: ProcessingQueue = {
        buildingId: building.id,
        slots: [createEmptyProcessingSlot(), createEmptyProcessingSlot()],
      };
      farmState = { ...farmState, processingQueues: [...farmState.processingQueues, newQueue] };
    }

    set({
      modules: newModules,
      economy: {
        ...store.economy,
        credits: store.economy.credits - def.baseCost,
      },
      farmState,
    });
    return true;
  },

  upgradeBuilding: (buildingId) => {
    const store = get();
    for (const moduleType of Object.values(ModuleType)) {
      const moduleState = store.modules[moduleType];
      const bIdx = moduleState.buildings.findIndex((b) => b.id === buildingId);
      if (bIdx === -1) continue;

      const building = moduleState.buildings[bIdx];
      const def = BUILDINGS[building.type];
      const cost = calculateUpgradeCost(def.baseCost, building.level);
      if (store.economy.credits < cost) return false;

      const upgraded: Building = {
        ...building,
        level: building.level + 1,
        revenue: Math.floor(def.baseRevenue * Math.pow(1.1, building.level)),
        operatingCost: Math.floor(def.baseOperatingCost * Math.pow(1.05, building.level)),
        condition: 100,
      };

      const newBuildings = [...moduleState.buildings];
      newBuildings[bIdx] = upgraded;

      set({
        modules: {
          ...store.modules,
          [moduleType]: { ...moduleState, buildings: newBuildings },
        },
        economy: {
          ...store.economy,
          credits: store.economy.credits - cost,
        },
      });
      return true;
    }
    return false;
  },

  removeBuilding: (buildingId) => {
    const store = get();
    for (const moduleType of Object.values(ModuleType)) {
      const moduleState = store.modules[moduleType];
      const filtered = moduleState.buildings.filter((b) => b.id !== buildingId);
      if (filtered.length < moduleState.buildings.length) {
        // Cleanup farm entities
        const farmState = {
          ...store.farmState,
          plots: store.farmState.plots.filter((p) => p.buildingId !== buildingId),
          animalPens: store.farmState.animalPens.filter((p) => p.buildingId !== buildingId),
          processingQueues: store.farmState.processingQueues.filter((q) => q.buildingId !== buildingId),
        };

        set({
          modules: {
            ...store.modules,
            [moduleType]: { ...moduleState, buildings: filtered },
          },
          farmState,
        });
        return;
      }
    }
  },

  addCredits: (amount) => {
    set((s) => ({
      economy: { ...s.economy, credits: s.economy.credits + amount },
    }));
  },

  spendCredits: (amount) => {
    const store = get();
    if (store.economy.credits < amount) return false;
    set({
      economy: { ...store.economy, credits: store.economy.credits - amount },
    });
    return true;
  },

  takeLoan: (amount, interestRate, durationTicks) => {
    set((s) => ({
      economy: {
        ...s.economy,
        credits: s.economy.credits + amount,
        loans: [...s.economy.loans, { amount, interestRate, remainingTicks: durationTicks }],
      },
    }));
  },

  repayLoan: (index) => {
    const store = get();
    const loan = store.economy.loans[index];
    if (!loan) return false;
    if (store.economy.credits < loan.amount) return false;
    set({
      economy: {
        ...store.economy,
        credits: store.economy.credits - loan.amount,
        loans: store.economy.loans.filter((_, i) => i !== index),
      },
    });
    return true;
  },

  addXp: (amount) => {
    const store = get();
    const updated = ProgressionSystem.addXp(store.progression, amount);
    set({ progression: updated });
  },

  triggerEvent: (event) => {
    set((s) => ({ activeEvents: [...s.activeEvents, event] }));
  },

  resolveEvent: (eventId, choiceId) => {
    const store = get();
    const state = extractGameState(store);
    const updates = resolveEventEngine(state, eventId, choiceId);
    set({
      ...(updates.economy ? { economy: updates.economy } : {}),
      ...(updates.satisfactionScore !== undefined ? { satisfactionScore: updates.satisfactionScore } : {}),
      ...(updates.population !== undefined ? { population: updates.population } : {}),
      ...(updates.activeEvents ? { activeEvents: updates.activeEvents } : {}),
      ...(updates.notifications ? { notifications: updates.notifications } : {}),
    });
  },

  completeObjective: (missionId, objectiveIndex) => {
    set((s) => ({
      missions: s.missions.map((m) => {
        if (m.id !== missionId) return m;
        const objectives = m.objectives.map((o, i) =>
          i === objectiveIndex ? { ...o, current: o.target, completed: true } : o,
        );
        const completed = objectives.every((o) => o.completed);
        return { ...m, objectives, completed };
      }),
    }));
  },

  addNotification: (message, type) => {
    set((s) => ({
      notifications: [
        ...s.notifications,
        {
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          message,
          type,
          tick: s.tick,
          read: false,
        },
      ],
    }));
  },

  dismissNotification: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  },

  selectModule: (module) => set({ selectedModule: module }),
  selectBuilding: (buildingId) => set({ selectedBuilding: buildingId }),

  nextTutorialStep: () => {
    set((s) => ({
      tutorial: { ...s.tutorial, step: s.tutorial.step + 1 },
    }));
  },

  completeTutorial: () => {
    const store = get();
    const starterBuildings: { type: BuildingType; pos: { x: number; y: number } }[] = [
      { type: BuildingType.SOLAR_PANEL, pos: { x: 9, y: 7 } },
      { type: BuildingType.SOLAR_PANEL, pos: { x: 10, y: 7 } },
      { type: BuildingType.SOLAR_PANEL, pos: { x: 11, y: 7 } },
      { type: BuildingType.SOLAR_PANEL, pos: { x: 12, y: 7 } },
      { type: BuildingType.ROAD, pos: { x: 8, y: 9 } },
      { type: BuildingType.ROAD, pos: { x: 9, y: 9 } },
      { type: BuildingType.ROAD, pos: { x: 10, y: 9 } },
      { type: BuildingType.CCTV_CAMERA, pos: { x: 13, y: 10 } },
      { type: BuildingType.CCTV_CAMERA, pos: { x: 14, y: 10 } },
      { type: BuildingType.CCTV_CAMERA, pos: { x: 13, y: 11 } },
      { type: BuildingType.TRASH_BIN_NETWORK, pos: { x: 7, y: 11 } },
      { type: BuildingType.TRASH_BIN_NETWORK, pos: { x: 8, y: 11 } },
      { type: BuildingType.TRASH_BIN_NETWORK, pos: { x: 7, y: 12 } },
      { type: BuildingType.TRASH_BIN_NETWORK, pos: { x: 8, y: 12 } },
      // Farm starter: 2 fields instead of community gardens
      { type: BuildingType.FIELD, pos: { x: 10, y: 11 } },
      { type: BuildingType.FIELD, pos: { x: 11, y: 11 } },
      { type: BuildingType.FIELD, pos: { x: 10, y: 12 } },
    ];

    let updatedModules = { ...store.modules };
    let farmState = { ...store.farmState };
    let totalCost = 0;

    for (const starter of starterBuildings) {
      const def = BUILDINGS[starter.type];
      const moduleState = updatedModules[def.module];

      // Skip if module already has buildings (except farm which gets fields)
      if (def.module !== ModuleType.FARM && moduleState.buildings.length > 0) continue;
      // For farm, skip only if we already placed fields at this position
      if (def.module === ModuleType.FARM) {
        const alreadyPlaced = moduleState.buildings.some(
          (b) => b.position.x === starter.pos.x && b.position.y === starter.pos.y,
        );
        if (alreadyPlaced) continue;
      }

      buildingIdCounter += 1;
      const building: Building = {
        id: `bld_${buildingIdCounter}_${Date.now()}`,
        type: starter.type,
        moduleType: def.module,
        name: def.name,
        level: 1,
        position: starter.pos,
        operatingCost: def.baseOperatingCost,
        revenue: def.baseRevenue,
        condition: 100,
        built_at_tick: store.tick,
      };

      updatedModules = {
        ...updatedModules,
        [def.module]: {
          ...updatedModules[def.module],
          buildings: [...updatedModules[def.module].buildings, building],
        },
      };

      // Create farm entities for starter farm buildings
      if (starter.type === BuildingType.FIELD) {
        farmState = {
          ...farmState,
          plots: [
            ...farmState.plots,
            {
              buildingId: building.id,
              cropType: undefined,
              plantedAtTick: 0,
              growthDuration: 0,
              stage: "empty",
              quantity: 0,
            },
          ],
        };
      }

      totalCost += def.baseCost;
    }

    set({
      tutorial: { completed: true, step: -1 },
      modules: updatedModules,
      economy: {
        ...store.economy,
        credits: store.economy.credits - totalCost,
      },
      farmState,
      notifications: [],
    });
  },

  // -- Farm actions --

  plantCrop: (buildingId, cropType) => {
    const store = get();
    const plotIndex = store.farmState.plots.findIndex((p) => p.buildingId === buildingId);
    if (plotIndex === -1) return false;
    const plot = store.farmState.plots[plotIndex];
    if (plot.stage !== "empty") return false;

    const cropDef = CROPS[cropType];
    if (!cropDef) return false;
    if (store.progression.level < cropDef.requiredLevel) return false;

    const updatedPlot = CropSystem.plantCrop(plot, cropType, store.tick);
    const newPlots = [...store.farmState.plots];
    newPlots[plotIndex] = updatedPlot;

    set({ farmState: { ...store.farmState, plots: newPlots } });
    return true;
  },

  harvestCrop: (buildingId) => {
    const store = get();
    const plotIndex = store.farmState.plots.findIndex((p) => p.buildingId === buildingId);
    if (plotIndex === -1) return false;
    const plot = store.farmState.plots[plotIndex];
    const result = CropSystem.harvestCrop(plot);
    if (!result) return false;

    if (InventorySystem.isFull(store.farmState.inventory, store.farmState.storageCapacity)) return false;

    const newPlots = [...store.farmState.plots];
    newPlots[plotIndex] = result.updatedPlot;
    const newInventory = InventorySystem.addItem(store.farmState.inventory, result.itemType, result.quantity);

    const cropDef = result.itemType in CROPS ? CROPS[result.itemType as CropType] : null;
    const xpReward = cropDef?.xpReward ?? 2;

    const newProgression = ProgressionSystem.addXp(store.progression, xpReward);

    set({
      farmState: {
        ...store.farmState,
        plots: newPlots,
        inventory: newInventory,
        totalHarvests: store.farmState.totalHarvests + 1,
      },
      progression: newProgression,
    });

    // Check milestones
    if (store.farmState.totalHarvests === 0) {
      set((s) => ({
        economy: { ...s.economy, credits: s.economy.credits + 500 },
        notifications: [
          ...s.notifications,
          {
            id: `milestone_first_harvest_${s.tick}`,
            message: "First harvest! +500 credits",
            type: "success",
            tick: s.tick,
            read: false,
          },
        ],
      }));
    }

    return true;
  },

  sellItem: (itemType, qty) => {
    const store = get();
    const available = store.farmState.inventory[itemType] ?? 0;
    if (available < qty) return false;
    const itemDef = ITEMS[itemType];
    if (!itemDef) return false;

    const totalPrice = itemDef.sellPrice * qty;
    const newInventory = InventorySystem.removeItem(store.farmState.inventory, itemType, qty);
    const newProgression = ProgressionSystem.addXp(store.progression, itemDef.xpOnSell * qty);

    set({
      farmState: { ...store.farmState, inventory: newInventory },
      economy: { ...store.economy, credits: store.economy.credits + totalPrice },
      progression: newProgression,
    });
    return true;
  },

  collectAnimalProduct: (buildingId) => {
    const store = get();
    const penIndex = store.farmState.animalPens.findIndex((p) => p.buildingId === buildingId);
    if (penIndex === -1) return false;
    const pen = store.farmState.animalPens[penIndex];
    const result = AnimalSystem.collectProduct(pen, store.tick);
    if (!result) return false;

    if (InventorySystem.isFull(store.farmState.inventory, store.farmState.storageCapacity)) return false;

    const newPens = [...store.farmState.animalPens];
    newPens[penIndex] = result.updatedPen;
    const newInventory = InventorySystem.addItem(store.farmState.inventory, result.productType, result.quantity);
    const newProgression = ProgressionSystem.addXp(store.progression, 4);

    set({
      farmState: { ...store.farmState, animalPens: newPens, inventory: newInventory },
      progression: newProgression,
    });
    return true;
  },

  startProcessing: (buildingId, recipeId) => {
    const store = get();
    const queueIndex = store.farmState.processingQueues.findIndex((q) => q.buildingId === buildingId);
    if (queueIndex === -1) return false;
    const queue = store.farmState.processingQueues[queueIndex];
    const recipe = RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return false;

    // Validate building type matches recipe
    const building = Object.values(store.modules)
      .flatMap((m) => m.buildings)
      .find((b) => b.id === buildingId);
    if (!building || building.type !== recipe.buildingType) return false;

    const result = ProcessingSystem.startRecipe(queue, recipe, store.farmState.inventory, store.tick);
    if (!result) return false;

    const newQueues = [...store.farmState.processingQueues];
    newQueues[queueIndex] = result.updatedQueue;

    set({
      farmState: {
        ...store.farmState,
        processingQueues: newQueues,
        inventory: result.updatedInventory,
      },
    });
    return true;
  },

  collectProcessed: (buildingId, slotIndex) => {
    const store = get();
    const queueIndex = store.farmState.processingQueues.findIndex((q) => q.buildingId === buildingId);
    if (queueIndex === -1) return false;
    const queue = store.farmState.processingQueues[queueIndex];
    const result = ProcessingSystem.collectOutput(queue, slotIndex);
    if (!result) return false;

    if (InventorySystem.isFull(store.farmState.inventory, store.farmState.storageCapacity)) return false;

    const newQueues = [...store.farmState.processingQueues];
    newQueues[queueIndex] = result.updatedQueue;
    const newInventory = InventorySystem.addItem(store.farmState.inventory, result.output, result.quantity);
    const newProgression = ProgressionSystem.addXp(store.progression, 7);

    const totalProcessed = store.farmState.totalItemsProcessed + 1;

    set({
      farmState: {
        ...store.farmState,
        processingQueues: newQueues,
        inventory: newInventory,
        totalItemsProcessed: totalProcessed,
      },
      progression: newProgression,
    });

    // First processed item milestone
    if (store.farmState.totalItemsProcessed === 0) {
      set((s) => ({
        economy: { ...s.economy, credits: s.economy.credits + 800 },
        notifications: [
          ...s.notifications,
          {
            id: `milestone_first_processed_${s.tick}`,
            message: "First processed item! +800 credits",
            type: "success",
            tick: s.tick,
            read: false,
          },
        ],
      }));
    }

    return true;
  },

  fillOrder: (orderId) => {
    const store = get();
    const order = store.farmState.orders.find((o) => o.id === orderId);
    if (!order) return false;

    const result = OrderSystem.fillOrder(order, store.farmState.inventory);
    if (!result) return false;

    const newOrders = store.farmState.orders.filter((o) => o.id !== orderId);
    const totalFilled = store.farmState.totalOrdersFilled + 1;
    const newProgression = ProgressionSystem.addXp(store.progression, result.xp);

    set({
      farmState: {
        ...store.farmState,
        orders: newOrders,
        inventory: result.updatedInventory,
        totalOrdersFilled: totalFilled,
      },
      economy: {
        ...store.economy,
        credits: store.economy.credits + result.credits,
      },
      progression: newProgression,
    });

    // First order filled milestone
    if (store.farmState.totalOrdersFilled === 0) {
      set((s) => ({
        economy: { ...s.economy, credits: s.economy.credits + 1000 },
        notifications: [
          ...s.notifications,
          {
            id: `milestone_first_order_${s.tick}`,
            message: "First order filled! +1000 credits",
            type: "success",
            tick: s.tick,
            read: false,
          },
        ],
      }));
    }

    // 10 orders milestone: unlock extra processing slot
    if (totalFilled === 10) {
      set((s) => ({
        farmState: {
          ...s.farmState,
          processingQueues: s.farmState.processingQueues.map((q) => ({
            ...q,
            slots: [...q.slots, createEmptyProcessingSlot()],
          })),
        },
        notifications: [
          ...s.notifications,
          {
            id: `milestone_10_orders_${s.tick}`,
            message: "10 orders filled! Extra processing slot unlocked.",
            type: "success",
            tick: s.tick,
            read: false,
          },
        ],
      }));
    }

    // 50 harvests milestone: +25 storage
    if (store.farmState.totalHarvests >= 50 && store.farmState.storageCapacity === 50) {
      set((s) => ({
        farmState: { ...s.farmState, storageCapacity: 75 },
        notifications: [
          ...s.notifications,
          {
            id: `milestone_50_harvests_${s.tick}`,
            message: "50 harvests! Storage capacity increased to 75.",
            type: "success",
            tick: s.tick,
            read: false,
          },
        ],
      }));
    }

    return true;
  },

  saveState: () => {
    const store = get();
    const state = extractGameState(store);
    return JSON.stringify(state);
  },

  loadState: (serialized) => {
    try {
      const parsed = JSON.parse(serialized) as Partial<GameState>;
      // Ensure farmState exists for backward compatibility
      if (!parsed.farmState) {
        parsed.farmState = createInitialFarmState();
      }
      set(parsed);
    } catch {
      // Silently fail on invalid data
    }
  },
}));
