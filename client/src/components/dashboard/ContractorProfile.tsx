import React from "react";

const ContractorProfile: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-24 h-24 bg-gray-100 dark:bg-gray-700/30 rounded-full transform -translate-x-12 -translate-y-12"></div>
    <div className="relative z-10">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
        Mi Perfil Profesional
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200">
            <div className="w-12 h-12 bg-[#ffed00] rounded-2xl flex items-center justify-center text-[#1A1B16] shadow-lg group-hover:scale-110 transition-transform duration-200">
              <div className="w-6 h-6 border-2 border-[#1A1B16] rounded-sm"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sitio web</p>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-[#ffed00] dark:hover:text-[#ffed00] font-bold transition-colors">
                www.laempresa.com
              </a>
            </div>
          </div>
          <div className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200">
            <div className="w-12 h-12 bg-[#ffed00] rounded-2xl flex items-center justify-center text-[#1A1B16] shadow-lg group-hover:scale-110 transition-transform duration-200">
              <div className="w-6 h-4 border-2 border-[#1A1B16] rounded-sm border-b-0">
                <div className="w-full h-2 border-b-2 border-[#1A1B16] transform rotate-45 origin-bottom-left"></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</p>
              <a href="mailto:info@laempresa.com" className="text-gray-700 dark:text-gray-300 hover:text-[#ffed00] dark:hover:text-[#ffed00] font-bold transition-colors">
                info@laempresa.com
              </a>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200">
            <div className="w-12 h-12 bg-[#ffed00] rounded-2xl flex items-center justify-center text-[#1A1B16] shadow-lg group-hover:scale-110 transition-transform duration-200">
              <div className="w-4 h-6 border-2 border-[#1A1B16] rounded-lg"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Teléfono</p>
              <a href="tel:+1234567890" className="text-gray-700 dark:text-gray-300 hover:text-[#ffed00] dark:hover:text-[#ffed00] font-bold transition-colors">
                +1 (234) 567-8900
              </a>
            </div>
          </div>
          <div className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200">
            <div className="w-12 h-12 bg-[#ffed00] rounded-2xl flex items-center justify-center text-[#1A1B16] shadow-lg group-hover:scale-110 transition-transform duration-200">
              <div className="w-4 h-6 bg-[#1A1B16] rounded-full rounded-b-none relative">
                <div className="w-2 h-2 bg-[#ffed00] rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Ubicación</p>
              <p className="text-gray-700 dark:text-gray-300 font-bold">
                Ciudad de México, MX
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Galería de Trabajos</h3>
          <button className="text-gray-600 dark:text-gray-400 hover:text-[#ffed00] dark:hover:text-[#ffed00] font-semibold text-sm">
            Ver todos →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:scale-105 transition-transform duration-200 cursor-pointer border-2 border-gray-300 dark:border-gray-500">
              <div className="w-8 h-8 bg-gray-400 dark:bg-gray-500 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ContractorProfile;
