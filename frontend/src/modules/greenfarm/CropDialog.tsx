import { type CropType } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";
import { CROPS } from "@/game/data/crops";
import { getCropProgress } from "@/game/systems/CropSystem";

interface CropDialogProps {
  buildingId: string;
  onClose: () => void;
}

export default function CropDialog({ buildingId, onClose }: CropDialogProps) {
  const plot = useGameStore((s) => s.farmState.plots.find((p) => p.buildingId === buildingId));
  const tick = useGameStore((s) => s.tick);
  const level = useGameStore((s) => s.progression.level);
  const plantCrop = useGameStore((s) => s.plantCrop);
  const harvestCrop = useGameStore((s) => s.harvestCrop);

  if (!plot) return null;

  const progress = getCropProgress(plot, tick);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-5 w-80 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold">Field</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">X</button>
        </div>

        {plot.stage === "empty" && (
          <div>
            <p className="text-gray-300 text-sm mb-3">Choose a crop to plant:</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(CROPS) as [CropType, (typeof CROPS)[CropType]][]).map(([key, crop]) => {
                const canPlant = level >= crop.requiredLevel;
                return (
                  <button
                    key={key}
                    disabled={!canPlant}
                    onClick={() => { plantCrop(buildingId, key); onClose(); }}
                    className={`p-2 rounded text-left text-sm ${
                      canPlant
                        ? "bg-green-800 hover:bg-green-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <div className="font-medium">{crop.name}</div>
                    <div className="text-xs text-gray-300">
                      {crop.growthTicks}t | x{crop.yield} | {crop.sellPrice}c
                    </div>
                    {!canPlant && (
                      <div className="text-xs text-yellow-500">Lv.{crop.requiredLevel}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {plot.stage === "growing" && plot.cropType && (
          <div>
            <p className="text-gray-300 text-sm mb-2">
              Growing: <span className="text-green-400 font-medium">{CROPS[plot.cropType].name}</span>
            </p>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="text-gray-400 text-xs">{Math.round(progress * 100)}% complete</p>
          </div>
        )}

        {plot.stage === "ready" && plot.cropType && (
          <div>
            <p className="text-green-400 font-medium mb-3">
              {CROPS[plot.cropType].name} ready to harvest!
            </p>
            <button
              onClick={() => { harvestCrop(buildingId); onClose(); }}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded font-medium"
            >
              Harvest (x{plot.quantity})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
