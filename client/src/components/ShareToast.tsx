import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

interface ShareToastProps {
  showToast: boolean;
  setShowToast: (show: boolean) => void;
}

const ShareToast: React.FC<ShareToastProps> = ({ showToast, setShowToast }) => (
  <AnimatePresence>
    {showToast && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-[#1A1B16] text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
          <CheckCircle className="h-5 w-5 text-[#F5D238]" />
          <span className="flex-1">Share link copied to clipboard</span>
          <button 
            onClick={() => setShowToast(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ShareToast;