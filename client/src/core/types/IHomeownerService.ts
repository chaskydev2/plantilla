import type { IService } from './IService';
import type { IHomeownerProfile } from './IHomeowner';

export interface IHomeownerServicePivot {
  homeowner_profile_id: number;
  service_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface IHomeownerServiceLink {
  id?: number;
  service_id?: number;
  homeowner_profile_id?: number;
  name?: string;
  slug?: string;
  icon?: string | null;
  image?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  pivot?: IHomeownerServicePivot;
  service?: IService;
  homeowner_profile?: IHomeownerProfile;
}
