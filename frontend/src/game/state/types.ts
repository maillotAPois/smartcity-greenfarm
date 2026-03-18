export enum BuildingType {
  ROAD = "ROAD",
  SMART_TRAFFIC_LIGHT = "SMART_TRAFFIC_LIGHT",
  BUS_STATION = "BUS_STATION",
  METRO_LINE = "METRO_LINE",
  HIGHWAY_INTERCHANGE = "HIGHWAY_INTERCHANGE",
  SOLAR_PANEL = "SOLAR_PANEL",
  WIND_TURBINE = "WIND_TURBINE",
  BATTERY_STORAGE = "BATTERY_STORAGE",
  SMART_GRID_HUB = "SMART_GRID_HUB",
  NUCLEAR_PLANT = "NUCLEAR_PLANT",
  CCTV_CAMERA = "CCTV_CAMERA",
  POLICE_STATION = "POLICE_STATION",
  FIRE_STATION = "FIRE_STATION",
  DISPATCH_CENTER = "DISPATCH_CENTER",
  DRONE_HUB = "DRONE_HUB",
  TRASH_BIN_NETWORK = "TRASH_BIN_NETWORK",
  RECYCLING_CENTER = "RECYCLING_CENTER",
  COMPOSTING_FACILITY = "COMPOSTING_FACILITY",
  WASTE_TO_ENERGY = "WASTE_TO_ENERGY",
  SMART_BIN = "SMART_BIN",
  COMMUNITY_GARDEN = "COMMUNITY_GARDEN",
  GREENHOUSE = "GREENHOUSE",
  VERTICAL_FARM = "VERTICAL_FARM",
  HYDROPONICS_LAB = "HYDROPONICS_LAB",
  AQUAPONICS_CENTER = "AQUAPONICS_CENTER",
  FIELD = "FIELD",
  CHICKEN_COOP = "CHICKEN_COOP",
  COW_PASTURE = "COW_PASTURE",
  BEE_HIVE = "BEE_HIVE",
  MILL = "MILL",
  BAKERY = "BAKERY",
  DAIRY = "DAIRY",
}

export enum ModuleType {
  TRAFFIC = "TRAFFIC",
  ENERGY = "ENERGY",
  SECURITY = "SECURITY",
  WASTE = "WASTE",
  FARM = "FARM",
}

export enum GameSpeed {
  PAUSED = 0,
  NORMAL = 1,
  FAST = 2,
  ULTRA = 5,
}

export interface Position {
  x: number;
  y: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  moduleType: ModuleType;
  name: string;
  level: number;
  position: Position;
  operatingCost: number;
  revenue: number;
  condition: number;
  built_at_tick: number;
}

export interface ModuleState {
  buildings: Building[];
  metrics: Record<string, number>;
  level: number;
  unlocked: boolean;
}

export interface Loan {
  amount: number;
  interestRate: number;
  remainingTicks: number;
}

export interface EconomyState {
  credits: number;
  income: number;
  expenses: number;
  loans: Loan[];
  creditHistory: number[];
}

export interface ProgressionState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  unlockedBuildings: BuildingType[];
  prestige: number;
}

export interface EventChoice {
  id: string;
  label: string;
  effect: Record<string, number>;
}

export interface GameEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedModules: ModuleType[];
  choices: EventChoice[];
  duration: number;
  tick: number;
}

export interface MissionObjective {
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface MissionReward {
  xp: number;
  credits: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: MissionObjective[];
  reward: MissionReward;
  completed: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  tick: number;
  read: boolean;
}

export interface TutorialState {
  completed: boolean;
  step: number;
}

export type FarmItemType =
  | "wheat" | "corn" | "tomato" | "strawberry" | "lettuce" | "herbs" | "sunflower" | "carrot"
  | "egg" | "milk" | "honey"
  | "flour" | "feed" | "bread" | "cake" | "cheese" | "ice_cream" | "pastry" | "sugar";

export type CropType = "wheat" | "corn" | "tomato" | "strawberry" | "lettuce" | "herbs" | "sunflower" | "carrot";
export type AnimalType = "chicken" | "cow" | "bee";
export type CropStage = "empty" | "growing" | "ready";

export interface CropPlot {
  buildingId: string;
  cropType?: CropType;
  plantedAtTick: number;
  growthDuration: number;
  stage: CropStage;
  quantity: number;
}

export interface AnimalPen {
  buildingId: string;
  animalType: AnimalType;
  lastProducedTick: number;
  productionInterval: number;
  readyToCollect: boolean;
  productType: FarmItemType;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  inputs: Partial<Record<FarmItemType, number>>;
  output: FarmItemType;
  outputQuantity: number;
  duration: number;
  buildingType: BuildingType;
}

export interface ProcessingSlot {
  recipeId?: string;
  startedAtTick: number;
  duration: number;
  output?: FarmItemType;
  outputQuantity: number;
  ready: boolean;
}

export interface ProcessingQueue {
  buildingId: string;
  slots: ProcessingSlot[];
}

export type Inventory = Record<string, number>;

export interface Order {
  id: string;
  items: Partial<Record<FarmItemType, number>>;
  rewardCredits: number;
  rewardXp: number;
  createdAtTick: number;
  expiresAtTick: number;
}

export interface FarmGameState {
  plots: CropPlot[];
  animalPens: AnimalPen[];
  processingQueues: ProcessingQueue[];
  inventory: Inventory;
  storageCapacity: number;
  orders: Order[];
  totalHarvests: number;
  totalOrdersFilled: number;
  totalItemsProcessed: number;
}

export interface GameState {
  tick: number;
  date: string;
  speed: GameSpeed;
  population: number;
  satisfactionScore: number;
  cityName: string;
  modules: Record<ModuleType, ModuleState>;
  economy: EconomyState;
  progression: ProgressionState;
  tutorial: TutorialState;
  activeEvents: GameEvent[];
  missions: Mission[];
  notifications: Notification[];
  selectedModule: ModuleType | null;
  selectedBuilding: string | null;
  farmState: FarmGameState;
}
