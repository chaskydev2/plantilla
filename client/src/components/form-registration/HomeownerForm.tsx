import React from "react";
import type { FormData, FormValidationErrors } from "./types";
import { fieldCls, labelCls, borderPrimary } from "./utils";
import ErrorText from "./ErrorText";
import PasswordInput from "./PasswordInput";
import EmailVerification from "../registration-form/EmailVerification";
import { Modal } from "../ui/modal/index";

interface HomeownerFormProps {
  formData: Extract<FormData, { userType: "ownerHome" }>;
  errors: FormValidationErrors;
  submitted: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;

  // Modal verification (✅ obligatorios)
  showEmailVerification: boolean;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  verificationError: string;

  loading: boolean;
  sendVerificationEmail: (email: string) => void;
  onGoBackToForm: () => void;

  // ✅ lo llama Create Account
  onConfirmEmail: () => void;
}

const HomeownerForm: React.FC<HomeownerFormProps> = ({
  formData,
  errors,
  submitted,
  handleChange,

  showEmailVerification,
  verificationCode,
  setVerificationCode,
  verificationError,

  loading,
  sendVerificationEmail,
  onGoBackToForm,
  onConfirmEmail,
}) => {
  const handleResendEmail = () => sendVerificationEmail(formData.email);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            className={labelCls}
            style={{ color: "var(--color-secondary)" }}
            htmlFor="firstName"
          >
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={fieldCls}
            style={borderPrimary}
            placeholder="Your first name"
          />
          <ErrorText msg={submitted ? errors.firstName : undefined} />
        </div>

        <div>
          <label
            className={labelCls}
            style={{ color: "var(--color-secondary)" }}
            htmlFor="lastName"
          >
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={fieldCls}
            style={borderPrimary}
            placeholder="Your last name"
          />
          <ErrorText msg={submitted ? errors.lastName : undefined} />
        </div>

        <div>
          <label
            className={labelCls}
            style={{ color: "var(--color-secondary)" }}
            htmlFor="email"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={fieldCls}
            style={borderPrimary}
            placeholder="name@example.com"
          />
          <ErrorText msg={submitted ? errors.email : undefined} />
        </div>

        <div>
          <label
            className={labelCls}
            style={{ color: "var(--color-secondary)" }}
            htmlFor="phone"
          >
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={fieldCls}
            style={borderPrimary}
            placeholder="+1 (555) 123-4567"
          />
          <ErrorText msg={submitted ? errors.phone : undefined} />
        </div>

        <div>
          <label
            className={labelCls}
            style={{ color: "var(--color-secondary)" }}
            htmlFor="password"
          >
            Password *
          </label>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={fieldCls}
            style={borderPrimary}
            placeholder="Minimum 6 characters"
          />
          <ErrorText msg={submitted ? errors.password : undefined} />
        </div>

        <div>
          <label
            className={labelCls}
            style={{ color: "var(--color-secondary)" }}
            htmlFor="confirmPassword"
          >
            Confirm Password *
          </label>
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={fieldCls}
            style={borderPrimary}
            placeholder="Type password again"
          />
          <ErrorText msg={submitted ? errors.confirmPassword : undefined} />
        </div>
      </div>

      {/* ✅ MODAL */}
      <Modal
        isOpen={showEmailVerification}
        onClose={onGoBackToForm}
        className="max-w-xl mx-4 p-6 sm:p-8"
        showCloseButton={false}
      >
        <EmailVerification
          email={formData.email}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          verificationError={verificationError}
          loading={loading}
          onResendEmail={handleResendEmail}
          onGoBack={onGoBackToForm}
          // onConfirm={onConfirmEmail}
          onConfirm={() => {
            console.log("🔥 HomeownerForm onConfirmEmail fired");
            onConfirmEmail();
          }}
        />
      </Modal>
    </>
  );
};

export default HomeownerForm;
