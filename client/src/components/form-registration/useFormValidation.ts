import type { BaseAuth, FormData, FormValidationErrors } from "./types";

// =========================================
// Validation Hook and Functions
// =========================================

export const useFormValidation = () => {
  const validateCommonAuth = (data: BaseAuth): FormValidationErrors => {
    const errors: FormValidationErrors = {};
    if (!((data.firstName ?? "").trim())) errors.firstName = "First name is required.";
    if (!((data.lastName ?? "").trim())) errors.lastName = "Last name is required.";
    const email = (data.email ?? "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
    if ((data.password ?? "").length < 6) errors.password = "Password must be at least 6 characters.";
    if ((data.password ?? "") !== (data.confirmPassword ?? "")) errors.confirmPassword = "Passwords do not match.";
    return errors;
  };

  const validateHomeowner = (data: Extract<FormData, { userType: "ownerHome" }>): FormValidationErrors => {
    const errors = validateCommonAuth(data);
    // Más flexible: acepta números con espacios, guiones, paréntesis, y opcionalmente el +
    if (!/^[\+]?[(]?[\d\s\-\(\)]{7,}$/.test(data.phone || "")) errors.phone = "Enter a valid phone number.";
    return errors;
  };

  const validateContractorStep0 = (data: Extract<FormData, { userType: "contractor" }>): FormValidationErrors => {
    const errors = validateCommonAuth(data);
    if (!/^[+]?\d[\d\s-]{6,}$/.test(data.phone || "")) errors.phone = "Enter a valid phone number.";
    if (!data.role_ids || data.role_ids.length === 0) errors.role_ids = "Select at least one role.";
    if (data.role_ids && data.role_ids.length > 2) errors.role_ids = "You can select maximum 2 roles.";
    return errors;
  };

  const validateContractorStep1 = (data: Extract<FormData, { userType: "contractor" }>): FormValidationErrors => {
    const errors: FormValidationErrors = {};
    if (!data.company.trim()) errors.company = "Company name is required.";
    if (!data.licenseNumber.trim()) errors.licenseNumber = "License number is required.";
    if (data.yearsOfExperience && !/^\d{1,2}$/.test(data.yearsOfExperience)) errors.yearsOfExperience = "Years must be 0–99.";
    return errors;
  };

  const validateForm = (formData: FormData, userType: "ownerHome" | "contractor"): FormValidationErrors => {
    if (userType === "ownerHome") {
      return validateHomeowner(formData as Extract<FormData, { userType: "ownerHome" }>);
    } else {
      const contractorData = formData as Extract<FormData, { userType: "contractor" }>;
      return {
        ...validateContractorStep0(contractorData),
        ...validateContractorStep1(contractorData),
      };
    }
  };

  const isFormMinimallyValid = (formData: FormData, userType: "ownerHome" | "contractor"): boolean => {
    if (userType === "ownerHome") {
      const errors = validateHomeowner(formData as Extract<FormData, { userType: "ownerHome" }>);
      return Object.keys(errors).length === 0;
    } else {
      const contractorData = formData as Extract<FormData, { userType: "contractor" }>;
      const errors = validateContractorStep0(contractorData);
      return Object.keys(errors).length === 0;
    }
  };

  return {
    validateCommonAuth,
    validateHomeowner,
    validateContractorStep0,
    validateContractorStep1,
    validateForm,
    isFormMinimallyValid,
  };
};