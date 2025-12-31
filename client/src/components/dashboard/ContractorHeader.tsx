import type { ContractorDashboardProps } from "@/types/dashboard";

const ContractorHeader = ({ user }: { user: ContractorDashboardProps["user"] }) => (
  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl border-b border-gray-200/50 dark:border-gray-700/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="relative">
            <div className="w-24 h-24 bg-[#F5D238] rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0 ring-4 ring-[#F5D238]/20">
              <div className="w-12 h-12 bg-white rounded-xl"></div>
            </div>
            {/* Estado del usuario (online/offline) */}
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${user?.status === 'online' ? 'bg-[#F5D238]' : 'bg-gray-400'}`}>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1A1B16] dark:text-white leading-tight">
              {user?.name || 'Contractor Services Inc.'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 font-medium">
              Especialistas en electricidad y plomería • 4.8/5 calificación
            </p>
            <div className="flex items-center mt-3 space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F5D238]/20 text-[#1A1B16] dark:bg-[#F5D238]/30 dark:text-[#F5D238]">
                Verificado
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                Disponible en tu área
              </span>
              {/* Texto del estado del usuario */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user?.status === 'online' ? 'bg-[#F5D238]/20 text-[#1A1B16]' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                {user?.status === 'online' ? 'Disponible ahora' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0 flex items-center space-x-4">
          <div className="text-right mr-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Estado actual</p>
            <span className="inline-flex items-center bg-[#F5D238] text-[#1A1B16] px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200">
              Presupuestación
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <button className="w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl flex items-center justify-center hover:bg-[#F5D238] hover:text-[#1A1B16] dark:hover:bg-[#F5D238] dark:hover:text-[#1A1B16] transition-all duration-200 shadow-md">
              <div className="w-5 h-5 bg-current rounded"></div>
            </button>
            <button className="w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl flex items-center justify-center hover:bg-[#F5D238] hover:text-[#1A1B16] dark:hover:bg-[#F5D238] dark:hover:text-[#1A1B16] transition-all duration-200 shadow-md">
              <div className="w-5 h-5 bg-current rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContractorHeader;
