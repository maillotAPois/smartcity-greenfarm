import { BuildingType, type AnimalType, type FarmItemType } from "@/game/state/types";

export interface AnimalDefinition {
  animalType: AnimalType;
  name: string;
  productType: FarmItemType;
  productionInterval: number;
  quantity: number;
  requiredLevel: number;
  buildingType: BuildingType;
}

export const ANIMALS: Record<AnimalType, AnimalDefinition> = {
  chicken: {
    animalType: "chicken",
    name: "Chicken",
    productType: "egg",
    productionInterval: 40,
    quantity: 2,
    requiredLevel: 2,
    buildingType: BuildingType.CHICKEN_COOP,
  },
  cow: {
    animalType: "cow",
    name: "Cow",
    productType: "milk",
    productionInterval: 80,
    quantity: 1,
    requiredLevel: 4,
    buildingType: BuildingType.COW_PASTURE,
  },
  bee: {
    animalType: "bee",
    name: "Bee",
    productType: "honey",
    productionInterval: 100,
    quantity: 1,
    requiredLevel: 5,
    buildingType: BuildingType.BEE_HIVE,
  },
};
