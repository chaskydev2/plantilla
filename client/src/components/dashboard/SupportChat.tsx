import React from "react";

const SupportChat: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-6 sticky top-8">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
        Soporte Directorii
      </h3>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-[#ffed00] rounded-full animate-pulse"></div>
        <span className="text-xs text-[#ffed00] font-semibold">En línea</span>
      </div>
    </div>
    <div className="h-80 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 border border-gray-100 dark:border-gray-600 mb-4 space-y-3">
      <div className="flex justify-center">
        <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-xs font-semibold">
          Hoy, 10:30 AM
        </div>
      </div>
      <div className="flex justify-start">
        <div className="flex items-start space-x-2 max-w-xs">
          <div className="w-8 h-8 bg-[#ffed00] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#1A1B16] text-sm font-bold">D</span>
          </div>
          <div className="bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-2xl rounded-tl-sm p-3 text-sm shadow-sm text-gray-900 dark:text-white">
            ¡Hola! Soy Ana del equipo de soporte. ¿En qué puedo ayudarte hoy?
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-[#ffed00] text-[#1A1B16] rounded-2xl rounded-tr-sm p-3 max-w-xs text-sm shadow-lg">
          Hola, ¿cuándo estará lista mi verificación?
        </div>
      </div>
      <div className="flex justify-start">
        <div className="flex items-start space-x-2 max-w-xs">
          <div className="w-8 h-8 bg-[#ffed00] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#1A1B16] text-sm font-bold">D</span>
          </div>
          <div className="bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-2xl rounded-tl-sm p-3 text-sm shadow-sm text-gray-900 dark:text-white">
            Estamos en las últimas etapas de revisión. Te notificaremos en las próximas 24 horas. ¡Gracias por tu paciencia!
          </div>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 bg-[#ffed00] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#1A1B16] text-sm font-bold">D</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-600 rounded-2xl rounded-tl-sm p-3 flex space-x-1">
            <div className="w-2 h-2 bg-[#ffed00] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#ffed00] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-[#ffed00] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex space-x-3">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 dark:placeholder-gray-400"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#ffed00] dark:hover:text-[#ffed00] transition-colors">
          <div className="w-4 h-4 border-2 border-current rounded transform rotate-45"></div>
        </button>
      </div>
      <button 
        className="bg-[#ffed00] text-[#1A1B16] w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-[#1A1B16] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        title="Enviar Mensaje"
      >
        <div className="w-5 h-5 border-l-2 border-b-2 border-current transform rotate-45 translate-x-0.5"></div>
      </button>
    </div>
  </div>
);

export default SupportChat;
