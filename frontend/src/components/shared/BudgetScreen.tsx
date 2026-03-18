import { ModuleType, type ModuleState } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";
import * as TrafficSystem from "@/game/systems/TrafficSystem";
import * as EnergySystem from "@/game/systems/EnergySystem";
import * as SecuritySystem from "@/game/systems/SecuritySystem";
import * as WasteSystem from "@/game/systems/WasteSystem";
import * as FarmSystem from "@/game/systems/FarmSystem";

const MODULE_LABELS: Record<ModuleType, string> = {
  [ModuleType.TRAFFIC]: "Traffic",
  [ModuleType.ENERGY]: "Energy",
  [ModuleType.SECURITY]: "Security",
  [ModuleType.WASTE]: "Waste",
  [ModuleType.FARM]: "Farm",
};

type RevExpFn = (m: ModuleState) => number;

const REVENUE_FNS: Record<ModuleType, RevExpFn> = {
  [ModuleType.TRAFFIC]: TrafficSystem.getRevenue,
  [ModuleType.ENERGY]: EnergySystem.getRevenue,
  [ModuleType.SECURITY]: SecuritySystem.getRevenue,
  [ModuleType.WASTE]: WasteSystem.getRevenue,
  [ModuleType.FARM]: FarmSystem.getRevenue,
};

const EXPENSE_FNS: Record<ModuleType, RevExpFn> = {
  [ModuleType.TRAFFIC]: TrafficSystem.getExpenses,
  [ModuleType.ENERGY]: EnergySystem.getExpenses,
  [ModuleType.SECURITY]: SecuritySystem.getExpenses,
  [ModuleType.WASTE]: WasteSystem.getExpenses,
  [ModuleType.FARM]: FarmSystem.getExpenses,
};

export default function BudgetScreen() {
  const modules = useGameStore((s) => s.modules);
  const economy = useGameStore((s) => s.economy);

  const moduleBreakdown = Object.values(ModuleType).map((mt) => {
    const mod = modules[mt];
    return {
      module: mt,
      label: MODULE_LABELS[mt],
      revenue: REVENUE_FNS[mt](mod),
      expenses: EXPENSE_FNS[mt](mod),
    };
  });

  const totalRevenue = moduleBreakdown.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = moduleBreakdown.reduce((s, m) => s + m.expenses, 0);
  const loanInterest = economy.loans.reduce(
    (s, l) => s + Math.floor(l.amount * l.interestRate),
    0,
  );
  const netProfit = totalRevenue - totalExpenses - loanInterest;

  return (
    <div className="p-4 text-white max-w-lg">
      <h2 className="text-lg font-bold mb-4">Budget Overview</h2>

      <div className="mb-4">
        <h3 className="text-sm text-gray-400 mb-2">Revenue by Module</h3>
        {moduleBreakdown.map((m) => (
          <div key={m.module} className="flex justify-between text-sm py-1">
            <span>{m.label}</span>
            <span className="text-green-400">+{m.revenue}/tick</span>
          </div>
        ))}
        <div className="flex justify-between text-sm py-1 border-t border-gray-700 mt-1 font-bold">
          <span>Total Revenue</span>
          <span className="text-green-400">+{totalRevenue}/tick</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm text-gray-400 mb-2">Expenses by Module</h3>
        {moduleBreakdown.map((m) => (
          <div key={m.module} className="flex justify-between text-sm py-1">
            <span>{m.label}</span>
            <span className="text-red-400">-{m.expenses}/tick</span>
          </div>
        ))}
        {loanInterest > 0 && (
          <div className="flex justify-between text-sm py-1">
            <span>Loan Interest</span>
            <span className="text-red-400">-{loanInterest}/tick</span>
          </div>
        )}
        <div className="flex justify-between text-sm py-1 border-t border-gray-700 mt-1 font-bold">
          <span>Total Expenses</span>
          <span className="text-red-400">-{totalExpenses + loanInterest}/tick</span>
        </div>
      </div>

      <div className="bg-gray-800 rounded p-3">
        <div className="flex justify-between font-bold">
          <span>Net Profit</span>
          <span className={netProfit >= 0 ? "text-green-400" : "text-red-400"}>
            {netProfit >= 0 ? "+" : ""}{netProfit}/tick
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-400">Credits</span>
          <span>{economy.credits.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Active Loans</span>
          <span>{economy.loans.length}</span>
        </div>
      </div>
    </div>
  );
}
