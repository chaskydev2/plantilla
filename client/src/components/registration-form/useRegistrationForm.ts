import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import type { FormData, UserType, FormValidationErrors } from "../form-registration/types";
import { 
  initialHomeowner, 
  initialContractor, 
  useFormValidation 
} from "../form-registration";
import { AuthService } from "../../core/services/auth/auth.service";
import variables from "../../core/config/variables";
import type { AppDispatch } from "../../store";
import { toastify } from "../../core/utils/toastify";

export const useRegistrationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [userType, setUserType] = useState<UserType>("ownerHome");
  const [formData, setFormData] = useState<FormData>(initialHomeowner);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  
  // Email verification states
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const validation = useFormValidation();

  // 🔧 HELPER FUNCTIONS - Mejores prácticas
  
  /**
   * Guarda los datos de autenticación en localStorage y Redux
   */
  const saveAuthData = useCallback((responseData: any) => {
    try {
      // 1️⃣ Guardar en localStorage (persistencia)
      localStorage.setItem(variables.session.tokenName, responseData.access_token);
      localStorage.setItem(variables.session.userData, JSON.stringify(responseData.user));
      localStorage.setItem(variables.session.userRoles, JSON.stringify(responseData.roles || []));
      localStorage.setItem(variables.session.userPermissions, JSON.stringify(responseData.permissions || []));
      
      // 2️⃣ Actualizar estado de Redux
      dispatch({
        type: 'auth/login/fulfilled',
        payload: {
          user: responseData.user,
          permissions: responseData.permissions || [],
          roles: responseData.roles || []
        }
      });
      
      console.log("✅ Auth data saved successfully");
    } catch (error) {
      console.error("❌ Error saving auth data:", error);
      throw new Error("Failed to save authentication data");
    }
  }, [dispatch]);

  /**
   * Resetea los estados de verificación de email
   */
  const resetVerificationStates = useCallback(() => {
    setShowEmailVerification(false);
    setVerificationCode("");
    setGeneratedCode("");
    setEmailSent(false);
    setVerificationError("");
  }, []);

  /**
   * Maneja el éxito del registro
   */
  const handleRegistrationSuccess = useCallback(async (response: any, userTypeName: string) => {
    try {
      console.log(`${userTypeName} registration response:`, response);
      
      if (response.data.access_token) {
        await saveAuthData(response.data);
        toastify.success(`¡Registro exitoso! Bienvenido a nuestra plataforma.`);
        resetVerificationStates();
        
        // 🔄 Redirigir al dashboard
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      console.error(`❌ ${userTypeName} registration success handler error:`, error);
      toastify.error("Error al procesar el registro. Intenta nuevamente.");
    }
  }, [saveAuthData, resetVerificationStates]);

  /**
   * Maneja errores de registro con mejor UX
   */
  const handleRegistrationError = useCallback((err: any) => {
    console.error("❌ Registration error:", err);
    
    if (err.response?.data?.errors) {
      // Errores de validación de Laravel
      const apiErrors: FormValidationErrors = {};
      const fieldMap: { [key: string]: string } = {
        'first_name': 'firstName',
        'last_name': 'lastName',
        'phone': 'phone',
        'email': 'email',
        'password': 'password',
        'company': 'company',
        'license_number': 'licenseNumber'
      };
      
      Object.keys(err.response.data.errors).forEach(field => {
        const formField = fieldMap[field] || field;
        apiErrors[formField] = err.response.data.errors[field][0];
      });
      
      setErrors(apiErrors);
      toastify.error("Por favor corrige los errores en el formulario.");
      
    } else if (err.response?.data?.message) {
      toastify.error(`Error en el registro: ${err.response.data.message}`);
    } else {
      toastify.error("Algo salió mal. Por favor intenta nuevamente.");
    }
  }, []);

  // Reset form when user type changes
  useEffect(() => {
    setErrors({});
    setSubmitted(false);
    setStep(0);
    resetVerificationStates();
    setFormData(userType === "ownerHome" ? initialHomeowner : initialContractor);
  }, [userType, resetVerificationStates]);

  // 🎯 OPTIMIZED HANDLERS
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario escriba
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleMultiSelectChange = useCallback((name: string, value: number[]) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // When there are errors after submit, focus first error
  useEffect(() => {
    if (!submitted) return;
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
    if (el) el.focus();
  }, [errors, submitted]);

  // 🚀 NAVIGATION & VALIDATION
  
  const handleNext = useCallback(() => {
    if (userType === "contractor") {
      const errs = validation.validateContractorStep0(formData as Extract<FormData, { userType: "contractor" }>);
      setErrors(errs);
      setSubmitted(true);
      if (Object.keys(errs).length === 0) setStep(1);
    }
  }, [userType, formData, validation]);

  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  // 📧 EMAIL VERIFICATION OPTIMIZED - Código fijo 00000
  
  const generateVerificationCode = useCallback(() => {
    // 🚧 DESARROLLO: Código fijo para facilitar testing
    const code = "00000";
    setGeneratedCode(code);
    return code;
  }, []);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const code = generateVerificationCode();
      
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      
      // Para testing - código fijo 00000
      console.log(`📧 Verification code sent to ${email}: ${code}`);
      toastify.success(`Código de verificación enviado a ${email}. Usa: ${code}`);
      
    } catch (error) {
      console.error("❌ Error sending email:", error);
      toastify.error("Error al enviar el código de verificación");
    } finally {
      setLoading(false);
    }
  }, [generateVerificationCode]);

  const verifyEmailCode = useCallback((inputCode: string) => {
    // 🚧 DESARROLLO: Acepta tanto el código generado como 00000
    if (inputCode === generatedCode || inputCode === "00000") {
      setVerificationError("");
      return true;
    } else {
      setVerificationError("Código de verificación inválido. Usa: 00000");
      return false;
    }
  }, [generatedCode]);

  const goBackToForm = useCallback(() => {
    resetVerificationStates();
  }, [resetVerificationStates]);

  // 🎯 MEMOIZED VALUES
  const isFormMinimallyValid = useMemo(() => 
    validation.isFormMinimallyValid(formData, userType), 
    [formData, userType, validation]
  );

  // 🚀 MAIN SUBMIT HANDLER - Con verificación de email (código 00000)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // 1️⃣ Validación inicial
    const validationErrors = validation.validateForm(formData, userType);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      if (userType === "contractor") {
        const hasStep0Err = ["firstName", "lastName", "email", "password", "confirmPassword", "phone", "role_ids"]
          .some((k) => validationErrors[k]);
        setStep(hasStep0Err ? 0 : 1);
      }
      return;
    }

    // 2️⃣ Manejo de verificación de email para homeowners
    if (userType === "ownerHome" && !showEmailVerification) {
      setShowEmailVerification(true);
      await sendVerificationEmail(formData.email);
      return;
    }

    if (userType === "ownerHome" && showEmailVerification) {
      if (!verifyEmailCode(verificationCode)) {
        return;
      }
    }

    // 3️⃣ Registro del usuario
    setLoading(true);
    
    try {
      if (userType === "ownerHome") {
        await registerHomeowner();
      } else {
        await registerContractor();
      }
    } catch (error) {
      handleRegistrationError(error);
    } finally {
      setLoading(false);
    }
  }, [
    formData, userType, validation, showEmailVerification, verificationCode,
    sendVerificationEmail, verifyEmailCode, handleRegistrationError
  ]);

  // 🏠 HOMEOWNER REGISTRATION
  const registerHomeowner = useCallback(async () => {
    const homeownerData = formData as Extract<FormData, { userType: "ownerHome" }>;
    const payload = {
      first_name: homeownerData.firstName,
      last_name: homeownerData.lastName,
      email: homeownerData.email,
      phone: homeownerData.phone,
      password: homeownerData.password,
    };
    
    const response = await AuthService.registerHomeowner(payload);
    await handleRegistrationSuccess(response, "Homeowner");
  }, [formData, handleRegistrationSuccess]);

  // 👷 CONTRACTOR REGISTRATION  
  const registerContractor = useCallback(async () => {
    const contractorData = formData as Extract<FormData, { userType: "contractor" }>;
    const payload = {
      // User data (matches Laravel User model)
      first_name: contractorData.firstName,
      last_name: contractorData.lastName,
      email: contractorData.email,
      phone: contractorData.phone,
      password: contractorData.password,
      
      // Contractor profile data (based on SQL error, using actual DB column names)
      company_name: contractorData.company || 'Company Name', // Required field with default
      business_name: contractorData.company || 'Company Name', // Sending both to be safe
      service_area: contractorData.services || 'General Services', // Required field mapped from services
      years_of_experience: parseInt(contractorData.yearsOfExperience) || 0,
      description: contractorData.services || 'General Services',
      
      // Optional fields
      hourly_rate: null,
      location: null,
      availability: null,
      
      // Categories and professions 
      categories: contractorData.role_ids || [],
      professions: [],
      
      // Additional contractor fields
      portfolio_url: contractorData.portfolioUrl || null,
      license_number: contractorData.licenseNumber || 'LICENSE-001', // Required with default
      
      // Country and status defaults (based on SQL error pattern)
      country_code: "BO", // Default country
      contract_status: "pendiente", // Default status
      is_insured: false, // Default insurance status
      has_driving_license: false, // Default driving license
      average_rating: 0 // Default rating
    };
    
    console.log("📤 Sending contractor registration payload:", payload);
    
    const response = await AuthService.registerContractor(payload);
    await handleRegistrationSuccess(response, "Contractor");
  }, [formData, handleRegistrationSuccess]);

  // 🐛 DEBUG - Solo en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 Form Debug:", {
        formData,
        userType,
        isFormValid: isFormMinimallyValid,
        errors: userType === "ownerHome" ? validation.validateHomeowner(formData as Extract<FormData, { userType: "ownerHome" }>) : {}
      });
    }
  }, [formData, userType, isFormMinimallyValid, validation]);

  // 📤 OPTIMIZED RETURN - Con verificación de email usando código 00000
  return useMemo(() => ({
    // State
    userType,
    setUserType,
    formData,
    errors,
    submitted,
    loading,
    step,
    isFormMinimallyValid,
    
    // Email verification states
    showEmailVerification,
    verificationCode,
    setVerificationCode,
    verificationError,
    emailSent,
    
    // Handlers
    handleChange,
    handleMultiSelectChange,
    handleNext,
    handlePrev,
    handleSubmit,
    sendVerificationEmail,
    verifyEmailCode,
    goBackToForm,
  }), [
    userType, formData, errors, submitted, loading, step, isFormMinimallyValid,
    showEmailVerification, verificationCode, verificationError, emailSent,
    handleChange, handleMultiSelectChange, handleNext, handlePrev, handleSubmit,
    sendVerificationEmail, verifyEmailCode, goBackToForm
  ]);
};