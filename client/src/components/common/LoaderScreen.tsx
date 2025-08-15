export default function LoaderScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-gray-900 z-9999">
            <div className="relative w-40 h-40 mb-6">
                <div className="absolute inset-0 rounded-full border-[3px] border-green-600 dark:border-green-400 shadow-lg"></div>

                <div className="absolute inset-5 rounded-full border border-green-300 dark:border-green-700 flex items-center justify-center">
                    <span className="absolute top-0 text-sm font-bold text-green-700 dark:text-green-300 -translate-y-1/2">N</span>
                    <span className="absolute right-0 text-sm font-bold text-green-700 dark:text-green-300 translate-x-1/2">E</span>
                    <span className="absolute bottom-0 text-sm font-bold text-green-700 dark:text-green-300 translate-y-1/2">S</span>
                    <span className="absolute left-0 text-sm font-bold text-green-700 dark:text-green-300 -translate-x-1/2">W</span>
                </div>

                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-full h-full animate-spin-slow">
                        <div className="absolute top-2 left-1/2 w-1.5 h-1/2 bg-red-600 rounded-t-full -translate-x-1/2 shadow-md"></div>
                        <div className="absolute bottom-2 left-1/2 w-1.5 h-1/2 bg-gray-400 rounded-b-full -translate-x-1/2 shadow-md"></div>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-700 dark:bg-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 border-2 border-white"></div>
            </div>

            <p className="text-lg font-medium text-green-700 dark:text-green-300 animate-pulse text-center">
                Midiendo coordenadas, conectando conocimiento…
            </p>

            <style>
                {`
            @keyframes spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 5s linear infinite;
            }
          `}
            </style>
        </div>
    );
}