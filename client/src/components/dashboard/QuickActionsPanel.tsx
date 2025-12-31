import React from "react";

const QuickActionsPanel: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-6">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      Acciones Rápidas
    </h3>
    <div className="space-y-3">
      <button className="w-full bg-[#F5D238] text-[#1A1B16] p-4 rounded-2xl font-semibold hover:bg-[#1A1B16] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
        Crear Presupuesto
      </button>
      <button className="w-full bg-[#F5D238] text-[#1A1B16] p-4 rounded-2xl font-semibold hover:bg-[#1A1B16] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
        Ver Calendario
      </button>
      <button className="w-full bg-[#F5D238] text-[#1A1B16] p-4 rounded-2xl font-semibold hover:bg-[#1A1B16] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
        Reportes
      </button>
    </div>
  </div>
);

export default QuickActionsPanel;
