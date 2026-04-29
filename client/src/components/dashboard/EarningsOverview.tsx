import React from "react";
import type { ContractorStats } from "@/types/dashboard";

interface EarningsOverviewProps {
  contractorStats: ContractorStats;
}

const EarningsOverview: React.FC<EarningsOverviewProps> = ({ contractorStats }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-gray-900/50">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Resumen de Ingresos</h3>
        <p className="text-gray-600 dark:text-gray-400">Rendimiento financiero actual</p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-black text-gray-900 dark:text-white">{contractorStats.totalEarnings}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Total acumulado</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-gray-100 dark:bg-gray-700 backdrop-blur-sm rounded-2xl p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Este mes</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{contractorStats.monthlyEarnings}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">↗ +15% vs mes anterior</p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 backdrop-blur-sm rounded-2xl p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Promedio por trabajo</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">$276</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">↗ +8% este trimestre</p>
      </div>
    </div>
  </div>
);

export default EarningsOverview;
