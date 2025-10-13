import React from "react";
import type { ErrorTextProps } from "./types";

// =========================================
// Error Text Component
// =========================================
const ErrorText: React.FC<ErrorTextProps> = ({ msg }) =>
  msg ? (
    <p className="mt-2 text-sm font-medium" style={{ color: "#b00020" }}>
      {msg}
    </p>
  ) : null;

export default ErrorText;