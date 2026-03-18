import { GameSpeed } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";

const SPEED_LABELS: Record<GameSpeed, string> = {
  [GameSpeed.PAUSED]: "Paused",
  [GameSpeed.NORMAL]: "1x",
  [GameSpeed.FAST]: "2x",
  [GameSpeed.ULTRA]: "5x",
};

export default function TopBar() {
  const credits = useGameStore((s) => s.economy.credits);
  const population = useGameStore((s) => s.population);
  const level = useGameStore((s) => s.progression.level);
  const xp = useGameStore((s) => s.progression.xp);
  const xpToNext = useGameStore((s) => s.progression.xpToNextLevel);
  const speed = useGameStore((s) => s.speed);
  const date = useGameStore((s) => s.date);
  const setSpeed = useGameStore((s) => s.setSpeed);
  const satisfaction = useGameStore((s) => s.satisfactionScore);

  const xpPercent = xpToNext > 0 ? Math.round((xp / xpToNext) * 100) : 0;

  return (
    <header className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 select-none">
      <div className="flex items-center gap-6">
        <div className="text-sm">
          <span className="text-gray-400 mr-1">Credits:</span>
          <span className="font-bold">{credits.toLocaleString()}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400 mr-1">Pop:</span>
          <span className="font-bold">{population.toLocaleString()}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400 mr-1">Satisfaction:</span>
          <span className="font-bold">{satisfaction}%</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Lv.{level}</span>
          <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {xp}/{xpToNext}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[GameSpeed.PAUSED, GameSpeed.NORMAL, GameSpeed.FAST, GameSpeed.ULTRA].map(
            (s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 text-xs rounded ${
                  speed === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {SPEED_LABELS[s]}
              </button>
            ),
          )}
        </div>
        <span className="text-sm text-gray-300 font-mono">{date}</span>
      </div>
    </header>
  );
}
