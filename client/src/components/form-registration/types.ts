// =========================================
// Form Types and Interfaces
// =========================================

export interface MultiSelectOption {
  id: number;
  name: string;
}

export interface BaseAuth {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type UserType = "ownerHome" | "contractor";

export interface HomeownerFields {
  phone: string;
}

export interface ContractorFields {
  phone: string;
  company: string;
  licenseNumber: string;
  services: string;
  yearsOfExperience: string;
  portfolioUrl?: string;
  role_ids: number[];
}

export type FormData =
  | (BaseAuth & { userType: "ownerHome" } & HomeownerFields)
  | (BaseAuth & { userType: "contractor" } & ContractorFields);

export interface MultiSelectFieldProps {
  name: string;
  value: number[];
  onChange: (name: string, value: number[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  maxSelections?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface StepperProps {
  steps: string[];
  current: number;
}

export interface ErrorTextProps {
  msg?: string;
}

export interface FormValidationErrors {
  [key: string]: string;
}