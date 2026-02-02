import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";
import UserItem from "./UserItem";
import type { UserItemProps } from "@/types/dashboard";
import { DashboardService, type DashboardStats, type DetailedStats } from "@/core/services/dashboard.service";

/**
 * AdminDashboard Component
 * Displays the complete admin dashboard with statistics, charts, and user management
 */
const AdminDashboard = () => {
  const { t } = useTranslation();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, detailedData] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getDetailedStats()
        ]);
        setStats(statsData);
        setDetailedStats(detailedData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const users: UserItemProps[] = [
    { name: "Carlos Martinez", role: "Electrician", avatar: "CM", status: "online" },
    { name: "Ana Rodriguez", role: "Plumber", avatar: "AR", status: "online" },
    { name: "Juan Perez", role: "Carpenter", avatar: "JP", status: "offline" },
    { name: "Maria Garcia", role: "Painter", avatar: "MG", status: "online" },
    { name: "Pedro Lopez", role: "Mason", avatar: "PL", status: "offline" }
  ];

  if (loading || !stats || !detailedStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalUsers = stats.summary.total_homeowners + stats.summary.total_contractors;
  const homeownersPercentage = totalUsers > 0 ? ((stats.summary.total_homeowners / totalUsers) * 100).toFixed(0) : 0;
  const contractorsPercentage = totalUsers > 0 ? ((stats.summary.total_contractors / totalUsers) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title={t("admin.dashboard.newWorkers")}
          value={stats.summary.total_contractors.toLocaleString()}
          change={`Verified: ${detailedStats.contractor_stats.verified}`}
          changeType="increase"
          icon="◐"
          bgColor="bg-slate-600"
        />
        
        <StatCard
          title={t("admin.dashboard.newHomeowners")}
          value={stats.summary.total_homeowners.toLocaleString()}
          change={`Active: ${detailedStats.user_stats.active}`}
          changeType="increase"
          icon="⌂"
          bgColor="bg-stone-600"
        />
        
        <StatCard
          title={t("admin.dashboard.activeJobs")}
          value={detailedStats.job_post_stats.open.toLocaleString()}
          change={`In Progress: ${detailedStats.job_post_stats.in_progress}`}
          changeType="increase"
          icon="⚬"
          bgColor="bg-zinc-600"
        />
      </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Earnings Card */}
        <div className="bg-gray-800 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-300">Platform Statistics</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{stats.summary.total_users}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Users</span>
              <span>Total Jobs</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{stats.summary.total_users}</span>
              <span>{stats.summary.total_job_posts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-slate-700">{stats.summary.total_tags}</div>
          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <span className="mr-1">#</span>
            Total Tags
          </div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-stone-700">{stats.summary.total_users.toLocaleString()}</div>
          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <span className="mr-1">◐</span>
            Total Users
          </div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-zinc-700">{stats.summary.total_job_posts.toLocaleString()}</div>
          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <span className="mr-1">□</span>
            Posted Jobs
          </div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-neutral-700">{stats.summary.total_professions}</div>
          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <span className="mr-1">★</span>
            Professions
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;