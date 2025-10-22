import { useState } from "react";
import type { ContractorDashboardProps, ContractorStats, TeamMember } from "@/types/dashboard";

/**
 * ContractorDashboard Component
 * Displays the contractor-specific dashboard with company info, team, and chat
 */
const ContractorDashboard = ({ user }: ContractorDashboardProps) => {
  const [contractorStats] = useState<ContractorStats>({
    activeJobs: 8,
    completedJobs: 45,
    totalEarnings: '$12,450',
    monthlyEarnings: '$3,200',
    averageRating: 4.8,
    totalReviews: 28
  });

  const teamMembers: TeamMember[] = [
    { name: "Carlos Martinez", role: "Lead Electrician", avatar: "CM", status: "online" },
    { name: "Ana Rodriguez", role: "Assistant", avatar: "AR", status: "online" },
    { name: "Juan Perez", role: "Helper", avatar: "JP", status: "offline" }
  ];

  const StatCard = ({ title, value, subtitle, trend }: {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: { value: string; isPositive: boolean };
  }) => (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#F5D238]/10 dark:bg-[#F5D238]/5 rounded-full transform translate-x-8 -translate-y-8"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-black text-gray-900 dark:text-white mt-2 group-hover:scale-105 transition-transform duration-200">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="w-14 h-14 bg-[#F5D238]/20 dark:bg-[#F5D238]/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <div className="w-6 h-6 bg-[#F5D238] rounded-md"></div>
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center">
            <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-full ${
              trend.isPositive 
                ? 'bg-[#F5D238]/20 text-[#1A1B16] dark:bg-[#F5D238]/30 dark:text-[#F5D238]' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="relative">
                <div className="w-24 h-24 bg-[#F5D238] rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0 ring-4 ring-[#F5D238]/20">
                  <div className="w-12 h-12 bg-white rounded-xl"></div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1A1B16] rounded-full border-4 border-white flex items-center justify-center">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Status Progress Card - Enhanced */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-700/30 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#F5D238] rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-gray-900 dark:text-white">
                        Proceso de Verificación
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                        Estado: En revisión final
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center bg-[#F5D238] text-[#1A1B16] px-3 py-1 rounded-full text-xs font-bold">
                      85% Completado
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progreso de verificación</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="bg-[#F5D238] h-3 rounded-full shadow-sm transition-all duration-1000 ease-out" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                    <strong>Siguiente paso:</strong> Nuestro equipo está realizando la verificación final de su documentación.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>Tiempo estimado:</strong> 12-24 horas | <strong>Notificaremos por email</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Cards - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard
                title="Trabajos Activos"
                value={contractorStats.activeJobs}
                subtitle="proyectos en curso"
                trend={{ value: "+25%", isPositive: true }}
              />
              <StatCard
                title="Completados"
                value={contractorStats.completedJobs}
                subtitle="trabajos finalizados"
                trend={{ value: "+18%", isPositive: true }}
              />
              <StatCard
                title="Calificación"
                value={`${contractorStats.averageRating}/5`}
                subtitle={`de ${contractorStats.totalReviews} reseñas`}
                trend={{ value: "+0.2", isPositive: true }}
              />
            </div>

            {/* Earnings Overview */}
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
            
            {/* Team Section - Enhanced */}
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
                    <div key={index} className="group bg-white dark:bg-gray-800 p-5 rounded-2xl hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-[#F5D238] rounded-2xl flex items-center justify-center text-[#1A1B16] font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                            {member.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ring-3 ring-white dark:ring-gray-800 ${
                            member.status === 'online' ? 'bg-[#F5D238]' : 'bg-gray-400'
                          } flex items-center justify-center`}>
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
                  
                  <button className="group bg-gray-50 dark:bg-gray-700/30 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-5 text-gray-600 dark:text-gray-400 font-bold hover:border-[#F5D238] dark:hover:border-[#F5D238] hover:bg-[#F5D238]/10 dark:hover:bg-[#F5D238]/20 transition-all duration-300 flex items-center justify-center min-h-[100px]">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-[#F5D238] rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                        <span className="text-[#1A1B16] font-bold">+</span>
                      </div>
                      <span className="text-sm">Agregar miembro</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Contact & Portfolio Section - Enhanced */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gray-100 dark:bg-gray-700/30 rounded-full transform -translate-x-12 -translate-y-12"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
                  Mi Perfil Profesional
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200">
                      <div className="w-12 h-12 bg-[#F5D238] rounded-2xl flex items-center justify-center text-[#1A1B16] shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <div className="w-6 h-6 border-2 border-[#1A1B16] rounded-sm"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sitio web</p>
                        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-[#F5D238] dark:hover:text-[#F5D238] font-bold transition-colors">
                          www.laempresa.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200">
                      <div className="w-12 h-12 bg-[#F5D238] rounded-2xl flex items-center justify-center text-[#1A1B16] shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <div className="w-6 h-4 border-2 border-[#1A1B16] rounded-sm border-b-0">
                          <div className="w-full h-2 border-b-2 border-[#1A1B16] transform rotate-45 origin-bottom-left"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</p>
                        <a href="mailto:info@laempresa.com" className="text-gray-700 dark:text-gray-300 hover:text-[#F5D238] dark:hover:text-[#F5D238] font-bold transition-colors">
                          info@laempresa.com
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200">
                      <div className="w-12 h-12 bg-[#F5D238] rounded-2xl flex items-center justify-center text-[#1A1B16] shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <div className="w-4 h-6 border-2 border-[#1A1B16] rounded-lg"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Teléfono</p>
                        <a href="tel:+1234567890" className="text-gray-700 dark:text-gray-300 hover:text-[#F5D238] dark:hover:text-[#F5D238] font-bold transition-colors">
                          +1 (234) 567-8900
                        </a>
                      </div>
                    </div>
                    
                    <div className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200">
                      <div className="w-12 h-12 bg-[#F5D238] rounded-2xl flex items-center justify-center text-[#1A1B16] shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <div className="w-4 h-6 bg-[#1A1B16] rounded-full rounded-b-none relative">
                          <div className="w-2 h-2 bg-[#F5D238] rounded-full absolute top-1 left-1"></div>
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
                
                {/* Portfolio/Gallery Preview */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Galería de Trabajos</h3>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-[#F5D238] dark:hover:text-[#F5D238] font-semibold text-sm">
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
          </div>

          {/* Right Sidebar - Enhanced Chat & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions Panel */}
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

            {/* Enhanced Chat */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  Soporte Directorii
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#F5D238] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#F5D238] font-semibold">En línea</span>
                </div>
              </div>
              
              {/* Chat Messages Area */}
              <div className="h-80 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 border border-gray-100 dark:border-gray-600 mb-4 space-y-3">
                {/* Welcome message */}
                <div className="flex justify-center">
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-xs font-semibold">
                    Hoy, 10:30 AM
                  </div>
                </div>
                
                {/* Support message */}
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-xs">
                    <div className="w-8 h-8 bg-[#F5D238] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1A1B16] text-sm font-bold">D</span>
                    </div>
                    <div className="bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-2xl rounded-tl-sm p-3 text-sm shadow-sm text-gray-900 dark:text-white">
                      ¡Hola! Soy Ana del equipo de soporte. ¿En qué puedo ayudarte hoy?
                    </div>
                  </div>
                </div>
                
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-[#F5D238] text-[#1A1B16] rounded-2xl rounded-tr-sm p-3 max-w-xs text-sm shadow-lg">
                    Hola, ¿cuándo estará lista mi verificación?
                  </div>
                </div>
                
                {/* Support response */}
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-xs">
                    <div className="w-8 h-8 bg-[#F5D238] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1A1B16] text-sm font-bold">D</span>
                    </div>
                    <div className="bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-2xl rounded-tl-sm p-3 text-sm shadow-sm text-gray-900 dark:text-white">
                      Estamos en las últimas etapas de revisión. Te notificaremos en las próximas 24 horas. ¡Gracias por tu paciencia!
                    </div>
                  </div>
                </div>
                
                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-[#F5D238] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1A1B16] text-sm font-bold">D</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-600 rounded-2xl rounded-tl-sm p-3 flex space-x-1">
                      <div className="w-2 h-2 bg-[#F5D238] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#F5D238] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-[#F5D238] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Chat Input */}
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 dark:placeholder-gray-400"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#F5D238] dark:hover:text-[#F5D238] transition-colors">
                    <div className="w-4 h-4 border-2 border-current rounded transform rotate-45"></div>
                  </button>
                </div>
                <button 
                    className="bg-[#F5D238] text-[#1A1B16] w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-[#1A1B16] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    title="Enviar Mensaje"
                >
                  <div className="w-5 h-5 border-l-2 border-b-2 border-current transform rotate-45 translate-x-0.5"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;