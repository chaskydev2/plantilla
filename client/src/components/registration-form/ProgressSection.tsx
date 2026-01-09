import React from "react";
import type { ProgressSectionProps } from "./types";
import { Stepper, borderPrimary } from "../form-registration";

const ProgressSection: React.FC<ProgressSectionProps> = ({ userType, step, contractorSteps }) => {
  if (userType !== "contractor") return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-black">Registration Progress</h3>
        <span className="text-xs px-2 py-1 rounded-full border" style={borderPrimary}>
          Step {step + 1} of {contractorSteps.length}
        </span>
      </div>
      <Stepper steps={contractorSteps} current={step} />
    </div>
  );
};

export default ProgressSection;