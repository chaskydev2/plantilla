import React, { useState } from 'react';

interface ShareButtonProps {
  setShowToast: (show: boolean) => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ setShowToast }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltip({
      visible: true,
      x: e.clientX + 10,
      y: e.clientY + 20,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  const ShareIcon = ({ className = "" }) => (
    <svg 
      width="30" 
      height="30" 
      viewBox="0 0 25 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M14.2755 2.28563C14.5558 2.16954 14.8783 2.23371 15.0928 2.44821L22.0929 9.44821C22.2335 9.58886 22.3125 9.77963 22.3125 9.97854C22.3125 10.1775 22.2335 10.3682 22.0929 10.5089L15.0928 17.5089C14.8783 17.7234 14.5558 17.7875 14.2755 17.6715C13.9952 17.5554 13.8125 17.2819 13.8125 16.9785V13.1805C8.99081 13.5129 5.04239 17.0253 4.05219 21.636C3.97796 21.9817 3.67244 22.2285 3.31891 22.2285C2.96538 22.2285 2.65986 21.9817 2.58563 21.636C2.4066 20.8024 2.3125 19.9379 2.3125 19.0523C2.3125 12.5386 7.39629 7.21238 13.8125 6.82486V2.97854C13.8125 2.67519 13.9952 2.40171 14.2755 2.28563ZM15.3125 4.7892V7.55227C15.3125 7.96649 14.9767 8.30227 14.5625 8.30227C9.00767 8.30227 4.43687 12.5155 3.87136 17.9206C5.96857 14.1816 9.96993 11.6548 14.5625 11.6548C14.9767 11.6548 15.3125 11.9906 15.3125 12.4048V15.1679L20.5019 9.97854L15.3125 4.7892Z" 
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="relative">
      <button
        onClick={handleShareClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-white bg-white hover:border-[#ffed00] hover:bg-[#ffed00] transition-all duration-300"
      >
        <ShareIcon className="h-6 w-6 text-[#ffed00] group-hover:text-white transition-colors duration-300" />
      </button>

      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
          }}
          className="px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg pointer-events-none z-50"
        >
          Click to copy sharing link
        </div>
      )}
    </div>
  );
};

export default ShareButton;