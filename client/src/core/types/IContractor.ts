import type { IUserResponse } from './IUser';

export interface ICompanyInfo {
  company_name: string;
  license_number: string;
  is_insured: boolean;
  service_area: string;
  average_rating: number;
}

export interface IAddress {
  preferred_zip?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_code?: string;
  country_code: string;
  full_address?: string;
}

export interface ILocation {
  lat?: number;
  lng?: number;
}

export interface IContact {
  mobile_number?: string;
  phone_number?: string;
  linkedin_url?: string;
  portfolio_url?: string;
}

export interface IProfessional {
  has_driving_license: boolean;
  driving_license_category?: string;
}

export interface IContract {
  affiliation_date?: string;
  approval_date?: string;
  contract_status: ContractStatus;
  status_label: string;
  is_approved: boolean;
  is_pending: boolean;
  is_rejected: boolean;
  is_suspended: boolean;
}

export interface ITimestamps {
  created_at?: string;
  updated_at?: string;
}

export const ContractStatus = {
  PENDING: 'pendiente',
  APPROVED: 'aprobado', 
  REJECTED: 'rechazado',
  SUSPENDED: 'suspendido'
} as const;

export const ContractStatusLabels = {
  [ContractStatus.PENDING]: 'Pendiente',
  [ContractStatus.APPROVED]: 'Aprobado',
  [ContractStatus.REJECTED]: 'Rechazado',
  [ContractStatus.SUSPENDED]: 'Suspendido'
} as const;

export type ContractStatus = typeof ContractStatus[keyof typeof ContractStatus];

export interface IContractor {
  user_id: number;
  user?: IUserResponse;
  company_info: ICompanyInfo;
  address: IAddress;
  location: ILocation;
  contact: IContact;
  professional: IProfessional;
  contract: IContract;
  timestamps: ITimestamps;
}

export interface IContractorForm {
  user_id: number;
  preferred_zip?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  company_name: string;
  license_number: string;
  is_insured: boolean;
  service_area: string;
  average_rating: number;
  state_code?: string;
  country_code: string;
  lat?: number;
  lng?: number;
  mobile_number?: string;
  phone_number?: string;
  has_driving_license: boolean;
  driving_license_category?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  affiliation_date?: string;
  approval_date?: string;
  contract_status: ContractStatus;
}

export interface IContractorStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
  new_this_month: number;
}

export interface IContractorFilters {
  search?: string;
  status?: ContractStatus;
  state_code?: string;
  is_insured?: boolean;
  has_driving_license?: boolean;
  min_rating?: number;
  sort_by?: 'name' | 'company_name' | 'rating' | 'affiliation_date' | 'approval_date';
  sort_direction?: 'asc' | 'desc';
}