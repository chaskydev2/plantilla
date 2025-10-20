import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { FormHeader, FormCard, useRegistrationForm } from "../../components/registration-form";
import ShareToast from '@/components/ShareToast';

// =========================================
// Breadcrumb Component
// =========================================
const Breadcrumb: React.FC = () => (
  <div className="max-w-4xl mx-auto mb-6">
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
      <Link to="/" className="hover:text-[#F5D238] transition-colors duration-200">
        Gu pages
      </Link>
      <ChevronRight className="h-6 w-6" />
      <span className="text-gray-900 font-medium">Registration</span>
    </nav>
    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
  </div>
);

// =========================================
// Main Component
// =========================================
const CertificationRequestForm_SignupStepper: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  
  const {
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

    handleChange,
    handleMultiSelectChange,
    handleNext,
    handlePrev,
    handleSubmit,
    sendVerificationEmail,
    goBackToForm,
  } = useRegistrationForm();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8"  style={{
            background: "var(--color-primary)",
          }}
        >
      <ShareToast showToast={showToast} setShowToast={setShowToast} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" 
       style={{
            background: "var(--color-primary)",
          }}
        >
        <Breadcrumb />
        
          <FormHeader userType={userType} setUserType={setUserType} />
          
          <FormCard
            userType={userType}
            formData={formData}
            errors={errors}
            submitted={submitted}
            loading={loading}
            step={step}
            isFormMinimallyValid={isFormMinimallyValid}
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
            onGoBackToForm={goBackToForm}
          />
      </div>
    </div>
  );
};

export default CertificationRequestForm_SignupStepper;
