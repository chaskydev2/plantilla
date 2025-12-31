import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import SearchBar from "../pages/WebPage/FindPro/SearchBar";

export default function SearchBarPopup() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Cerrar el popup al hacer click fuera o presionar Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
      >
        Buscar profesional
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
              <div
                ref={popupRef}
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative"
                style={{ minWidth: 320 }}
              >
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
                <SearchBar isLoading={false} />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}