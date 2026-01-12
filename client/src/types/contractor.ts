export type Maybe<T> = T | null | undefined;

// --- NUEVAS INTERFACES (AGREGADAS) ---

export interface TeamMember {
  id: number;
  name: string;
  role?: string | null;
  photo_url?: string | null;
  // Agregamos esto para soportar cuando la foto viene del usuario vinculado
  user?: {
    profile_photo_url?: string | null;
  };
}

export interface ContractorJob {
  id: number;
  title: string;
  description?: string | null;
  budget?: number | string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// -------------------------------------

export interface Profession {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface AcademicTraining {
  id?: number;
  title?: string;
  institution?: string;
  degree?: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
}

export interface WorkExperience {
  id?: number;
  company_name?: string;
  position?: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
}

export interface TechnicalSkill {
  id?: number;
  type?: string;
  name?: string;
  level?: string;
  description?: string | null;
}

export interface WorkReference {
  id?: number;
  name?: string;
  company_name?: string;
  position?: string;
  phone?: string;
  email?: string;
  notes?: string | null;
}

export interface ContractorRole {
  id?: number;
  name?: string;
  guard_name?: string;
}

export interface ContractorUser {
  id?: number;
  avatar?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  ci?: string;
  registration_code?: string;
  mobile_number?: string;
  phone_number?: string;
  edit_profile?: boolean;
  verification?: boolean;
  roles?: ContractorRole[];
  role_id?: number;
  role_name?: string;
  academic_trainings?: AcademicTraining[];
  work_experiences?: WorkExperience[];
  technical_skills?: TechnicalSkill[];
  work_references?: WorkReference[];
  professions?: Profession[];
}

export interface CompanyInfo {
  company_name?: string;
  license_number?: string;
  is_insured?: boolean;
  service_area?: string;
  average_rating?: string | number;
}

export interface AddressInfo {
  preferred_zip?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_code?: string;
  country_code?: string;
  full_address?: string;
}

export interface LocationInfo {
  lat?: number | string;
  lng?: number | string;
  distance_km?: number | string;
}

export interface ContactInfo {
  mobile_number?: string;
  phone_number?: string;
  linkedin_url?: string;
  portfolio_url?: string;
}

export interface ProfessionalInfo {
  has_driving_license?: boolean;
  driving_license_category?: string;
}

export interface ContractInfo {
  affiliation_date?: string;
  approval_date?: string;
  contract_status?: string;
  status_label?: string;
  is_approved?: boolean;
  is_pending?: boolean;
  is_rejected?: boolean;
  is_suspended?: boolean;
}

export interface TimestampInfo {
  created_at?: string;
  updated_at?: string;
}

export interface ContractorFullInfo {
  user_id: number;
  name?: string;
  avatar?: string;
  elite?: boolean;
  rating?: number | string;
  reviews_count?: number;
  bio?: string | null;
  cv_url?: string | null;
  cvUrl?: string | null;
  company_info?: CompanyInfo;
  address?: AddressInfo;
  location?: LocationInfo;
  contact?: ContactInfo;
  professional?: ProfessionalInfo;
  contract?: ContractInfo;
  timestamps?: TimestampInfo;
  professions?: Profession[];
  tags?: Tag[];
  user?: ContractorUser;

  // --- CAMPOS NUEVOS AGREGADOS ---
  team_members?: TeamMember[];
  jobs?: ContractorJob[];
}

export interface NearbyContractorCard {
  id: string;
  name: string;
  avatar?: string | null;
  rating?: number;
  serviceArea?: string;
  distanceKm?: number;
  professions?: string[];
}