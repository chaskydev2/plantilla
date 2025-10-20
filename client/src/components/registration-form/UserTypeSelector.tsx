import React from "react";
import { motion } from "framer-motion";
import type { UserTypeSelectorProps } from "./types";
import { borderPrimary } from "../form-registration";

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ userType, setUserType }) => {
  return (
    <div className="relative">
      <div
        className="relative flex items-center rounded-full border text-sm font-semibold"
        style={{ ...borderPrimary, background: "white" }}
        role="tablist"
        aria-label="User type"
      >
        <motion.div
          className="absolute top-0 bottom-0 m-1 rounded-full shadow"
          initial={false}
          animate={{ left: userType === "ownerHome" ? 2 : "50%", width: "50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ background: "var(--color-secondary)" }}
        />
        <button
          type="button"
          onClick={() => setUserType("ownerHome")}
          className="relative z-10 w-40 px-5 py-2 rounded-full"
          style={{ color: userType === "ownerHome" ? "var(--color-primary)" : "var(--color-secondary)" }}
          role="tab"
          aria-selected={userType === "ownerHome"}
        >
          Homeowner
        </button>
        <button
          type="button"
          onClick={() => setUserType("contractor")}
          className="relative z-10 w-40 px-5 py-2 rounded-full"
          style={{ color: userType === "contractor" ? "var(--color-primary)" : "var(--color-secondary)" }}
          role="tab"
          aria-selected={userType === "contractor"}
        >
          Contractor
        </button>
      </div>
      <div
        className="absolute w-full text-center text-[11px] mt-1"
        style={{ color: "var(--color-secondary)" }}
      >
        {userType === "ownerHome" ? "Property Owner" : "Service Provider"}
      </div>
    </div>
  );
};

export default UserTypeSelector;