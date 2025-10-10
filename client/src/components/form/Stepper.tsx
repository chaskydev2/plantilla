import React from "react";

interface StepperProps {
  steps: string[];
  current: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, current }) => {
  return (
    <div className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      {steps.map((s, idx) => {
        const active = idx <= current;
        const completed = idx < current;
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-3 font-bold text-lg transition-all duration-500 ${
                  active ? "scale-110 shadow-xl" : "opacity-60"
                } ${completed ? "animate-pulse" : ""}`}
                style={{
                  backgroundColor: active ? "var(--color-secondary)" : "white",
                  color: active ? "var(--color-primary)" : "var(--color-secondary)",
                  borderColor: "var(--color-primary)",
                  boxShadow: active ? `0 8px 25px rgba(245, 210, 56, 0.4)` : 'none'
                }}
              >
                {completed ? "✓" : idx + 1}
              </div>
              <span className="text-sm font-bold text-center" style={{ color: "var(--color-secondary)" }}>
                {s}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div 
                className={`w-16 h-1 rounded-full transition-all duration-500 ${completed ? 'animate-pulse' : ''}`}
                style={{ 
                  background: completed 
                    ? `linear-gradient(90deg, var(--color-primary), var(--color-secondary))` 
                    : `var(--color-primary)`,
                  opacity: completed ? 1 : 0.3 
                }} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};