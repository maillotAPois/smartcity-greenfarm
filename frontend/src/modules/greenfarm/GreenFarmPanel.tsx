import { useState } from "react";
import { ModuleType } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";
import KPICard from "@/components/shared/KPICard";
import InventoryPanel from "./InventoryPanel";
import OrderPanel from "./OrderPanel";

type FarmTab = "overview" | "inventory" | "orders";

export default function GreenFarmPanel() {
  const [tab, setTab] = useState<FarmTab>("overview");
  const moduleState = useGameStore((s) => s.modules[ModuleType.FARM]);
  const farmState = useGameStore((s) => s.farmState);
  const metrics = moduleState.metrics;

  const activePlots = farmState.plots.filter((p) => p.stage !== "empty").length;
  const readyAnimals = farmState.animalPens.filter((p) => p.readyToCollect).length;
  const activeProcessing = farmState.processingQueues.reduce(
    (sum, q) => sum + q.slots.filter((s) => s.recipeId && !s.ready).length,
    0,
  );
  const totalItems = Object.values(farmState.inventory).reduce((s, q) => s + q, 0);

  return (
    <div className="p-4">
      <h2 className="text-white text-lg font-bold mb-3">Farm</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        {(["overview", "inventory", "orders"] as FarmTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-2 py-2 text-xs capitalize ${
              tab === t ? "bg-gray-700 text-white border-b-2 border-green-500" : "text-gray-400"
            }`}
          >
            {t}
            {t === "inventory" && totalItems > 0 && (
              <span className="ml-1 bg-green-700 text-white px-1 rounded text-[10px]">{totalItems}</span>
            )}
            {t === "orders" && farmState.orders.length > 0 && (
              <span className="ml-1 bg-yellow-700 text-white px-1 rounded text-[10px]">{farmState.orders.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            <KPICard label="Food Supply" value={`${Math.round(metrics["foodSupply"] ?? 0)}%`} trend={(metrics["foodSupply"] ?? 0) > 50 ? "up" : "down"} />
            <KPICard label="Farm Yield" value={Math.round(metrics["farmYield"] ?? 0)} />
            <KPICard label="Plots Active" value={`${activePlots}/${farmState.plots.length}`} />
            <KPICard label="Animals Ready" value={readyAnimals} />
            <KPICard label="Processing" value={activeProcessing} />
            <KPICard label="Storage" value={`${totalItems}/${farmState.storageCapacity}`} />
          </div>

          <h3 className="text-gray-300 text-sm font-medium mb-2">
            Buildings ({moduleState.buildings.length})
          </h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {moduleState.buildings.map((b) => (
              <div key={b.id} className="bg-gray-800 rounded px-3 py-2 text-sm text-white flex justify-between">
                <span>{b.name} (Lv.{b.level})</span>
                <span className="text-gray-400">{Math.round(b.condition)}%</span>
              </div>
            ))}
            {moduleState.buildings.length === 0 && (
              <p className="text-gray-500 text-sm">No buildings yet.</p>
            )}
          </div>
        </div>
      )}

      {tab === "inventory" && <InventoryPanel />}
      {tab === "orders" && <OrderPanel />}
    </div>
  );
}
