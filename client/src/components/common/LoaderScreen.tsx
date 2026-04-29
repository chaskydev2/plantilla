import Logo from "@/assets/images/LOGO GUD.svg";

export default function LoaderScreen() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-[#1E1E17] z-9999"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(245,210,56,0.18),transparent_60%)]" />

      <div className="relative flex w-full max-w-lg flex-col items-center rounded-2xl border border-gray-200/70 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#1E1E17]/60">
        <div className="relative mb-6 h-44 w-44">
          {/* Main logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={Logo} alt="GU Logo" className="h-28 w-28 animate-pulse" />
          </div>

          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F5D238] border-r-[#1A1B16] animate-spin-slow" />

          {/* Inner ring spinning in reverse */}
          <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-[#F5D238] border-l-[#1A1B16] animate-spin-slow-reverse" />

          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5D238] shadow-[0_0_0_6px_rgba(245,210,56,0.12)]" />
        </div>

        <p className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Loading…</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center max-w-md">
          Please wait while we load the content.
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block h-2 w-2 rounded-full bg-[#F5D238] animate-pulse" />
          <span>Preparing your experience</span>
        </div>

        <style>
          {`
            @keyframes spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spin-slow-reverse {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 3s linear infinite;
            }
            .animate-spin-slow-reverse {
              animation: spin-slow-reverse 2s linear infinite;
            }
          `}
        </style>
      </div>
    </div>
  );
}