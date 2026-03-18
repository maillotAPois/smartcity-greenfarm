import { BuildingType, type ProgressionState } from "@/game/state/types";

export function calculateXpRequired(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level));
}

export function addXp(
  progression: ProgressionState,
  amount: number,
): ProgressionState {
  let updated = {
    ...progression,
    xp: progression.xp + amount,
    totalXp: progression.totalXp + amount,
  };
  updated = checkLevelUp(updated);
  return updated;
}

export function checkLevelUp(progression: ProgressionState): ProgressionState {
  let current = { ...progression };
  while (current.xp >= current.xpToNextLevel) {
    current = {
      ...current,
      xp: current.xp - current.xpToNextLevel,
      level: current.level + 1,
      xpToNextLevel: calculateXpRequired(current.level + 1),
      unlockedBuildings: [
        ...current.unlockedBuildings,
        ...getUnlocksForLevel(current.level + 1),
      ],
    };
  }
  return current;
}

export function getUnlocksForLevel(level: number): BuildingType[] {
  const unlockMap: Record<number, BuildingType[]> = {
    1: [
      BuildingType.FIELD,
      BuildingType.ROAD,
      BuildingType.SOLAR_PANEL,
      BuildingType.CCTV_CAMERA,
      BuildingType.TRASH_BIN_NETWORK,
      BuildingType.COMMUNITY_GARDEN,
    ],
    2: [
      BuildingType.CHICKEN_COOP,
      BuildingType.SMART_TRAFFIC_LIGHT,
      BuildingType.WIND_TURBINE,
      BuildingType.SMART_BIN,
    ],
    3: [
      BuildingType.MILL,
      BuildingType.GREENHOUSE,
      BuildingType.BUS_STATION,
      BuildingType.POLICE_STATION,
      BuildingType.FIRE_STATION,
      BuildingType.RECYCLING_CENTER,
    ],
    4: [
      BuildingType.COW_PASTURE,
      BuildingType.BATTERY_STORAGE,
      BuildingType.COMPOSTING_FACILITY,
    ],
    5: [
      BuildingType.BEE_HIVE,
      BuildingType.BAKERY,
      BuildingType.HYDROPONICS_LAB,
    ],
    6: [
      BuildingType.DAIRY,
      BuildingType.DISPATCH_CENTER,
    ],
    7: [BuildingType.SMART_GRID_HUB, BuildingType.VERTICAL_FARM],
    8: [BuildingType.METRO_LINE],
    9: [BuildingType.AQUAPONICS_CENTER],
    10: [BuildingType.DRONE_HUB, BuildingType.WASTE_TO_ENERGY],
    12: [BuildingType.HIGHWAY_INTERCHANGE],
    15: [BuildingType.NUCLEAR_PLANT],
  };
  return unlockMap[level] ?? [];
}

export interface MilestoneReward {
  credits: number;
  xp: number;
  message: string;
}

export function checkMilestone(level: number): MilestoneReward | null {
  const milestones: Record<number, MilestoneReward> = {
    5: { credits: 2000, xp: 200, message: "Village milestone reached." },
    10: { credits: 5000, xp: 500, message: "Town milestone reached." },
    15: { credits: 10000, xp: 1000, message: "City milestone reached." },
    20: { credits: 25000, xp: 2500, message: "Metropolis milestone reached." },
    25: { credits: 50000, xp: 5000, message: "Megacity milestone reached." },
  };
  return milestones[level] ?? null;
}
