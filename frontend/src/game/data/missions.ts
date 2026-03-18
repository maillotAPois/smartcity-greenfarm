import { ModuleType } from "@/game/state/types";

export interface MissionTemplate {
  id: string;
  module: ModuleType | null;
  title: string;
  description: string;
  requiredLevel: number;
  objectives: {
    description: string;
    target: number;
  }[];
  reward: {
    xp: number;
    credits: number;
  };
}

export const STORY_MISSIONS: MissionTemplate[] = [
  // -- Traffic missions --
  {
    id: "traffic_1",
    module: ModuleType.TRAFFIC,
    title: "First Roads",
    description: "Establish basic road infrastructure for the city.",
    requiredLevel: 1,
    objectives: [
      { description: "Build 3 roads", target: 3 },
    ],
    reward: { xp: 50, credits: 200 },
  },
  {
    id: "traffic_2",
    module: ModuleType.TRAFFIC,
    title: "Smart Signals",
    description: "Upgrade intersections with AI-powered traffic lights.",
    requiredLevel: 2,
    objectives: [
      { description: "Build 2 smart traffic lights", target: 2 },
      { description: "Reach 60% traffic flow", target: 60 },
    ],
    reward: { xp: 100, credits: 500 },
  },
  {
    id: "traffic_3",
    module: ModuleType.TRAFFIC,
    title: "Public Transit Network",
    description: "Create a comprehensive public transit system.",
    requiredLevel: 5,
    objectives: [
      { description: "Build 3 bus stations", target: 3 },
      { description: "Build 1 metro line", target: 1 },
      { description: "Reach 80% traffic flow", target: 80 },
    ],
    reward: { xp: 300, credits: 2000 },
  },

  // -- Energy missions --
  {
    id: "energy_1",
    module: ModuleType.ENERGY,
    title: "Solar Startup",
    description: "Begin generating clean solar energy.",
    requiredLevel: 1,
    objectives: [
      { description: "Build 2 solar panels", target: 2 },
    ],
    reward: { xp: 50, credits: 200 },
  },
  {
    id: "energy_2",
    module: ModuleType.ENERGY,
    title: "Wind Power",
    description: "Diversify energy sources with wind turbines.",
    requiredLevel: 2,
    objectives: [
      { description: "Build 2 wind turbines", target: 2 },
      { description: "Reach 50% energy coverage", target: 50 },
    ],
    reward: { xp: 100, credits: 500 },
  },
  {
    id: "energy_3",
    module: ModuleType.ENERGY,
    title: "Grid Mastery",
    description: "Build a smart grid to manage the full energy network.",
    requiredLevel: 7,
    objectives: [
      { description: "Build 1 smart grid hub", target: 1 },
      { description: "Build 1 battery storage", target: 1 },
      { description: "Reach 90% energy coverage", target: 90 },
    ],
    reward: { xp: 400, credits: 3000 },
  },

  // -- Security missions --
  {
    id: "security_1",
    module: ModuleType.SECURITY,
    title: "Eyes on the City",
    description: "Install surveillance cameras for public safety.",
    requiredLevel: 1,
    objectives: [
      { description: "Build 3 CCTV cameras", target: 3 },
    ],
    reward: { xp: 50, credits: 200 },
  },
  {
    id: "security_2",
    module: ModuleType.SECURITY,
    title: "Emergency Services",
    description: "Establish police and fire response capabilities.",
    requiredLevel: 3,
    objectives: [
      { description: "Build 1 police station", target: 1 },
      { description: "Build 1 fire station", target: 1 },
    ],
    reward: { xp: 150, credits: 800 },
  },
  {
    id: "security_3",
    module: ModuleType.SECURITY,
    title: "Central Command",
    description: "Coordinate all emergency services from a central hub.",
    requiredLevel: 6,
    objectives: [
      { description: "Build 1 dispatch center", target: 1 },
      { description: "Reach 80% safety score", target: 80 },
    ],
    reward: { xp: 350, credits: 2500 },
  },

  // -- Waste missions --
  {
    id: "waste_1",
    module: ModuleType.WASTE,
    title: "Clean Streets",
    description: "Deploy waste collection infrastructure.",
    requiredLevel: 1,
    objectives: [
      { description: "Build 5 trash bin networks", target: 5 },
    ],
    reward: { xp: 50, credits: 150 },
  },
  {
    id: "waste_2",
    module: ModuleType.WASTE,
    title: "Recycling Program",
    description: "Start a city-wide recycling initiative.",
    requiredLevel: 3,
    objectives: [
      { description: "Build 1 recycling center", target: 1 },
      { description: "Build 3 smart bins", target: 3 },
    ],
    reward: { xp: 120, credits: 600 },
  },
  {
    id: "waste_3",
    module: ModuleType.WASTE,
    title: "Zero Waste Vision",
    description: "Maximize waste processing and energy recovery.",
    requiredLevel: 10,
    objectives: [
      { description: "Build 1 waste-to-energy plant", target: 1 },
      { description: "Build 1 composting facility", target: 1 },
      { description: "Reach 85% waste efficiency", target: 85 },
    ],
    reward: { xp: 500, credits: 4000 },
  },

  // -- Farm missions --
  {
    id: "farm_1",
    module: ModuleType.FARM,
    title: "Green Beginnings",
    description: "Start community food production.",
    requiredLevel: 1,
    objectives: [
      { description: "Build 2 community gardens", target: 2 },
    ],
    reward: { xp: 50, credits: 200 },
  },
  {
    id: "farm_2",
    module: ModuleType.FARM,
    title: "Controlled Growing",
    description: "Advance to greenhouse-based agriculture.",
    requiredLevel: 3,
    objectives: [
      { description: "Build 1 greenhouse", target: 1 },
      { description: "Reach 40% food supply", target: 40 },
    ],
    reward: { xp: 120, credits: 600 },
  },
  {
    id: "farm_3",
    module: ModuleType.FARM,
    title: "High-Tech Farming",
    description: "Build advanced farming facilities for maximum yield.",
    requiredLevel: 7,
    objectives: [
      { description: "Build 1 vertical farm", target: 1 },
      { description: "Build 1 hydroponics lab", target: 1 },
      { description: "Reach 80% food supply", target: 80 },
    ],
    reward: { xp: 400, credits: 3000 },
  },
];

export const DAILY_CHALLENGE_TEMPLATES = [
  {
    title: "Rush Hour",
    description: "Maintain traffic flow above 70% for 24 ticks.",
    objectives: [{ description: "Keep traffic flow above 70%", target: 24 }],
    reward: { xp: 30, credits: 100 },
  },
  {
    title: "Power Saver",
    description: "Generate 500 energy units in a single day.",
    objectives: [{ description: "Generate 500 energy units", target: 500 }],
    reward: { xp: 30, credits: 100 },
  },
  {
    title: "Zero Incidents",
    description: "No security incidents for 48 ticks.",
    objectives: [{ description: "Maintain zero incidents", target: 48 }],
    reward: { xp: 40, credits: 150 },
  },
  {
    title: "Green Harvest",
    description: "Harvest 20 crop units in a single day.",
    objectives: [{ description: "Harvest crop units", target: 20 }],
    reward: { xp: 25, credits: 80 },
  },
  {
    title: "Clean City",
    description: "Keep waste efficiency above 80% for 24 ticks.",
    objectives: [{ description: "Maintain waste efficiency above 80%", target: 24 }],
    reward: { xp: 30, credits: 100 },
  },
];
