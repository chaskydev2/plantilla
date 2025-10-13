import React from "react";
import { motion } from "framer-motion";
import type { StepperProps } from "./types";
import { cn } from "./utils";

// =========================================
// Stepper Component
// =========================================
const Stepper: React.FC<StepperProps> = ({ steps, current }) => {
  const pct = ((current + 1) / steps.length) * 100;
  
  return (
    <div className="space-y-2">
      <div className="relative h-2 w-full rounded-full overflow-hidden" style={{ background: "#ececec" }}>
        <motion.div
          className="h-full"
          style={{ background: "var(--color-secondary)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="flex items-center justify-between text-xs font-medium" style={{ color: "var(--color-secondary)" }}>
        {steps.map((s, i) => (
          <div key={s} className={cn("flex-1 text-center", i === current && "font-semibold")}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;