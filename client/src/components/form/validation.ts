import type { BaseAuth, FormData, UserType } from "./types";

// ===================== Validation Functions =====================
export const validateCommonAuth = (data: BaseAuth) => {
  const e: Record<string, string> = {};
  if (!data.fullName.trim()) e.fullName = "Full name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email address.";
  if (data.password.length < 6) e.password = "Password must be at least 6 characters.";
  if (data.password !== data.confirmPassword) e.confirmPassword = "Passwords do not match.";
  return e;
};

export const validateHomeowner = (data: Extract<FormData, { userType: "ownerHome" }>) => {
  const e = validateCommonAuth(data);
  if (!data.address.trim()) e.address = "Address is required.";
  return e;
};

export const validateContractorStep0 = (data: Extract<FormData, { userType: "contractor" }>) => {
  const e = validateCommonAuth(data);
  if (!/^[+]?\d[\d\s-]{6,}$/.test(data.phone || "")) e.phone = "Enter a valid phone number.";
  if (!data.role_ids || data.role_ids.length === 0) e.role_ids = "Please select at least one professional role.";
  if (data.role_ids && data.role_ids.length > 2) e.role_ids = "You can select maximum 2 roles.";
  return e;
};

export const validateContractorStep1 = (data: Extract<FormData, { userType: "contractor" }>) => {
  const e: Record<string, string> = {};
  if (!data.company.trim()) e.company = "Company name is required.";
  if (!data.licenseNumber.trim()) e.licenseNumber = "License number is required.";
  if (data.yearsOfExperience && !/^\d{1,2}$/.test(data.yearsOfExperience))
    e.yearsOfExperience = "Years must be a number (0-99).";
  return e;
};

export const validateForm = (userType: UserType, formData: FormData) => {
  let v: Record<string, string> = {};
  
  if (userType === "ownerHome") {
    v = validateHomeowner(formData as Extract<FormData, { userType: "ownerHome" }>);
  } else {
    // contractor must validate both steps on final submit
    v = {
      ...validateContractorStep0(formData as Extract<FormData, { userType: "contractor" }>),
      ...validateContractorStep1(formData as Extract<FormData, { userType: "contractor" }>),
    };
  }
  
  return v;
};