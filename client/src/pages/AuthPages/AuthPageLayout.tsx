import React from "react";
import { Link } from "react-router";
// Dark mode toggle removed temporarily
import BrandLogoUrl from "@/assets/images/LOGO GUD.svg?url";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-[#F5D238] lg:grid relative">
          {/* Faceted polygon shards along the divider */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-52 -translate-x-1/2 hidden lg:block" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                {/* Soft glow along the seam */}
                <linearGradient id="seamGlow" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#F5D238" stopOpacity="0.28"/>
                  <stop offset="35%" stopColor="#F5D238" stopOpacity="0.12"/>
                  <stop offset="100%" stopColor="#F5D238" stopOpacity="0"/>
                </linearGradient>
                {/* Fade into white side */}
                <linearGradient id="fadeLeft" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.0" />
                  <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.0" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* Seam glow */}
              <rect x="48" y="0" width="12" height="100" fill="url(#seamGlow)" />

              {/* Dense shard cluster */}
              <g className="[filter:drop-shadow(0_0_16px_rgba(255,255,255,0.28))]">
                <polygon points="64,4 78,26 58,30" fill="#ffffff" fillOpacity="0.92" />
                <polygon points="78,26 92,16 88,38" fill="#ffffff" fillOpacity="0.78" />
                <polygon points="56,32 72,44 54,50" fill="#ffffff" fillOpacity="0.88" />
                <polygon points="72,44 86,48 68,62" fill="#ffffff" fillOpacity="0.82" />
                <polygon points="60,58 78,70 58,76" fill="#ffffff" fillOpacity="0.9" />
                <polygon points="78,70 92,64 90,82" fill="#ffffff" fillOpacity="0.76" />
                <polygon points="60,80 74,92 56,96" fill="#ffffff" fillOpacity="0.82" />
                {/* extra small facets */}
                <polygon points="70,8 74,14 66,16" fill="#ffffff" fillOpacity="0.7" />
                <polygon points="86,34 90,28 88,38" fill="#ffffff" fillOpacity="0.65" />
                <polygon points="68,50 72,54 66,56" fill="#ffffff" fillOpacity="0.7" />
                <polygon points="84,74 88,70 86,78" fill="#ffffff" fillOpacity="0.65" />
              </g>

              {/* Fade to blend shards into white area */}
              <rect x="0" y="0" width="52" height="100" fill="url(#fadeLeft)" />

              {/* Floating shards with subtle yellow stroke */}
              <g className="[filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.06))]">
                <polygon points="8,10 14,18 4,20" fill="#ffffff" fillOpacity="0.6" stroke="#F5D238" strokeOpacity="0.22" strokeWidth="0.4" />
                <polygon points="18,38 26,46 12,48" fill="#ffffff" fillOpacity="0.5" stroke="#F5D238" strokeOpacity="0.2" strokeWidth="0.4" />
                <polygon points="12,70 20,76 6,80" fill="#ffffff" fillOpacity="0.55" stroke="#F5D238" strokeOpacity="0.2" strokeWidth="0.4" />
              </g>
            </svg>
          </div>
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src={BrandLogoUrl}
                  alt="Brand Logo"
                />
              </Link>
              <p className="text-center text-4xl text-[#1A1B16]">
              GU
              </p>
            </div>
          </div>
        </div>
        {/* Dark mode toggle removed temporarily */}
      </div>
    </div>
  );
}
