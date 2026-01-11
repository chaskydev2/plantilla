import React from "react";
import type { FormSectionProps } from "./types";
import { HomeownerForm, ContractorForm } from "../form-registration";
import type { FormData } from "../form-registration/types";

const FormSection: React.FC<FormSectionProps> = ({
  userType,
  formData,
  errors,
  submitted,
  loading,
  step,
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
  onConfirmEmail,
}) => {
  // ✅ defaults para evitar undefined (porque en types.ts son opcionales)
  const safeShowEmailVerification = !!showEmailVerification;
  const safeVerificationCode = verificationCode ?? "";
  const safeSetVerificationCode = setVerificationCode ?? (() => {});
  const safeVerificationError = verificationError ?? "";
  const safeSendVerificationEmail = sendVerificationEmail ?? (() => {});
  const safeOnGoBackToForm = onGoBackToForm ?? (() => {});
  const safeOnConfirmEmail = onConfirmEmail ?? (() => {});

  return (
    <>
      {userType === "ownerHome" ? (
        <HomeownerForm
          formData={formData as Extract<FormData, { userType: "ownerHome" }>}
          errors={errors}
          submitted={submitted}
          handleChange={handleChange}
          showEmailVerification={safeShowEmailVerification}
          verificationCode={safeVerificationCode}
          setVerificationCode={safeSetVerificationCode}
          verificationError={safeVerificationError}
          loading={!!loading}
          sendVerificationEmail={safeSendVerificationEmail}
          onGoBackToForm={safeOnGoBackToForm}
          // onConfirmEmail={safeOnConfirmEmail}
          onConfirmEmail={() => {
            console.log("🔥 FormSection onConfirmEmail fired");
            onConfirmEmail?.();
          }}
        />
      ) : (
        <ContractorForm
          formData={formData as Extract<FormData, { userType: "contractor" }>}
          errors={errors}
          submitted={submitted}
          loading={!!loading}
          step={step}
          handleChange={handleChange}
          handleMultiSelectChange={handleMultiSelectChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default FormSection;
