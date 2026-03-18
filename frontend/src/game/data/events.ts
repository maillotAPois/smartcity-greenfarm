import { ModuleType } from "@/game/state/types";

export interface EventTemplate {
  type: string;
  category: "weather" | "social" | "infrastructure" | "economic" | "cross_module";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  probability: number;
  affectedModules: ModuleType[];
  duration: number;
  choices: {
    id: string;
    label: string;
    effect: Record<string, number>;
  }[];
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  // -- Weather events --
  {
    type: "heatwave",
    category: "weather",
    title: "Heatwave",
    description: "Extreme temperatures are straining the power grid and wilting crops.",
    severity: "high",
    probability: 0.02,
    affectedModules: [ModuleType.ENERGY, ModuleType.FARM],
    duration: 48,
    choices: [
      { id: "ration", label: "Ration energy supply", effect: { energyOutput: -20, satisfaction: -5 } },
      { id: "emergency", label: "Activate emergency cooling", effect: { credits: -500, energyOutput: -10 } },
    ],
  },
  {
    type: "storm",
    category: "weather",
    title: "Severe Storm",
    description: "High winds and heavy rain damage infrastructure.",
    severity: "high",
    probability: 0.015,
    affectedModules: [ModuleType.TRAFFIC, ModuleType.ENERGY],
    duration: 24,
    choices: [
      { id: "shelter", label: "Issue shelter-in-place", effect: { trafficFlow: -30, satisfaction: -3 } },
      { id: "repair", label: "Deploy repair crews", effect: { credits: -800, condition: -10 } },
    ],
  },
  {
    type: "frost",
    category: "weather",
    title: "Early Frost",
    description: "Unexpected cold snap threatens crops and increases heating demand.",
    severity: "medium",
    probability: 0.02,
    affectedModules: [ModuleType.FARM, ModuleType.ENERGY],
    duration: 36,
    choices: [
      { id: "heat", label: "Increase greenhouse heating", effect: { credits: -300, farmYield: -5 } },
      { id: "cover", label: "Deploy frost covers", effect: { credits: -150, farmYield: -15 } },
    ],
  },
  {
    type: "drought",
    category: "weather",
    title: "Drought",
    description: "Water scarcity affects farming and city services.",
    severity: "high",
    probability: 0.01,
    affectedModules: [ModuleType.FARM, ModuleType.WASTE],
    duration: 72,
    choices: [
      { id: "restrict", label: "Water restrictions", effect: { farmYield: -25, satisfaction: -8 } },
      { id: "import", label: "Import water supply", effect: { credits: -1000, farmYield: -10 } },
    ],
  },
  {
    type: "flood",
    category: "weather",
    title: "Flash Flood",
    description: "Heavy rainfall causes localized flooding in low-lying areas.",
    severity: "critical",
    probability: 0.008,
    affectedModules: [ModuleType.TRAFFIC, ModuleType.WASTE, ModuleType.SECURITY],
    duration: 36,
    choices: [
      { id: "evacuate", label: "Evacuate affected areas", effect: { satisfaction: -10, population: -50 } },
      { id: "pump", label: "Deploy emergency pumps", effect: { credits: -1200, trafficFlow: -20 } },
    ],
  },

  // -- Social events --
  {
    type: "festival",
    category: "social",
    title: "City Festival",
    description: "Citizens organize a community festival boosting morale.",
    severity: "low",
    probability: 0.03,
    affectedModules: [ModuleType.TRAFFIC, ModuleType.SECURITY],
    duration: 24,
    choices: [
      { id: "sponsor", label: "Sponsor the event", effect: { credits: -200, satisfaction: 10 } },
      { id: "ignore", label: "Let it proceed naturally", effect: { satisfaction: 3 } },
    ],
  },
  {
    type: "protest",
    category: "social",
    title: "Public Protest",
    description: "Citizens protest poor living conditions.",
    severity: "medium",
    probability: 0.02,
    affectedModules: [ModuleType.SECURITY, ModuleType.TRAFFIC],
    duration: 12,
    choices: [
      { id: "address", label: "Address grievances", effect: { credits: -400, satisfaction: 5 } },
      { id: "disperse", label: "Disperse the crowd", effect: { satisfaction: -10, securityScore: -5 } },
    ],
  },
  {
    type: "population_boom",
    category: "social",
    title: "Population Boom",
    description: "Your city's reputation attracts new residents.",
    severity: "low",
    probability: 0.025,
    affectedModules: [ModuleType.TRAFFIC, ModuleType.WASTE],
    duration: 48,
    choices: [
      { id: "welcome", label: "Build welcome centers", effect: { credits: -300, population: 200 } },
      { id: "limit", label: "Control immigration pace", effect: { population: 50, satisfaction: 2 } },
    ],
  },
  {
    type: "health_scare",
    category: "social",
    title: "Health Scare",
    description: "A minor outbreak causes public concern.",
    severity: "medium",
    probability: 0.015,
    affectedModules: [ModuleType.SECURITY, ModuleType.FARM],
    duration: 36,
    choices: [
      { id: "quarantine", label: "Implement quarantine measures", effect: { satisfaction: -8, population: -30 } },
      { id: "inform", label: "Launch information campaign", effect: { credits: -200, satisfaction: -3 } },
    ],
  },
  {
    type: "tourism_spike",
    category: "social",
    title: "Tourism Spike",
    description: "A travel publication features your city, driving tourism.",
    severity: "low",
    probability: 0.02,
    affectedModules: [ModuleType.TRAFFIC, ModuleType.FARM],
    duration: 48,
    choices: [
      { id: "invest", label: "Invest in tourism infrastructure", effect: { credits: -500, income: 100 } },
      { id: "enjoy", label: "Enjoy the free publicity", effect: { income: 30 } },
    ],
  },

  // -- Infrastructure events --
  {
    type: "pipe_burst",
    category: "infrastructure",
    title: "Water Main Break",
    description: "A major water pipe has burst, disrupting services.",
    severity: "high",
    probability: 0.015,
    affectedModules: [ModuleType.WASTE, ModuleType.FARM],
    duration: 12,
    choices: [
      { id: "emergency_repair", label: "Emergency repair", effect: { credits: -600, satisfaction: -3 } },
      { id: "temporary", label: "Temporary bypass", effect: { credits: -200, wasteEfficiency: -20 } },
    ],
  },
  {
    type: "power_outage",
    category: "infrastructure",
    title: "Power Grid Failure",
    description: "A section of the power grid has failed.",
    severity: "critical",
    probability: 0.01,
    affectedModules: [ModuleType.ENERGY, ModuleType.SECURITY],
    duration: 8,
    choices: [
      { id: "backup", label: "Switch to backup generators", effect: { credits: -400, energyOutput: -30 } },
      { id: "full_repair", label: "Full grid repair", effect: { credits: -1000, energyOutput: -10 } },
    ],
  },
  {
    type: "road_collapse",
    category: "infrastructure",
    title: "Road Collapse",
    description: "A major road has partially collapsed due to subsidence.",
    severity: "high",
    probability: 0.01,
    affectedModules: [ModuleType.TRAFFIC],
    duration: 48,
    choices: [
      { id: "detour", label: "Set up detour routes", effect: { trafficFlow: -25, satisfaction: -5 } },
      { id: "rebuild", label: "Fast-track reconstruction", effect: { credits: -1500, trafficFlow: -10 } },
    ],
  },
  {
    type: "tech_upgrade",
    category: "infrastructure",
    title: "Technology Breakthrough",
    description: "Local researchers develop improved systems.",
    severity: "low",
    probability: 0.02,
    affectedModules: [ModuleType.ENERGY, ModuleType.FARM],
    duration: 72,
    choices: [
      { id: "adopt", label: "Adopt new technology", effect: { credits: -800, energyOutput: 15, farmYield: 10 } },
      { id: "wait", label: "Wait for proven results", effect: {} },
    ],
  },
  {
    type: "bridge_damage",
    category: "infrastructure",
    title: "Bridge Structural Damage",
    description: "Routine inspection reveals critical bridge damage.",
    severity: "high",
    probability: 0.012,
    affectedModules: [ModuleType.TRAFFIC],
    duration: 72,
    choices: [
      { id: "close", label: "Close bridge for repairs", effect: { trafficFlow: -30, credits: -2000 } },
      { id: "limit", label: "Restrict to light traffic", effect: { trafficFlow: -15, satisfaction: -5 } },
    ],
  },

  // -- Economic events --
  {
    type: "market_boom",
    category: "economic",
    title: "Economic Boom",
    description: "The regional economy is thriving, boosting revenue.",
    severity: "low",
    probability: 0.02,
    affectedModules: [],
    duration: 96,
    choices: [
      { id: "invest", label: "Invest in expansion", effect: { credits: -500, income: 80 } },
      { id: "save", label: "Save the surplus", effect: { credits: 500 } },
    ],
  },
  {
    type: "recession",
    category: "economic",
    title: "Economic Recession",
    description: "An economic downturn reduces city revenue.",
    severity: "high",
    probability: 0.01,
    affectedModules: [],
    duration: 120,
    choices: [
      { id: "austerity", label: "Implement austerity measures", effect: { expenses: -30, satisfaction: -10 } },
      { id: "stimulus", label: "Stimulus spending", effect: { credits: -1000, satisfaction: 5 } },
    ],
  },
  {
    type: "grant",
    category: "economic",
    title: "Government Grant",
    description: "The federal government offers a development grant.",
    severity: "low",
    probability: 0.025,
    affectedModules: [],
    duration: 1,
    choices: [
      { id: "accept_energy", label: "Apply to energy projects", effect: { credits: 2000 } },
      { id: "accept_farm", label: "Apply to farming projects", effect: { credits: 2000 } },
    ],
  },
  {
    type: "tax_revolt",
    category: "economic",
    title: "Tax Revolt",
    description: "Citizens demand lower taxes.",
    severity: "medium",
    probability: 0.015,
    affectedModules: [],
    duration: 48,
    choices: [
      { id: "lower", label: "Reduce tax rate", effect: { income: -50, satisfaction: 8 } },
      { id: "maintain", label: "Maintain current rates", effect: { satisfaction: -10 } },
    ],
  },
  {
    type: "investor",
    category: "economic",
    title: "Private Investor Interest",
    description: "A private investor offers to fund city development.",
    severity: "low",
    probability: 0.02,
    affectedModules: [],
    duration: 24,
    choices: [
      { id: "accept", label: "Accept investment", effect: { credits: 3000, satisfaction: -2 } },
      { id: "decline", label: "Decline offer", effect: { satisfaction: 2 } },
    ],
  },

  // -- Cross-module events --
  {
    type: "smart_city_award",
    category: "cross_module",
    title: "Smart City Award Nomination",
    description: "Your city is nominated for an international smart city award.",
    severity: "low",
    probability: 0.01,
    affectedModules: [ModuleType.TRAFFIC, ModuleType.ENERGY, ModuleType.SECURITY, ModuleType.WASTE, ModuleType.FARM],
    duration: 72,
    choices: [
      { id: "campaign", label: "Run award campaign", effect: { credits: -1000, satisfaction: 15, xp: 200 } },
      { id: "humble", label: "Stay humble", effect: { satisfaction: 5, xp: 50 } },
    ],
  },
  {
    type: "cyber_attack",
    category: "cross_module",
    title: "Cyber Attack",
    description: "Hackers target city smart systems across multiple modules.",
    severity: "critical",
    probability: 0.008,
    affectedModules: [ModuleType.TRAFFIC, ModuleType.ENERGY, ModuleType.SECURITY],
    duration: 24,
    choices: [
      { id: "shutdown", label: "Emergency shutdown", effect: { trafficFlow: -40, energyOutput: -40, satisfaction: -15 } },
      { id: "counter", label: "Deploy countermeasures", effect: { credits: -2000, securityScore: -10 } },
    ],
  },
  {
    type: "green_initiative",
    category: "cross_module",
    title: "Green City Initiative",
    description: "A nationwide push for sustainable cities brings funding and attention.",
    severity: "low",
    probability: 0.02,
    affectedModules: [ModuleType.ENERGY, ModuleType.WASTE, ModuleType.FARM],
    duration: 96,
    choices: [
      { id: "join", label: "Join the initiative", effect: { credits: 1000, satisfaction: 5, xp: 100 } },
      { id: "skip", label: "Focus on other priorities", effect: {} },
    ],
  },
  {
    type: "supply_chain",
    category: "cross_module",
    title: "Supply Chain Disruption",
    description: "Global supply issues affect building materials and farm supplies.",
    severity: "medium",
    probability: 0.015,
    affectedModules: [ModuleType.FARM, ModuleType.WASTE, ModuleType.ENERGY],
    duration: 72,
    choices: [
      { id: "local", label: "Source locally at higher cost", effect: { credits: -800, farmYield: -5 } },
      { id: "wait", label: "Wait it out", effect: { farmYield: -20, wasteEfficiency: -10 } },
    ],
  },
  {
    type: "innovation_fair",
    category: "cross_module",
    title: "Innovation Fair",
    description: "Host a technology showcase bringing experts and visitors.",
    severity: "low",
    probability: 0.02,
    affectedModules: [ModuleType.TRAFFIC, ModuleType.ENERGY, ModuleType.FARM],
    duration: 24,
    choices: [
      { id: "host", label: "Host the fair", effect: { credits: -600, xp: 150, satisfaction: 8 } },
      { id: "attend", label: "Send observers only", effect: { xp: 50 } },
    ],
  },

  // -- Farm events --
  {
    type: "pest_invasion",
    category: "weather",
    title: "Pest Invasion",
    description: "Pests are attacking your crops. Security coverage mitigates losses.",
    severity: "medium",
    probability: 0.02,
    affectedModules: [ModuleType.FARM, ModuleType.SECURITY],
    duration: 24,
    choices: [
      { id: "pesticide", label: "Use pesticides", effect: { credits: -300, farmYield: -5 } },
      { id: "natural", label: "Let natural predators help", effect: { farmYield: -15 } },
    ],
  },
  {
    type: "bumper_harvest",
    category: "weather",
    title: "Exceptional Harvest",
    description: "Perfect growing conditions lead to double yields!",
    severity: "low",
    probability: 0.015,
    affectedModules: [ModuleType.FARM],
    duration: 48,
    choices: [
      { id: "celebrate", label: "Celebrate the harvest", effect: { satisfaction: 8, farmYield: 20 } },
      { id: "store", label: "Store extra produce", effect: { farmYield: 15 } },
    ],
  },
  {
    type: "truck_breakdown",
    category: "infrastructure",
    title: "Delivery Truck Breakdown",
    description: "Delivery trucks are out of service. No orders for a while. Traffic flow mitigates duration.",
    severity: "medium",
    probability: 0.015,
    affectedModules: [ModuleType.FARM, ModuleType.TRAFFIC],
    duration: 30,
    choices: [
      { id: "repair", label: "Rush repair service", effect: { credits: -400 } },
      { id: "wait", label: "Wait for repairs", effect: { satisfaction: -5 } },
    ],
  },
  {
    type: "energy_surge",
    category: "infrastructure",
    title: "Energy Surge",
    description: "A power surge doubles processing speed temporarily!",
    severity: "low",
    probability: 0.02,
    affectedModules: [ModuleType.FARM, ModuleType.ENERGY],
    duration: 36,
    choices: [
      { id: "harness", label: "Harness the surge", effect: { farmYield: 10 } },
      { id: "careful", label: "Regulate carefully", effect: { satisfaction: 3 } },
    ],
  },
];
