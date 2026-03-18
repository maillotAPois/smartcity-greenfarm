interface KPICardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: "up" | "down" | "stable";
}

const TREND_INDICATORS: Record<string, string> = {
  up: "[+]",
  down: "[-]",
  stable: "[=]",
};

const TREND_COLORS: Record<string, string> = {
  up: "text-green-400",
  down: "text-red-400",
  stable: "text-gray-400",
};

export default function KPICard({ label, value, icon, trend }: KPICardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3 min-w-[140px]">
      {icon && (
        <span className="text-2xl text-gray-400">{icon}</span>
      )}
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">{label}</span>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-white">{value}</span>
          {trend && (
            <span className={`text-xs ${TREND_COLORS[trend]}`}>
              {TREND_INDICATORS[trend]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
