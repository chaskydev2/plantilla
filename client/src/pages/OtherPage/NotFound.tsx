import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-800 dark:text-gray-200 text-title-md xl:text-title-2xl transition-colors duration-300">
            ERROR 404
          </h1>

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg transition-colors duration-300">
            ¡Parece que no podemos encontrar la página que estás buscando!
          </p>

          <button
            onClick={goBack}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-300"
          >
            Volver atrás
          </button>
        </div>
        
        {/* Footer */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400 transition-colors duration-300">
          &copy; {new Date().getFullYear()} - CTB
        </p>
      </div>
    </>
  );
}