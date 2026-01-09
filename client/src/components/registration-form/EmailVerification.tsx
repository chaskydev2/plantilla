import React from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { borderPrimary, helpMuted } from "../form-registration";

interface EmailVerificationProps {
  email: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  verificationError: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onResendEmail: () => void;
  onGoBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  verificationCode,
  setVerificationCode,
  verificationError,
  loading,
  onSubmit,
  onResendEmail,
  onGoBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-black mb-2">Verify Your Email</h3>
        <p className="text-sm" style={helpMuted}>
          We've sent a 6-digit verification code to
        </p>
        <p className="font-semibold" style={{ color: "var(--color-secondary)" }}>
          {email}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="verificationCode" 
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-secondary)" }}
          >
            Verification Code
          </label>
          <input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={borderPrimary}
            placeholder="000000"
            maxLength={6}
            autoComplete="off"
          />
          {verificationError && (
            <p className="text-red-500 text-sm mt-1">{verificationError}</p>
          )}
        </div>

        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={onGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 rounded-xl border font-medium transition-all duration-200 flex items-center justify-center gap-2"
            style={{ 
              borderColor: "var(--color-secondary)",
              color: "var(--color-secondary)"
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
          
          <motion.button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 rounded-xl border font-bold transition-all duration-200"
            style={{
              background: loading || verificationCode.length !== 6 ? "#ccc" : "var(--color-secondary)",
              color: loading || verificationCode.length !== 6 ? "#666" : "var(--color-primary)",
              ...borderPrimary,
              opacity: loading || verificationCode.length !== 6 ? 0.6 : 1,
              cursor: loading || verificationCode.length !== 6 ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </motion.button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <p className="text-xs mb-3" style={helpMuted}>
          Didn't receive the code?
        </p>
        <button
          type="button"
          onClick={onResendEmail}
          disabled={loading}
          className="text-sm font-medium underline hover:no-underline transition-all duration-200"
          style={{ color: "var(--color-secondary)" }}
        >
          Resend verification email
        </button>
      </div>
    </motion.div>
  );
};

export default EmailVerification;