import type { IAcademic } from "./IAcademicTraining";
import type { ITechnicalSkill } from "./ITechnicalSkill";
import type { IWorkExperience } from "./IWorkExperience";
import type { IWorkReference } from "./IWorkReference";

export interface IProfile {
  id: any;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string | null;
  ci: string;
  registration_code: string;
  address: string;
  mobile_number: string;
  phone_number: string | null;
  college_affiliation_date: string;
  linkedin_url: string | null;
  portfolio_url: string | null;
  professional_summary: string | null;
  travel_availability: boolean;
  has_driving_license: boolean;
  driving_license_category: string | null;
  edit_profile: boolean;
  role_name?: string | null;
  academics: IAcademic[];
  skills: ITechnicalSkill[];
  experiences: IWorkExperience[];
  references: IWorkReference[];
}

export interface IProfileRequest {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
}

export interface IPersonalInformationRequest {
  address: string;
  ci: string;
  mobile_number: string;
  phone_number?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  professional_summary?: string | null;
  travel_availability: boolean;
  has_driving_license: boolean;
  driving_license_category?: string | null;
}

export interface IProfileResponse {
  data: {
    user: IProfile;
  }; 
}