// Dashboard Types

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: string;
  bgColor: string;
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
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
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