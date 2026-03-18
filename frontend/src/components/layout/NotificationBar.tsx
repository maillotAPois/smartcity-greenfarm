import { useGameStore } from "@/game/state/gameStore";

export default function NotificationBar() {
  const notifications = useGameStore((s) => s.notifications);
  const dismissNotification = useGameStore((s) => s.dismissNotification);

  const recent = notifications
    .filter((n) => !n.read)
    .slice(-10)
    .reverse();

  if (recent.length === 0) return null;

  const typeStyles: Record<string, string> = {
    info: "bg-blue-900 border-blue-700",
    warning: "bg-yellow-900 border-yellow-700",
    error: "bg-red-900 border-red-700",
    success: "bg-green-900 border-green-700",
  };

  return (
    <div className="absolute bottom-4 right-4 w-80 flex flex-col gap-2 z-50">
      {recent.map((n) => (
        <div
          key={n.id}
          className={`border rounded px-3 py-2 text-sm text-white flex items-start justify-between ${typeStyles[n.type] ?? "bg-gray-800 border-gray-600"}`}
        >
          <span className="flex-1">{n.message}</span>
          <button
            onClick={() => dismissNotification(n.id)}
            className="ml-2 text-gray-400 hover:text-white flex-shrink-0"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
