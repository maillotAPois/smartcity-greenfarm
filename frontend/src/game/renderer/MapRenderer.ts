import { BuildingType, ModuleType } from "@/game/state/types";
import { BUILDINGS } from "@/game/data/buildings";

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

export function gridToIso(x: number, y: number): { screenX: number; screenY: number } {
  const screenX = (x - y) * (TILE_WIDTH / 2);
  const screenY = (x + y) * (TILE_HEIGHT / 2);
  return { screenX, screenY };
}

export function isoToGrid(screenX: number, screenY: number): { x: number; y: number } {
  const x = Math.floor((screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2);
  const y = Math.floor((screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2);
  return { x, y };
}

const MODULE_COLORS: Record<ModuleType, number> = {
  [ModuleType.TRAFFIC]: 0x607d8b,
  [ModuleType.ENERGY]: 0xffc107,
  [ModuleType.SECURITY]: 0x2196f3,
  [ModuleType.WASTE]: 0x795548,
  [ModuleType.FARM]: 0x4caf50,
};

const FARM_BUILDING_COLORS: Partial<Record<BuildingType, number>> = {
  [BuildingType.FIELD]: 0x8b6914,
  [BuildingType.CHICKEN_COOP]: 0xd4a017,
  [BuildingType.COW_PASTURE]: 0x6b8e23,
  [BuildingType.BEE_HIVE]: 0xdaa520,
  [BuildingType.MILL]: 0xb8860b,
  [BuildingType.BAKERY]: 0xcd853f,
  [BuildingType.DAIRY]: 0x87ceeb,
};

export function getColorForBuilding(type: BuildingType): number {
  if (FARM_BUILDING_COLORS[type] !== undefined) {
    return FARM_BUILDING_COLORS[type]!;
  }
  const def = BUILDINGS[type];
  if (!def) return 0x999999;
  return MODULE_COLORS[def.module];
}

export function getTileColor(): number {
  return 0x8bc34a;
}

export function getHighlightColor(): number {
  return 0xffeb3b;
}

export function isFarmBuilding(type: BuildingType): boolean {
  return type === BuildingType.FIELD
    || type === BuildingType.CHICKEN_COOP
    || type === BuildingType.COW_PASTURE
    || type === BuildingType.BEE_HIVE
    || type === BuildingType.MILL
    || type === BuildingType.BAKERY
    || type === BuildingType.DAIRY;
}

export function isAnimalBuilding(type: BuildingType): boolean {
  return type === BuildingType.CHICKEN_COOP
    || type === BuildingType.COW_PASTURE
    || type === BuildingType.BEE_HIVE;
}

export function isProcessingBuilding(type: BuildingType): boolean {
  return type === BuildingType.MILL
    || type === BuildingType.BAKERY
    || type === BuildingType.DAIRY;
}
