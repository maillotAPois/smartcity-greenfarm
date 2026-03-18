import { ModuleType } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";
import KPICard from "@/components/shared/KPICard";

export default function EnergyPanel() {
  const moduleState = useGameStore((s) => s.modules[ModuleType.ENERGY]);
  const metrics = moduleState.metrics;
  const buildings = moduleState.buildings;

  return (
    <div className="p-4">
      <h2 className="text-white text-lg font-bold mb-4">Energy Module</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <KPICard
          label="Coverage"
          value={`${Math.round(metrics["energyCoverage"] ?? 0)}%`}
          trend={(metrics["energyCoverage"] ?? 0) > 60 ? "up" : "down"}
        />
        <KPICard
          label="Generation"
          value={Math.round(metrics["generation"] ?? 0)}
        />
        <KPICard
          label="Storage"
          value={Math.round(metrics["storage"] ?? 0)}
        />
        <KPICard
          label="Grid Efficiency"
          value={`${Math.round(metrics["gridEfficiency"] ?? 0)}%`}
        />
        <KPICard
          label="Renewable"
          value={`${Math.round(metrics["renewableRatio"] ?? 0)}%`}
        />
      </div>

      <h3 className="text-gray-300 text-sm font-medium mb-2">
        Buildings ({buildings.length})
      </h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {buildings.map((b) => (
          <div
            key={b.id}
            className="bg-gray-800 rounded px-3 py-2 text-sm text-white flex justify-between"
          >
            <span>
              {b.name} (Lv.{b.level})
            </span>
            <span className="text-gray-400">
              {Math.round(b.condition)}%
            </span>
          </div>
        ))}
        {buildings.length === 0 && (
          <p className="text-gray-500 text-sm">No buildings yet.</p>
        )}
      </div>
    </div>
  );
}
