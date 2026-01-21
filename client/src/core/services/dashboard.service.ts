import axios from '@/core/config/axios';

export interface DashboardStats {
  summary: {
    total_users: number;
    total_homeowners: number;
    total_contractors: number;
    total_job_posts: number;
    total_tags: number;
    total_professions: number;
    total_job_contractors: number;
    total_requirements: number;
  };
  requirements: any[];
  job_contractors: any[];
}

export interface DetailedStats {
  user_stats: {
    total: number;
    active: number;
    inactive: number;
  };
  contractor_stats: {
    total: number;
    verified: number;
    unverified: number;
  };
  job_post_stats: {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
}

export const getStats = async (): Promise<DashboardStats> => {
  const res = await axios.get('/v1/dashboard/stats');
  return res.data.data;
};

export const getDetailedStats = async (): Promise<DetailedStats> => {
  const res = await axios.get('/v1/dashboard/detailed-stats');
  return res.data.data;
};

export const getRequirements = async () => {
  const res = await axios.get('/v1/dashboard/requirements');
  return res.data.data;
};

export const getJobContractors = async () => {
  const res = await axios.get('/v1/dashboard/job-contractors');
  return res.data.data;
};

export const DashboardService = {
  getStats,
  getDetailedStats,
  getRequirements,
  getJobContractors,
};
