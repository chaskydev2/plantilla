import type { StatCardProps } from "@/types/dashboard";

/**
 * StatCard Component
 * Displays statistics in a card format with icon, value, and change indicator
 */
const StatCard = ({ title, value, subtitle, trend }: StatCardProps) => (
  <div className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden`}>
    {/* Background gradient accent */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-[#ffed00]/10 dark:bg-[#ffed00]/5 rounded-full transform translate-x-8 -translate-y-8"></div>
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
        <div className="w-14 h-14 bg-[#ffed00]/20 dark:bg-[#ffed00]/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
          <div className="w-6 h-6 bg-[#ffed00] rounded-md"></div>
        </div>
      </div>
      {trend && (
        <div className="flex items-center">
          <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-full ${
            trend.isPositive
              ? 'bg-[#ffed00]/20 text-[#1A1B16] dark:bg-[#ffed00]/30 dark:text-[#ffed00]'
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

export default StatCard;