import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import type { FormData, UserType, FormValidationErrors } from "../form-registration/types";
import { initialHomeowner, initialContractor, useFormValidation } from "../form-registration";
import { AuthService } from "../../core/services/auth/auth.service";
import { ProfessionService } from "../../core/services/profession/profession.service";
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

  const saveAuthData = useCallback(
    (responseData: any) => {
      localStorage.setItem(variables.session.tokenName, responseData.access_token);
      localStorage.setItem(variables.session.userData, JSON.stringify(responseData.user));
      localStorage.setItem(variables.session.userRoles, JSON.stringify(responseData.roles || []));
      localStorage.setItem(variables.session.userPermissions, JSON.stringify(responseData.permissions || []));

      dispatch({
        type: "auth/login/fulfilled",
        payload: {
          user: responseData.user,
          permissions: responseData.permissions || [],
          roles: responseData.roles || [],
        },
      });
    },
    [dispatch]
  );

  const resetVerificationStates = useCallback(() => {
    setShowEmailVerification(false);
    setVerificationCode("");
    setGeneratedCode("");
    setEmailSent(false);
    setVerificationError("");
  }, []);

  const handleRegistrationSuccess = useCallback(
    async (response: any, userTypeName: string) => {
      try {
        const data = response?.data ?? response;

        console.log(`${userTypeName} registration response:`, response);
        console.log(`${userTypeName} registration data:`, data);

        if (data?.access_token) {
          saveAuthData(data);
          toastify.success("¡Registro exitoso! Bienvenido a nuestra plataforma.");
          resetVerificationStates();

          setTimeout(() => {
            window.location.href = "/admin";
          }, 1000);
          return;
        }

        throw new Error("No access token received");
      } catch (error) {
        console.error(`❌ ${userTypeName} registration success handler error:`, error);
        toastify.error("Error al procesar el registro. Intenta nuevamente.");
      }
    },
    [saveAuthData, resetVerificationStates]
  );

  const handleRegistrationError = useCallback((err: any) => {
    console.error("❌ Registration error:", err);

    if (err.response?.data?.errors) {
      const apiErrors: FormValidationErrors = {};
      const fieldMap: { [key: string]: string } = {
        first_name: "firstName",
        last_name: "lastName",
        phone: "phone",
        email: "email",
        password: "password",
        company: "company",
        license_number: "licenseNumber",
      };

      Object.keys(err.response.data.errors).forEach((field) => {
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

  useEffect(() => {
    setErrors({});
    setSubmitted(false);
    setStep(0);
    resetVerificationStates();
    setFormData(userType === "ownerHome" ? initialHomeowner : initialContractor);
  }, [userType, resetVerificationStates]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({ ...prev, [name]: value }));

      setErrors((prev) => {
        if (!prev[name]) return prev;
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    },
    []
  );

  const handleMultiSelectChange = useCallback((name: string, value: number[]) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  useEffect(() => {
    if (!submitted) return;
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
    if (el) el.focus();
  }, [errors, submitted]);

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

  const generateVerificationCode = useCallback(() => {
    const code = "000000";
    setGeneratedCode(code);
    return code;
  }, []);

  const sendVerificationEmail = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        const code = generateVerificationCode();

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setEmailSent(true);
        toastify.success(`Código de verificación enviado a ${email}. Usa: ${code}`);
      } catch (error) {
        console.error("❌ Error sending email:", error);
        toastify.error("Error al enviar el código de verificación");
      } finally {
        setLoading(false);
      }
    },
    [generateVerificationCode]
  );

  const verifyEmailCode = useCallback(
    (inputCode: string) => {
      const clean = (inputCode || "").trim();

      if (clean === generatedCode || clean === "000000") {
        setVerificationError("");
        return true;
      }

      setVerificationError("Código de verificación inválido. Usa: 000000");
      return false;
    },
    [generatedCode]
  );

  const goBackToForm = useCallback(() => {
    resetVerificationStates();
  }, [resetVerificationStates]);

  const isFormMinimallyValid = useMemo(
    () => validation.isFormMinimallyValid(formData, userType),
    [formData, userType, validation]
  );

  // 🏠 HOMEOWNER
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

  // 👷 CONTRACTOR
  const registerContractor = useCallback(async () => {
    const contractorData = formData as Extract<FormData, { userType: "contractor" }>;

    let professionsSelected: Array<{ id: number; name?: string }> = [];
    try {
      const profRes = await ProfessionService.getAll();
      const allProfessions: any[] = profRes.success && profRes.data ? profRes.data : [];
      professionsSelected = (contractorData.role_ids || []).map((id: number) => {
        const found = allProfessions.find((p) => p.id === id);
        return found ? { id: found.id, name: found.name } : { id, name: undefined };
      });
    } catch (err) {
      professionsSelected = (contractorData.role_ids || []).map((id: number) => ({ id }));
      console.error("Error fetching professions for payload:", err);
    }

    const payload = {
      first_name: contractorData.firstName,
      last_name: contractorData.lastName,
      email: contractorData.email,
      phone: contractorData.phone,
      password: contractorData.password,

      company_name: contractorData.company || "Company Name",
      business_name: contractorData.company || "Company Name",
      service_area: contractorData.services || "General Services",
      years_of_experience: parseInt(contractorData.yearsOfExperience) || 0,
      description: contractorData.services || "General Services",

      hourly_rate: null,
      location: null,
      availability: null,

      categories: contractorData.role_ids || [],
      professions: professionsSelected,

      verification_code: generatedCode || "000000",

      portfolio_url: contractorData.portfolioUrl || null,
      license_number: contractorData.licenseNumber || "LICENSE-001",

      country_code: "BO",
      contract_status: "pendiente",
      is_insured: false,
      has_driving_license: false,
      average_rating: 0,
    };

    console.log("📤 Sending contractor registration payload:", payload);

    const response = await AuthService.registerContractor(payload);
    await handleRegistrationSuccess(response, "Contractor");
  }, [formData, handleRegistrationSuccess, generatedCode]);

  // ✅ BOTÓN DEL MODAL: verifica y registra
  const confirmEmailAndRegister = useCallback(async () => {
    if (!verifyEmailCode(verificationCode)) return;

    setLoading(true);
    try {
      if (userType === "ownerHome") {
        await registerHomeowner();
      } else {
        await registerContractor();
      }
    } catch (err) {
      handleRegistrationError(err);
    } finally {
      setLoading(false);
    }
  }, [
    verifyEmailCode,
    verificationCode,
    userType,
    registerHomeowner,
    registerContractor,
    handleRegistrationError,
  ]);

  // ✅ SUBMIT PRINCIPAL: solo abre el modal y manda el código
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);

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

      // ✅ ahora aplica a AMBOS: ownerHome y contractor
      if (!showEmailVerification) {
        setShowEmailVerification(true);
        await sendVerificationEmail((formData as any).email);
        return;
      }

      // Si ya está el modal abierto, NO registramos aquí.
      // El registro lo dispara el botón "Verify & Continue" del modal.
      return;
    },
    [formData, userType, validation, showEmailVerification, sendVerificationEmail]
  );

  return useMemo(
    () => ({
      userType,
      setUserType,
      formData,
      errors,
      submitted,
      loading,
      step,
      isFormMinimallyValid,

      showEmailVerification,
      verificationCode,
      setVerificationCode,
      verificationError,
      emailSent,

      handleChange,
      handleMultiSelectChange,
      handleNext,
      handlePrev,
      handleSubmit,
      sendVerificationEmail,
      goBackToForm,

      // ✅ nuevo para el modal
      confirmEmailAndRegister,
    }),
    [
      userType,
      formData,
      errors,
      submitted,
      loading,
      step,
      isFormMinimallyValid,
      showEmailVerification,
      verificationCode,
      verificationError,
      emailSent,
      handleChange,
      handleMultiSelectChange,
      handleNext,
      handlePrev,
      handleSubmit,
      sendVerificationEmail,
      goBackToForm,
      confirmEmailAndRegister,
    ]
  );
};