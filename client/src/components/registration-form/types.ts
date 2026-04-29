import type {
  FormData,
  UserType,
  FormValidationErrors,
} from "../form-registration/types";

export interface RegistrationFormProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

export interface FormHeaderProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

export interface FormCardProps {
  userType: UserType;
  formData: FormData;
  errors: FormValidationErrors;
  submitted: boolean;
  loading: boolean;
  step: number;
  isFormMinimallyValid: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleMultiSelectChange: (name: string, value: number[]) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  // Email verification props
  emailSent?: boolean;
  showEmailVerification: boolean;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  verificationError: string;
  sendVerificationEmail: (email: string) => void;
  onGoBackToForm: () => void;
  onConfirmEmail: () => void;
}

export interface LoadingOverlayProps {
  loading: boolean;
}

export interface ProgressSectionProps {
  userType: UserType;
  step: number;
  contractorSteps: string[];
}

export interface FormSectionProps {
  userType: UserType;
  formData: FormData;
  errors: FormValidationErrors;
  submitted: boolean;
  loading: boolean;
  step: number;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleMultiSelectChange: (name: string, value: number[]) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  // Email verification props
  showEmailVerification?: boolean;
  verificationCode?: string;
  setVerificationCode?: (code: string) => void;
  verificationError?: string;
  emailSent?: boolean;
  sendVerificationEmail?: (email: string) => void;
  onGoBackToForm?: () => void;
  onConfirmEmail?: () => void;
}

export interface FormFooterProps {
  userType: UserType;
  loading: boolean;
  isFormMinimallyValid: boolean;
}

export interface SuccessToastProps {
  submitted: boolean;
  errors: FormValidationErrors;
  loading: boolean;
}

export interface UserTypeSelectorProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
}
