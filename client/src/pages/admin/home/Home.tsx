import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import useAuth from "@/core/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useState } from "react";

// Dashboard Statistics Component
const StatCard = ({ title, value, change, changeType, icon, bgColor }: {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: string;
  bgColor: string;
}) => (
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

// User List Component
const UserItem = ({ name, role, avatar, status }: {
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
}) => (
  <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
          {avatar}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          status === 'online' ? 'bg-slate-500' : 'bg-gray-300'
        }`}></div>
      </div>
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </div>
    <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">
      VIEW
    </button>
  </div>
);

// Under Construction Component
const UnderConstruction = () => (
  <div className="min-h-96 flex items-center justify-center">
    <div className="text-center p-8">
      <div className="text-6xl mb-6">🚧</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Under Construction</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        This section is currently being built. Please check back later for updates.
      </p>
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { hasRole } = useAuth();
  const { t } = useTranslation();
  const [stats] = useState({
    earnings: { current: '$34,542', previous: '$26,845' },
    newWorkers: 1247,
    newHomeowners: 892,
    activeJobs: 324,
    completedJobs: 1156
  });

  const users = [
    { name: "Carlos Martinez", role: "Electrician", avatar: "CM", status: "online" as const },
    { name: "Ana Rodriguez", role: "Plumber", avatar: "AR", status: "online" as const },
    { name: "Juan Perez", role: "Carpenter", avatar: "JP", status: "offline" as const },
    { name: "Maria Garcia", role: "Painter", avatar: "MG", status: "online" as const },
    { name: "Pedro Lopez", role: "Mason", avatar: "PL", status: "offline" as const }
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle={t("admin.dashboard.title")} />
      
      {/* 🔐 RESTRICCIÓN: Solo usuarios con rol "admin" pueden ver el dashboard completo */}
      {hasRole('admin') ? (
        <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Earnings Card */}
          <div className="bg-gray-800 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-300">Platform Earnings</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">{stats.earnings.current}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current Week</span>
                <span>Previous Week</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{stats.earnings.current}</span>
                <span>{stats.earnings.previous}</span>
              </div>
            </div>
          </div>

          {/* Messages Window */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t("admin.dashboard.activeWorkers")}</h3>
              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">
                {t("admin.dashboard.online")}: 12
              </span>
            </div>
            <div className="space-y-2">
              {users.slice(0, 3).map((user, index) => (
                <UserItem key={index} {...user} />
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t("admin.dashboard.newWorkers")}
            value="1,247"
            change={`+12% ${t("admin.dashboard.comparedToLastMonth")}`}
            changeType="increase"
            icon="◐"
            bgColor="bg-slate-600"
          />
          
          <StatCard
            title={t("admin.dashboard.newHomeowners")}
            value="892"
            change={`+8% ${t("admin.dashboard.comparedToLastMonth")}`}
            changeType="increase"
            icon="⌂"
            bgColor="bg-stone-600"
          />
          
          <StatCard
            title={t("admin.dashboard.activeJobs")}
            value="324"
            change={`+15% ${t("admin.dashboard.comparedToLastMonth")}`}
            changeType="increase"
            icon="⚬"
            bgColor="bg-zinc-600"
          />
          
          <StatCard
            title={t("admin.dashboard.completedJobs")}
            value="1,156"
            change={`+22% ${t("admin.dashboard.comparedToLastMonth")}`}
            changeType="increase"
            icon="✓"
            bgColor="bg-neutral-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Registration Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("admin.dashboard.userRegistrations")}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-stone-500 rounded"></div>
                  <span className="text-sm text-gray-700">{t("admin.dashboard.homeowners")}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">892</div>
                  <div className="text-xs text-stone-500">+8% {t("admin.dashboard.thisMonth")}</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-stone-500 h-3 rounded-full" style={{width: '42%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-slate-500 rounded"></div>
                  <span className="text-sm text-gray-700">{t("admin.dashboard.workers")}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">1,247</div>
                  <div className="text-xs text-slate-500">+12% {t("admin.dashboard.thisMonth")}</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-slate-500 h-3 rounded-full" style={{width: '58%'}}></div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("admin.dashboard.totalUsers")}</span>
                  <span className="font-semibold text-gray-900">2,139</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contracts Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-amber-600 rounded"></div>
                  <span className="text-sm text-gray-700">Jobs in Progress</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">324</div>
                  <div className="text-xs text-amber-600">+15% this month</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-amber-600 h-3 rounded-full" style={{width: '21%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                  <span className="text-sm text-gray-700">Completed Jobs</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">1,156</div>
                  <div className="text-xs text-emerald-600">+22% this month</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-emerald-600 h-3 rounded-full" style={{width: '75%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-neutral-500 rounded"></div>
                  <span className="text-sm text-gray-700">Pending Jobs</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">67</div>
                  <div className="text-xs text-red-600">-5% this month</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-neutral-500 h-3 rounded-full" style={{width: '4%'}}></div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Jobs</span>
                  <span className="font-semibold text-gray-900">1,547</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">▣ Weekly Revenue Statistics</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
              <span>Daily Revenue</span>
            </div>
          </div>
          <div className="relative">
            {/* Chart Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-20">
              <div className="border-t border-gray-200"></div>
              <div className="border-t border-gray-200"></div>
              <div className="border-t border-gray-200"></div>
              <div className="border-t border-gray-200"></div>
            </div>
            {/* Bar Chart */}
            <div className="grid grid-cols-7 gap-4 items-end h-56 mb-4 relative z-10">
              <div className="flex flex-col items-center group">
                <div className="w-10 bg-gradient-to-t from-slate-600 to-slate-500 rounded-t-md shadow-sm hover:from-slate-500 hover:to-slate-400 transition-all duration-300" style={{height: '60%'}}></div>
                <span className="text-xs mt-3 font-medium text-gray-700">Mon</span>
                <span className="text-xs text-gray-500 font-semibold">$2.1k</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-10 bg-gradient-to-t from-stone-600 to-stone-500 rounded-t-md shadow-sm hover:from-stone-500 hover:to-stone-400 transition-all duration-300" style={{height: '80%'}}></div>
                <span className="text-xs mt-3 font-medium text-gray-700">Tue</span>
                <span className="text-xs text-gray-500 font-semibold">$3.2k</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-10 bg-gradient-to-t from-zinc-600 to-zinc-500 rounded-t-md shadow-sm hover:from-zinc-500 hover:to-zinc-400 transition-all duration-300" style={{height: '45%'}}></div>
                <span className="text-xs mt-3 font-medium text-gray-700">Wed</span>
                <span className="text-xs text-gray-500 font-semibold">$1.8k</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-10 bg-gradient-to-t from-neutral-600 to-neutral-500 rounded-t-md shadow-sm hover:from-neutral-500 hover:to-neutral-400 transition-all duration-300" style={{height: '90%'}}></div>
                <span className="text-xs mt-3 font-medium text-gray-700">Thu</span>
                <span className="text-xs text-gray-500 font-semibold">$4.5k</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-10 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-md shadow-sm hover:from-gray-500 hover:to-gray-400 transition-all duration-300" style={{height: '70%'}}></div>
                <span className="text-xs mt-3 font-medium text-gray-700">Fri</span>
                <span className="text-xs text-gray-500 font-semibold">$2.8k</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-10 bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-md shadow-sm hover:from-slate-600 hover:to-slate-500 transition-all duration-300" style={{height: '55%'}}></div>
                <span className="text-xs mt-3 font-medium text-gray-700">Sat</span>
                <span className="text-xs text-gray-500 font-semibold">$2.2k</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-10 bg-gradient-to-t from-stone-700 to-stone-600 rounded-t-md shadow-sm hover:from-stone-600 hover:to-stone-500 transition-all duration-300" style={{height: '65%'}}></div>
                <span className="text-xs mt-3 font-medium text-gray-700">Sun</span>
                <span className="text-xs text-gray-500 font-semibold">$2.6k</span>
              </div>
            </div>
          </div>
          <div className="border-t pt-4 bg-gray-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Total Weekly Revenue</span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">7 days</span>
              </div>
              <span className="font-bold text-xl text-gray-900">$19,200</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-slate-700">$9,658</div>
            <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
              <span className="mr-1">$</span>
              Commissions
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-stone-700">2,139</div>
            <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
              <span className="mr-1">◐</span>
              Total Users
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-zinc-700">1,547</div>
            <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
              <span className="mr-1">□</span>
              Posted Jobs
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-neutral-700">4.8</div>
            <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
              <span className="mr-1">★</span>
              Average Rating
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center shadow-sm">
            ▣ View Reports
          </button>
          <button className="bg-stone-600 hover:bg-stone-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center shadow-sm">
            ▤ Generate Report
          </button>
          <button className="bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center shadow-sm">
            ↑ Export Data
          </button>
        </div>
        </div>
      ) : (
        <UnderConstruction />
      )}
    </div>
  );
}
