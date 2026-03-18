import type { FarmItemType } from "@/game/state/types";

export type ItemCategory = "crop" | "animal_product" | "processed" | "ingredient";

export interface ItemDefinition {
  name: string;
  sellPrice: number;
  xpOnSell: number;
  category: ItemCategory;
}

export const ITEMS: Record<FarmItemType, ItemDefinition> = {
  lettuce: { name: "Lettuce", sellPrice: 4, xpOnSell: 1, category: "crop" },
  herbs: { name: "Herbs", sellPrice: 6, xpOnSell: 2, category: "crop" },
  wheat: { name: "Wheat", sellPrice: 5, xpOnSell: 2, category: "crop" },
  corn: { name: "Corn", sellPrice: 8, xpOnSell: 3, category: "crop" },
  carrot: { name: "Carrot", sellPrice: 10, xpOnSell: 4, category: "crop" },
  tomato: { name: "Tomato", sellPrice: 12, xpOnSell: 5, category: "crop" },
  strawberry: { name: "Strawberry", sellPrice: 18, xpOnSell: 8, category: "crop" },
  sunflower: { name: "Sunflower", sellPrice: 25, xpOnSell: 12, category: "crop" },
  egg: { name: "Egg", sellPrice: 15, xpOnSell: 3, category: "animal_product" },
  milk: { name: "Milk", sellPrice: 20, xpOnSell: 4, category: "animal_product" },
  honey: { name: "Honey", sellPrice: 25, xpOnSell: 5, category: "animal_product" },
  flour: { name: "Flour", sellPrice: 12, xpOnSell: 3, category: "ingredient" },
  feed: { name: "Feed", sellPrice: 10, xpOnSell: 2, category: "ingredient" },
  sugar: { name: "Sugar", sellPrice: 8, xpOnSell: 1, category: "ingredient" },
  bread: { name: "Bread", sellPrice: 30, xpOnSell: 6, category: "processed" },
  cake: { name: "Cake", sellPrice: 50, xpOnSell: 10, category: "processed" },
  cheese: { name: "Cheese", sellPrice: 45, xpOnSell: 8, category: "processed" },
  ice_cream: { name: "Ice Cream", sellPrice: 60, xpOnSell: 12, category: "processed" },
  pastry: { name: "Pastry", sellPrice: 55, xpOnSell: 10, category: "processed" },
};
