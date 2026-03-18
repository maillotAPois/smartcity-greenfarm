import type { CropType, FarmItemType } from "@/game/state/types";

export interface CropDefinition {
  name: string;
  cropType: CropType;
  growthTicks: number;
  yield: number;
  sellPrice: number;
  xpReward: number;
  requiredLevel: number;
  itemType: FarmItemType;
}

export const CROPS: Record<CropType, CropDefinition> = {
  lettuce: {
    name: "Lettuce",
    cropType: "lettuce",
    growthTicks: 20,
    yield: 2,
    sellPrice: 4,
    xpReward: 1,
    requiredLevel: 1,
    itemType: "lettuce",
  },
  herbs: {
    name: "Herbs",
    cropType: "herbs",
    growthTicks: 25,
    yield: 2,
    sellPrice: 6,
    xpReward: 2,
    requiredLevel: 2,
    itemType: "herbs",
  },
  wheat: {
    name: "Wheat",
    cropType: "wheat",
    growthTicks: 30,
    yield: 3,
    sellPrice: 5,
    xpReward: 2,
    requiredLevel: 1,
    itemType: "wheat",
  },
  corn: {
    name: "Corn",
    cropType: "corn",
    growthTicks: 40,
    yield: 3,
    sellPrice: 8,
    xpReward: 3,
    requiredLevel: 2,
    itemType: "corn",
  },
  carrot: {
    name: "Carrot",
    cropType: "carrot",
    growthTicks: 45,
    yield: 3,
    sellPrice: 10,
    xpReward: 4,
    requiredLevel: 3,
    itemType: "carrot",
  },
  tomato: {
    name: "Tomato",
    cropType: "tomato",
    growthTicks: 60,
    yield: 2,
    sellPrice: 12,
    xpReward: 5,
    requiredLevel: 4,
    itemType: "tomato",
  },
  strawberry: {
    name: "Strawberry",
    cropType: "strawberry",
    growthTicks: 90,
    yield: 2,
    sellPrice: 18,
    xpReward: 8,
    requiredLevel: 6,
    itemType: "strawberry",
  },
  sunflower: {
    name: "Sunflower",
    cropType: "sunflower",
    growthTicks: 120,
    yield: 2,
    sellPrice: 25,
    xpReward: 12,
    requiredLevel: 8,
    itemType: "sunflower",
  },
};
