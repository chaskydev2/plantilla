
import React from "react";
import type { TeamMember } from "@/types/dashboard";

interface ContractorTeamProps {
  teamMembers: TeamMember[];
}

const ContractorTeam: React.FC<ContractorTeamProps> = ({ teamMembers }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-700/30 rounded-full transform translate-x-16 -translate-y-16"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center">
              Mi Equipo
              <span className="ml-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
                {teamMembers.length} miembros
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Profesionales especializados que garantizan calidad en cada proyecto
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 p-5 rounded-2xl hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-[#ffed00] rounded-2xl flex items-center justify-center text-[#1A1B16] font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                    {member.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ring-3 ring-white dark:ring-gray-800 ${
                      member.status === 'online' ? 'bg-[#ffed00]' : 'bg-gray-400'
                    } flex items-center justify-center`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{member.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{member.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {member.status === 'online' ? 'Disponible ahora' : 'Desconectado'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <button className="group bg-gray-50 dark:bg-gray-700/30 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-5 text-gray-600 dark:text-gray-400 font-bold hover:border-[#ffed00] dark:hover:border-[#ffed00] hover:bg-[#ffed00]/10 dark:hover:bg-[#ffed00]/20 transition-all duration-300 flex items-center justify-center min-h-[100px]">
            <div className="text-center">
              <div className="w-8 h-8 bg-[#ffed00] rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                <span className="text-[#1A1B16] font-bold">+</span>
              </div>
              <span className="text-sm">Agregar miembro</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractorTeam;
