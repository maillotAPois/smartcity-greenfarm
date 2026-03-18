import { BuildingType } from "@/game/state/types";

export interface UpgradeEffect {
  revenueMultiplier?: number;
  costReduction?: number;
  conditionBonus?: number;
  capacityBonus?: number;
}

export interface UpgradeDefinition {
  name: string;
  description: string;
  baseCost: number;
  maxLevel: number;
  effect: UpgradeEffect;
}

export const UPGRADES: Record<BuildingType, UpgradeDefinition[]> = {
  [BuildingType.ROAD]: [
    {
      name: "Asphalt Quality",
      description: "Better materials reduce maintenance needs.",
      baseCost: 50,
      maxLevel: 5,
      effect: { costReduction: 0.1, conditionBonus: 5 },
    },
  ],
  [BuildingType.SMART_TRAFFIC_LIGHT]: [
    {
      name: "AI Optimization",
      description: "Improved algorithms for traffic flow.",
      baseCost: 150,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.2 },
    },
    {
      name: "Sensor Upgrade",
      description: "Enhanced detection range and accuracy.",
      baseCost: 200,
      maxLevel: 3,
      effect: { revenueMultiplier: 1.1, conditionBonus: 3 },
    },
  ],
  [BuildingType.BUS_STATION]: [
    {
      name: "Route Expansion",
      description: "Add more bus routes from this station.",
      baseCost: 250,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.25, capacityBonus: 20 },
    },
  ],
  [BuildingType.METRO_LINE]: [
    {
      name: "Line Extension",
      description: "Extend metro coverage to more areas.",
      baseCost: 2000,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.3, capacityBonus: 50 },
    },
  ],
  [BuildingType.HIGHWAY_INTERCHANGE]: [
    {
      name: "Lane Expansion",
      description: "Additional lanes for higher throughput.",
      baseCost: 3000,
      maxLevel: 3,
      effect: { revenueMultiplier: 1.2, capacityBonus: 30 },
    },
  ],
  [BuildingType.SOLAR_PANEL]: [
    {
      name: "Panel Efficiency",
      description: "Higher conversion efficiency cells.",
      baseCost: 100,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.15 },
    },
  ],
  [BuildingType.WIND_TURBINE]: [
    {
      name: "Blade Design",
      description: "Aerodynamic blade improvements.",
      baseCost: 200,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.2 },
    },
  ],
  [BuildingType.BATTERY_STORAGE]: [
    {
      name: "Capacity Upgrade",
      description: "Increase energy storage capacity.",
      baseCost: 400,
      maxLevel: 5,
      effect: { capacityBonus: 25, revenueMultiplier: 1.15 },
    },
  ],
  [BuildingType.SMART_GRID_HUB]: [
    {
      name: "Grid Intelligence",
      description: "Smarter load balancing algorithms.",
      baseCost: 1500,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.25, costReduction: 0.1 },
    },
  ],
  [BuildingType.NUCLEAR_PLANT]: [
    {
      name: "Reactor Upgrade",
      description: "Improved reactor core efficiency.",
      baseCost: 5000,
      maxLevel: 3,
      effect: { revenueMultiplier: 1.3 },
    },
  ],
  [BuildingType.CCTV_CAMERA]: [
    {
      name: "Night Vision",
      description: "Infrared capability for 24/7 coverage.",
      baseCost: 75,
      maxLevel: 3,
      effect: { revenueMultiplier: 1.2 },
    },
  ],
  [BuildingType.POLICE_STATION]: [
    {
      name: "Officer Training",
      description: "Enhanced training programs.",
      baseCost: 500,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.2, conditionBonus: 5 },
    },
  ],
  [BuildingType.FIRE_STATION]: [
    {
      name: "Equipment Upgrade",
      description: "Modern firefighting equipment.",
      baseCost: 600,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.2, conditionBonus: 5 },
    },
  ],
  [BuildingType.DISPATCH_CENTER]: [
    {
      name: "Communication Systems",
      description: "Faster dispatch coordination.",
      baseCost: 1200,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.3 },
    },
  ],
  [BuildingType.DRONE_HUB]: [
    {
      name: "Fleet Expansion",
      description: "More drones for wider coverage.",
      baseCost: 2000,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.25, capacityBonus: 10 },
    },
  ],
  [BuildingType.TRASH_BIN_NETWORK]: [
    {
      name: "Capacity Increase",
      description: "Larger bins and more frequent collection.",
      baseCost: 50,
      maxLevel: 5,
      effect: { capacityBonus: 15, costReduction: 0.05 },
    },
  ],
  [BuildingType.RECYCLING_CENTER]: [
    {
      name: "Sorting Technology",
      description: "Automated sorting machinery.",
      baseCost: 300,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.25 },
    },
  ],
  [BuildingType.COMPOSTING_FACILITY]: [
    {
      name: "Decomposition Accelerator",
      description: "Faster composting process.",
      baseCost: 200,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.2, capacityBonus: 20 },
    },
  ],
  [BuildingType.WASTE_TO_ENERGY]: [
    {
      name: "Conversion Efficiency",
      description: "Better waste-to-energy conversion ratio.",
      baseCost: 3000,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.3 },
    },
  ],
  [BuildingType.SMART_BIN]: [
    {
      name: "Sensor Upgrade",
      description: "More accurate fill-level detection.",
      baseCost: 120,
      maxLevel: 3,
      effect: { costReduction: 0.15, conditionBonus: 5 },
    },
  ],
  [BuildingType.COMMUNITY_GARDEN]: [
    {
      name: "Irrigation System",
      description: "Automated watering reduces labor.",
      baseCost: 100,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.15, costReduction: 0.1 },
    },
  ],
  [BuildingType.GREENHOUSE]: [
    {
      name: "Climate Control",
      description: "Precise temperature and humidity management.",
      baseCost: 250,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.2 },
    },
  ],
  [BuildingType.VERTICAL_FARM]: [
    {
      name: "Additional Floors",
      description: "Stack more growing layers.",
      baseCost: 1500,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.3, capacityBonus: 30 },
    },
  ],
  [BuildingType.HYDROPONICS_LAB]: [
    {
      name: "Nutrient Optimization",
      description: "Fine-tuned nutrient delivery systems.",
      baseCost: 1000,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.25 },
    },
  ],
  [BuildingType.AQUAPONICS_CENTER]: [
    {
      name: "Ecosystem Balance",
      description: "Optimized fish-plant symbiosis.",
      baseCost: 2000,
      maxLevel: 5,
      effect: { revenueMultiplier: 1.3, conditionBonus: 5 },
    },
  ],
  [BuildingType.FIELD]: [
    {
      name: "Fertile Soil",
      description: "Enriched soil for faster growth.",
      baseCost: 30,
      maxLevel: 5,
      effect: { conditionBonus: 5 },
    },
  ],
  [BuildingType.CHICKEN_COOP]: [
    {
      name: "Better Feed",
      description: "Higher quality feed for more eggs.",
      baseCost: 150,
      maxLevel: 5,
      effect: { capacityBonus: 1 },
    },
  ],
  [BuildingType.COW_PASTURE]: [
    {
      name: "Pasture Quality",
      description: "Better grazing for happier cows.",
      baseCost: 300,
      maxLevel: 5,
      effect: { capacityBonus: 1 },
    },
  ],
  [BuildingType.BEE_HIVE]: [
    {
      name: "Hive Expansion",
      description: "More bees, more honey.",
      baseCost: 250,
      maxLevel: 5,
      effect: { capacityBonus: 1 },
    },
  ],
  [BuildingType.MILL]: [
    {
      name: "Grinding Efficiency",
      description: "Faster milling process.",
      baseCost: 200,
      maxLevel: 5,
      effect: { costReduction: 0.1 },
    },
  ],
  [BuildingType.BAKERY]: [
    {
      name: "Oven Upgrade",
      description: "Industrial ovens for faster baking.",
      baseCost: 400,
      maxLevel: 5,
      effect: { costReduction: 0.1 },
    },
  ],
  [BuildingType.DAIRY]: [
    {
      name: "Cooling System",
      description: "Better refrigeration for dairy products.",
      baseCost: 350,
      maxLevel: 5,
      effect: { costReduction: 0.1 },
    },
  ],
};
