import type { StatCardProps } from "@/types/dashboard";

/**
 * StatCard Component
 * Displays statistics in a card format with icon, value, and change indicator
 */
const StatCard = ({ title, value, change, changeType, icon, bgColor }: StatCardProps) => (
  <div className={`rounded-xl ${bgColor} p-6 text-white relative overflow-hidden`}>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-90">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {change && (
        <div className={`text-sm flex items-center ${changeType === 'increase' ? 'text-gray-300' : 'text-gray-400'}`}>
          <span className="mr-1">{changeType === 'increase' ? '↗' : '↘'}</span>
          {change}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;