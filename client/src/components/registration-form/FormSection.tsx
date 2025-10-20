import React from "react";
import type { FormSectionProps } from "./types";
import { HomeownerForm, ContractorForm } from "../form-registration";

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
  // Email verification props
  showEmailVerification,
  verificationCode,
  setVerificationCode,
  verificationError,

  sendVerificationEmail,
  onGoBackToForm,
}) => {
  return (
    <>
      {userType === "ownerHome" ? (
        <HomeownerForm
          formData={formData as Extract<FormSectionProps['formData'], { userType: "ownerHome" }>}
          errors={errors}
          submitted={submitted}
          handleChange={handleChange}
          showEmailVerification={showEmailVerification}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          verificationError={verificationError}

          loading={loading}
          sendVerificationEmail={sendVerificationEmail}
          onGoBackToForm={onGoBackToForm}
        />
      ) : (
        <ContractorForm
          formData={formData as Extract<FormSectionProps['formData'], { userType: "contractor" }>}
          errors={errors}
          submitted={submitted}
          loading={loading}
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