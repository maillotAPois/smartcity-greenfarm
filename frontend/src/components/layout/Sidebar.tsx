import { ModuleType } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";

const MODULE_ORDER: ModuleType[] = [
  ModuleType.FARM,
  ModuleType.TRAFFIC,
  ModuleType.ENERGY,
  ModuleType.SECURITY,
  ModuleType.WASTE,
];

const MODULE_LABELS: Record<ModuleType, string> = {
  [ModuleType.TRAFFIC]: "Traffic",
  [ModuleType.ENERGY]: "Energy",
  [ModuleType.SECURITY]: "Security",
  [ModuleType.WASTE]: "Waste",
  [ModuleType.FARM]: "Farm",
};

const MODULE_ICONS: Record<ModuleType, string> = {
  [ModuleType.TRAFFIC]: "T",
  [ModuleType.ENERGY]: "E",
  [ModuleType.SECURITY]: "S",
  [ModuleType.WASTE]: "W",
  [ModuleType.FARM]: "F",
};

export default function Sidebar() {
  const selectedModule = useGameStore((s) => s.selectedModule);
  const selectModule = useGameStore((s) => s.selectModule);
  const modules = useGameStore((s) => s.modules);
  const inventoryCount = useGameStore((s) =>
    Object.values(s.farmState.inventory).reduce((sum, qty) => sum + qty, 0),
  );

  return (
    <aside className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 gap-3">
      {MODULE_ORDER.map((mt) => {
        const isSelected = selectedModule === mt;
        const moduleState = modules[mt];
        const buildingCount = moduleState.buildings.length;
        const isFarm = mt === ModuleType.FARM;

        return (
          <button
            key={mt}
            onClick={() => selectModule(isSelected ? null : mt)}
            className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs transition-colors relative ${
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            title={MODULE_LABELS[mt]}
          >
            <span className="text-lg font-bold">{MODULE_ICONS[mt]}</span>
            <span className="text-[10px]">{buildingCount}</span>
            {isFarm && inventoryCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {inventoryCount > 99 ? "99" : inventoryCount}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
