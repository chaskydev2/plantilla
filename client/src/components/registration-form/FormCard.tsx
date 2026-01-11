import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FormCardProps } from "./types";
import { borderPrimary } from "../form-registration";
import LoadingOverlay from "./LoadingOverlay";
import ProgressSection from "./ProgressSection";
import FormSection from "./FormSection";
import FormFooter from "./FormFooter";
import SuccessToast from "./SuccessToast";

// ✅ Asegúrate de que la ruta sea correcta en tu proyecto
import EmailVerification from "./EmailVerification";

const FormCard: React.FC<FormCardProps> = ({
  userType,
  formData,
  errors,
  submitted,
  loading,
  step,
  isFormMinimallyValid,
  handleChange,
  handleMultiSelectChange,
  handleNext,
  handlePrev,
  handleSubmit,

  showEmailVerification,
  verificationCode,
  setVerificationCode,
  verificationError,
  sendVerificationEmail,
  onGoBackToForm,

  onConfirmEmail, // ✅ tu handler para confirmar el código (y completar registro)
}) => {
  const contractorSteps = ["Account", "Company"];

  // ✅ Cerrar modal con ESC
  useEffect(() => {
    if (!showEmailVerification) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onGoBackToForm?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showEmailVerification, onGoBackToForm]);

  return (
    <motion.form
      id="register-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-6xl mx-auto mt-8 px-6 md:px-8"
    >
      {/* ✅ MODAL Email Verification */}
      <AnimatePresence>
        {showEmailVerification && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onGoBackToForm?.()} // click fuera cierra
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()} // evita cerrar al click dentro
              role="dialog"
              aria-modal="true"
            >
              <EmailVerification
                email={formData.email}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                verificationError={verificationError}
                loading={loading}
                onResendEmail={() => sendVerificationEmail(formData.email)}
                onGoBack={() => onGoBackToForm?.()}
                onConfirm={() => onConfirmEmail?.()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative rounded-2xl border p-6 md:p-10 shadow-sm"
        style={{ background: "white", ...borderPrimary }}
      >
        <LoadingOverlay loading={loading} />

        <ProgressSection
          userType={userType}
          step={step}
          contractorSteps={contractorSteps}
        />

        <div
          className="h-[1px] w-full mb-8"
          style={{ background: "rgba(0,0,0,0.06)" }}
        />

        <FormSection
          userType={userType}
          formData={formData}
          errors={errors}
          submitted={submitted}
          loading={loading}
          step={step}
          handleChange={handleChange}
          handleMultiSelectChange={handleMultiSelectChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleSubmit={handleSubmit}
          showEmailVerification={showEmailVerification}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          verificationError={verificationError}
          sendVerificationEmail={sendVerificationEmail}
          onGoBackToForm={onGoBackToForm}
          onConfirmEmail={onConfirmEmail}
        />

        {/* ✅ Evita interacciones debajo del modal */}
        {!showEmailVerification && (
          <FormFooter
            userType={userType}
            loading={loading}
            isFormMinimallyValid={isFormMinimallyValid}
            onGoBack={onGoBackToForm || (() => {})}
          />
        )}

        <SuccessToast submitted={submitted} errors={errors} loading={loading} />
      </div>
    </motion.form>
  );
};

export default FormCard;
