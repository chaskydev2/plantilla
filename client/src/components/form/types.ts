// ===================== Types =====================
export interface BaseAuth {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type UserType = "ownerHome" | "contractor";

export interface HomeownerFields {
  address: string;
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

// ===================== Initial State =====================
export const initialBaseAuth: BaseAuth = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const initialHomeowner: FormData = {
  ...initialBaseAuth,
  userType: "ownerHome",
  address: "",
};

export const initialContractor: FormData = {
  ...initialBaseAuth,
  userType: "contractor",
  phone: "",
  company: "",
  licenseNumber: "",
  services: "",
  yearsOfExperience: "",
  portfolioUrl: "",
  role_ids: [],
};

// ===================== Mock Data =====================
export const rolesData = {
  data: {
    roles: [
      { id: 1, name: "Plumber" },
      { id: 2, name: "Electrician" },
      { id: 3, name: "Carpenter" },
      { id: 4, name: "Painter" },
      { id: 5, name: "HVAC Technician" },
      { id: 6, name: "Landscaper" },
      { id: 7, name: "Roofer" },
      { id: 8, name: "General Contractor" },
    ]
  }
};