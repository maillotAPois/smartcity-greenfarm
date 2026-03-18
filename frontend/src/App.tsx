import { useState, useCallback } from "react";
import { BuildingType, ModuleType, type BuildingType as BT } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";
import { useGameLoop } from "@/hooks/useGameLoop";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import NotificationBar from "@/components/layout/NotificationBar";
import CityMap from "@/game/renderer/CityMap";
import BuildMenu from "@/components/shared/BuildMenu";
import UpgradeTree from "@/components/shared/UpgradeTree";
import BudgetScreen from "@/components/shared/BudgetScreen";
import Tutorial from "@/components/Tutorial";
import TrafficPanel from "@/modules/traffic/TrafficPanel";
import EnergyPanel from "@/modules/energy/EnergyPanel";
import SecurityPanel from "@/modules/security/SecurityPanel";
import WastePanel from "@/modules/waste/WastePanel";
import GreenFarmPanel from "@/modules/greenfarm/GreenFarmPanel";
import CropDialog from "@/modules/greenfarm/CropDialog";
import AnimalDialog from "@/modules/greenfarm/AnimalDialog";
import ProcessingDialog from "@/modules/greenfarm/ProcessingDialog";

const MODULE_PANELS: Record<ModuleType, React.ComponentType> = {
  [ModuleType.TRAFFIC]: TrafficPanel,
  [ModuleType.ENERGY]: EnergyPanel,
  [ModuleType.SECURITY]: SecurityPanel,
  [ModuleType.WASTE]: WastePanel,
  [ModuleType.FARM]: GreenFarmPanel,
};

type RightPanelView = "none" | "build" | "upgrade" | "budget";

interface FarmDialogState {
  type: "crop" | "animal" | "processing";
  buildingId: string;
}

function App() {
  useGameLoop();

  const tutorialCompleted = useGameStore((s) => s.tutorial.completed);
  const selectedModule = useGameStore((s) => s.selectedModule);
  const addBuilding = useGameStore((s) => s.addBuilding);

  const [pendingBuild, setPendingBuild] = useState<BT | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanelView>("none");
  const [farmDialog, setFarmDialog] = useState<FarmDialogState | null>(null);

  const handleBuildSelect = useCallback((type: BT) => {
    setPendingBuild(type);
  }, []);

  const handleGridClick = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        gridX: number;
        gridY: number;
      };
      if (pendingBuild && detail) {
        const success = addBuilding(pendingBuild, {
          x: detail.gridX,
          y: detail.gridY,
        });
        if (success) {
          setPendingBuild(null);
        }
      }
    },
    [pendingBuild, addBuilding],
  );

  const handleFarmClick = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        buildingId: string;
        buildingType: string;
      };
      if (!detail) return;

      const bt = detail.buildingType as BuildingType;
      if (bt === BuildingType.FIELD) {
        setFarmDialog({ type: "crop", buildingId: detail.buildingId });
      } else if (
        bt === BuildingType.CHICKEN_COOP ||
        bt === BuildingType.COW_PASTURE ||
        bt === BuildingType.BEE_HIVE
      ) {
        setFarmDialog({ type: "animal", buildingId: detail.buildingId });
      } else if (
        bt === BuildingType.MILL ||
        bt === BuildingType.BAKERY ||
        bt === BuildingType.DAIRY
      ) {
        setFarmDialog({ type: "processing", buildingId: detail.buildingId });
      }
    },
    [],
  );

  const handleCanvasRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        node.addEventListener("gridclick", handleGridClick);
        node.addEventListener("farmclick", handleFarmClick);
        return () => {
          node.removeEventListener("gridclick", handleGridClick);
          node.removeEventListener("farmclick", handleFarmClick);
        };
      }
    },
    [handleGridClick, handleFarmClick],
  );

  const ModulePanel = selectedModule ? MODULE_PANELS[selectedModule] : null;

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 overflow-hidden">
      {!tutorialCompleted && <Tutorial />}
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Left panel: module info or build menu */}
        {(selectedModule || rightPanel !== "none") && (
          <div className="w-64 bg-gray-850 border-r border-gray-700 overflow-y-auto bg-gray-800">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setRightPanel("build")}
                className={`flex-1 px-2 py-2 text-xs ${rightPanel === "build" ? "bg-gray-700 text-white" : "text-gray-400"}`}
              >
                Build
              </button>
              <button
                onClick={() => setRightPanel("upgrade")}
                className={`flex-1 px-2 py-2 text-xs ${rightPanel === "upgrade" ? "bg-gray-700 text-white" : "text-gray-400"}`}
              >
                Upgrade
              </button>
              <button
                onClick={() => setRightPanel("budget")}
                className={`flex-1 px-2 py-2 text-xs ${rightPanel === "budget" ? "bg-gray-700 text-white" : "text-gray-400"}`}
              >
                Budget
              </button>
            </div>

            {rightPanel === "build" && (
              <BuildMenu onSelect={handleBuildSelect} />
            )}
            {rightPanel === "upgrade" && <UpgradeTree />}
            {rightPanel === "budget" && <BudgetScreen />}

            {rightPanel === "none" && ModulePanel && <ModulePanel />}
          </div>
        )}

        {/* Main map area */}
        <div ref={handleCanvasRef} className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center relative">
          {pendingBuild && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-3 py-1 rounded text-sm z-10">
              Click on the map to place building
            </div>
          )}
          <CityMap gridSize={20} />
        </div>

        {/* Right panel: module details */}
        {ModulePanel && rightPanel === "none" && (
          <div className="w-72 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <ModulePanel />
          </div>
        )}
      </div>

      <NotificationBar />

      {/* Farm dialogs */}
      {farmDialog?.type === "crop" && (
        <CropDialog buildingId={farmDialog.buildingId} onClose={() => setFarmDialog(null)} />
      )}
      {farmDialog?.type === "animal" && (
        <AnimalDialog buildingId={farmDialog.buildingId} onClose={() => setFarmDialog(null)} />
      )}
      {farmDialog?.type === "processing" && (
        <ProcessingDialog buildingId={farmDialog.buildingId} onClose={() => setFarmDialog(null)} />
      )}
    </div>
  );
}

export default App;
