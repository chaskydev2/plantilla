import React from "react";
import { motion } from "framer-motion";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  description
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative py-12 px-6 md:px-12 mb-12 rounded-2xl shadow-xl max-w-6xl mx-auto border-3 backdrop-blur-lg"
      style={{
        background: `white`,
        color: "var(--color-primary)",
        borderColor: "var(--color-secondary)",
      }}
    >
      {/* Header background effects */}
      <div 
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl animate-spin"
        style={{ backgroundColor: "var(--color-primary)", opacity: 0.1, animationDuration: '20s' }}
      />
      <div 
        className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-2xl animate-ping"
        style={{ backgroundColor: "var(--color-primary)", opacity: 0.1, animationDuration: '4s' }}
      />
      
      <div className="relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl md:text-3xl font-black text-black tracking-tight leading-tight"
        >
          {title}
        </motion.h1>
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl font-bold mt-2 text-black drop-shadow-lg"
        >
          {subtitle}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-sm md:text-base mt-3 max-w-3xl leading-relaxed font-medium"
          style={{ color: "var(--color-primary)", opacity: 0.95 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};