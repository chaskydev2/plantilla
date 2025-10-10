import React from "react";
import { motion } from "framer-motion";

export type UserType = "ownerHome" | "contractor";

interface UserTypeSwitchProps {
  userType: UserType;
  onUserTypeChange: (type: UserType) => void;
}

export const UserTypeSwitch: React.FC<UserTypeSwitchProps> = ({
  userType,
  onUserTypeChange
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="relative z-10 flex flex-wrap items-center justify-between gap-6 mb-8"
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight text-black">
          Choose Account Type
        </h2>
        <p className="text-sm md:text-base font-medium" style={{ color: "var(--color-primary)", opacity: 0.95 }}>
          Select your role to customize your registration experience
        </p>
      </div>
      
      {/* Switch-style Toggle */}
      <div className="relative">
        {/* Switch Background */}
        <div 
          className="relative flex items-center p-1 rounded-full border-3 shadow-2xl backdrop-blur-lg overflow-hidden"
          style={{
            backgroundColor: "var(--color-primary)",
            borderColor: "var(--color-secondary)",
            minWidth: "320px",
            height: "60px"
          }}
        >
          {/* Animated Background Slider */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full shadow-lg z-10"
            initial={false}
            animate={{
              left: userType === "ownerHome" ? "4px" : "50%",
              width: userType === "ownerHome" ? "48%" : "48%"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              duration: 0.3 
            }}
            style={{
              backgroundColor: "var(--color-secondary)",
              boxShadow: `0 4px 12px rgba(0,0,0,0.2), 0 0 20px var(--color-secondary)`
            }}
          />
          
          {/* Switch Options */}
          <div className="relative z-20 flex w-full">
            {/* Homeowner Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onUserTypeChange("ownerHome")}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-sm transition-all duration-300 relative z-30"
              style={{
                color: userType === "ownerHome" ? "var(--color-primary)" : "var(--color-secondary)",
                textShadow: userType === "ownerHome" ? "none" : "0 1px 2px rgba(0,0,0,0.1)"
              }}
            >
              <motion.span 
                className="text-lg"
                animate={{ 
                  scale: userType === "ownerHome" ? 1.2 : 1,
                  rotate: userType === "ownerHome" ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                🏠
              </motion.span>
              <span className="tracking-wide">Homeowner</span>
            </motion.button>

            {/* Contractor Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onUserTypeChange("contractor")}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-sm transition-all duration-300 relative z-30"
              style={{
                color: userType === "contractor" ? "var(--color-primary)" : "var(--color-secondary)",
                textShadow: userType === "contractor" ? "none" : "0 1px 2px rgba(0,0,0,0.1)"
              }}
            >
              <motion.span 
                className="text-lg"
                animate={{ 
                  scale: userType === "contractor" ? 1.2 : 1,
                  rotate: userType === "contractor" ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                🔧
              </motion.span>
              <span className="tracking-wide">Contractor</span>
            </motion.button>
          </div>

          {/* Decorative Elements */}
          <div 
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--color-secondary)", opacity: 0.3 }}
          />
          <div 
            className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full animate-ping"
            style={{ backgroundColor: "var(--color-secondary)", opacity: 0.2 }}
          />
        </div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full border backdrop-blur-sm"
          style={{
            backgroundColor: "var(--color-secondary)",
            color: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            opacity: 0.9
          }}
        >
          {userType === "ownerHome" ? "🏠 Property Owner" : "🔧 Service Provider"}
        </motion.div>
      </div>
    </motion.div>
  );
};