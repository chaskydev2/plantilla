// =========================================
// Form Registration Module Exports
// =========================================

// Components
export { default as ErrorText } from "./ErrorText";
export { default as Stepper } from "./Stepper";
export { default as PasswordInput } from "./PasswordInput";
export { default as MultiSelectField } from "./MultiSelectField";
export { default as HomeownerForm } from "./HomeownerForm";
export { default as ContractorForm } from "./ContractorForm";

// Types
export type {
  FormData,
  UserType,
  BaseAuth,
  HomeownerFields,
  ContractorFields,
  MultiSelectOption,
  MultiSelectFieldProps,
  PasswordInputProps,
  StepperProps,
  ErrorTextProps,
  FormValidationErrors,
} from "./types";

// Utils and Constants
export {
  cn,
  fieldCls,
  labelCls,
  helpMuted,
  borderPrimary,
  initialBaseAuth,
  initialHomeowner,
  initialContractor,
  rolesData,
} from "./utils";

// Validation Hook
export { useFormValidation } from "./useFormValidation";