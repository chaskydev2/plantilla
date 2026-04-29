// Dashboard Types

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; isPositive: boolean };
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon?: string;
  bgColor?: string;
}

export interface UserItemProps {
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
}

export interface ContractorStats {
  activeJobs: number;
  completedJobs: number;
  totalEarnings: string;
  monthlyEarnings: string;
  averageRating: number;
  totalReviews: number;
}

export interface TeamMember {
  user_id: number;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
  user?: {
    id: number;
    name: string;
    email: string;
  };
  professions?: any[];
}

export interface DashboardStatistics {
  team_members_count: number;
  jobs_count: number;
  total_paid: number;
  average_paid: number;
}

export interface JobSummaryByServiceType {
  service_type: string;
  jobs_count: number;
  total_paid: number;
  avg_paid: number;
}

export interface RecentJob {
  id: number;
  title: string;
  location: string;
  service_type: string;
  amount_paid: number;
  is_active: boolean;
  created_at: string;
  job_date: string;
}

export interface WorkExperience {
  id: number;
  user_id: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface ContractorRequirement {
  id: number;
  contractor_id: number;
  attribute_id: number;
  value: string;
  attribute?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface DashboardData {
  contractor: {
    user_id: number;
    company_name: string;
    service_area: string;
    city: string;
    state_code: string;
    country_code: string;
    lat: number;
    lng: number;
    preferred_zip: string;
    address_line1: string;
    address_line2: string;
  };
  statistics: DashboardStatistics;
  team_members: TeamMember[];
  jobs: RecentJob[];
  jobs_summary: {
    by_service_type: JobSummaryByServiceType[];
  };
  work_experiences: WorkExperience[];
  requirements: ContractorRequirement[];
  professions: any[];
  categories: any[];
}

export interface AdminStats {
  earnings: {
    current: string;
    previous: string;
  };
  newWorkers: number;
  newHomeowners: number;
  activeJobs: number;
  completedJobs: number;
}

export interface User {
  name?: string;
  email?: string;
  avatar?: string;
  [key: string]: any;
}

export interface ContractorDashboardProps {
  user: User;
}