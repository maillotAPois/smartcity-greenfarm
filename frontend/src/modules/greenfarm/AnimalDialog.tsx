import { useGameStore } from "@/game/state/gameStore";
import { ANIMALS } from "@/game/data/animals";
import { getAnimalProgress } from "@/game/systems/AnimalSystem";

interface AnimalDialogProps {
  buildingId: string;
  onClose: () => void;
}

export default function AnimalDialog({ buildingId, onClose }: AnimalDialogProps) {
  const pen = useGameStore((s) => s.farmState.animalPens.find((p) => p.buildingId === buildingId));
  const tick = useGameStore((s) => s.tick);
  const collectAnimalProduct = useGameStore((s) => s.collectAnimalProduct);

  if (!pen) return null;

  const def = ANIMALS[pen.animalType];
  const progress = getAnimalProgress(pen, tick);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-5 w-72" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold">{def.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">X</button>
        </div>

        <p className="text-gray-300 text-sm mb-2">
          Produces: <span className="text-yellow-400">{pen.productType}</span> (x{pen.quantity})
        </p>

        {!pen.readyToCollect && (
          <div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="text-gray-400 text-xs">{Math.round(progress * 100)}% -- next production</p>
          </div>
        )}

        {pen.readyToCollect && (
          <button
            onClick={() => { collectAnimalProduct(buildingId); onClose(); }}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded font-medium mt-2"
          >
            Collect {pen.productType} (x{pen.quantity})
          </button>
        )}
      </div>
    </div>
  );
}
