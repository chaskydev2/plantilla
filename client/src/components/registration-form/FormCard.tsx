import React from "react";
import { motion } from "framer-motion";
import type { FormCardProps } from "./types";
import { borderPrimary } from "../form-registration";
import LoadingOverlay from "./LoadingOverlay";
import ProgressSection from "./ProgressSection";
import FormSection from "./FormSection";
import FormFooter from "./FormFooter";
import SuccessToast from "./SuccessToast";

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
}) => {
  const contractorSteps = ["Account", "Company"];
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-6xl mx-auto mt-8 px-6 md:px-8"
    >
      <div className="relative rounded-2xl border p-6 md:p-10 shadow-sm" style={{ background: "white", ...borderPrimary }}>
        <LoadingOverlay loading={loading} />
        <ProgressSection userType={userType} step={step} contractorSteps={contractorSteps} />
        <div className="h-[1px] w-full mb-8" style={{ background: "rgba(0,0,0,0.06)" }} />
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
        />
       <FormFooter
        userType={userType}
        loading={loading}
        isFormMinimallyValid={isFormMinimallyValid}
        onGoBack={onGoBackToForm || (() => {})}
      >
        {/* children */}
      </FormFooter>
        <SuccessToast submitted={submitted} errors={errors} loading={loading} />
      </div>
    </motion.form>
  );
};

export default FormCard;