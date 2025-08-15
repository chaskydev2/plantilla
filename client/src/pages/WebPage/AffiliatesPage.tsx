import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import affiliatesData from "../data.json";

const recognitions = [
  {
    title: "Reconocimientopor sus 25 años de vida institucional. ",
    description: "Otorgado por la brigada parlamentaria de cochabamba.",
    recipient: "Colegio de topografos Bolivia departamental Cochabamba",
    date: "3/05/2022",
    image: "src/assets/images/reconocimiento.jpg",
  },
  {
    title: "Reconocimientopor sus 25 años de vida institucional. ",
    description: "Otorgado por la brigada parlamentaria de cochabamba.",
    recipient: "Colegio de topografos Bolivia departamental Cochabamba",
    date: "3/05/2022",
    image: "src/assets/images/reconocimiento2.jpg",
  },
];

const Pagination = ({ currentPage, totalPages, onPageChange }:any) => {
  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-3 mt-8 text-sm select-none">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-md hover:bg-blue-100 disabled:opacity-50 transition"
        aria-label="Página anterior"
      >
        ⬅️
      </button>

      {generatePages().map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-3 py-2 text-gray-500 select-none">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`px-4 py-2 border rounded-md transition ${
              currentPage === p
                ? "bg-blue-900 text-white font-semibold"
                : "hover:bg-blue-100"
            }`}
            aria-current={currentPage === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-md hover:bg-blue-100 disabled:opacity-50 transition"
        aria-label="Página siguiente"
      >
        ➡️
      </button>
    </div>
  );
};

const AffiliatesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showList, setShowList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const itemsPerPage = 10;

  const filteredAffiliates = useMemo(() => {
    const normalize = (str: any) => str.toLowerCase().replace(/\s+/g, " ").trim();
    const normalizedSearchTerm = normalize(searchTerm);

    return affiliatesData.filter((a) =>
      normalize(a.nombre).includes(normalizedSearchTerm)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredAffiliates.length / itemsPerPage);
  const paginatedAffiliates = filteredAffiliates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page:any) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <main className="bg-white min-h-screen pt-[120px] flex flex-col items-center px-4 md:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-cyan-700 to-blue-900 text-white py-16 px-6 md:px-12 mb-20 rounded-b-3xl shadow-xl max-w-6xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-xl">Lista de Afiliados</h1>
        <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
          Consulta de datos y reconocimientos destacados
        </p>
      </motion.div>

      {/* Botón para mostrar/ocultar lista */}
      <motion.button
        onClick={() => setShowList(!showList)}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm mb-10"
      >
        {showList ? "Ocultar lista" : "Mostrar lista"}
      </motion.button>

      {/* Lista de afiliados */}
      <AnimatePresence initial={false}>
        {showList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl overflow-hidden"
          >
            {/* Buscador y paginación */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-6">
              <input
                type="text"
                placeholder="Buscar por nombre"
                className="flex-grow md:flex-grow-0 md:w-80 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black transition"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Tabla afiliados */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm text-gray-800">
                <thead className="bg-blue-900 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 border">Nombre</th>
                    <th className="px-4 py-2 border">Apellido</th>
                    <th className="px-4 py-2 border">Código</th>
                    <th className="px-4 py-2 border">Fecha Afiliación</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAffiliates.length > 0 ? (
                    paginatedAffiliates.map((a, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-4 py-2 border whitespace-nowrap">{a.nombre}</td>
                        <td className="px-4 py-2 border whitespace-nowrap">{a.apellido}</td>
                        <td className="px-4 py-2 border whitespace-nowrap">{a.codigo_registro}</td>
                        <td className="px-4 py-2 border whitespace-nowrap">{a.fecha_afiliacion}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">
                        No se encontraron afiliados con esos datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sección Reconocimientos */}
      <section className="max-w-7xl mx-auto px-4 mt-20 mb-16 w-full">
        <h2 className="text-3xl font-semibold text-blue-900 mb-8 flex items-center gap-2 select-none">
          <Award className="w-7 h-7 text-blue-700" />
          Reconocimientos Destacados
        </h2>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
          {recognitions.map((rec, idx) => {
            const isExpanded = idx === expandedIndex;

            return (
              <motion.article
                key={idx}
                layout
                initial={{ borderRadius: 15 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  backgroundColor: "#e0f2fe",
                }}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className={`cursor-pointer bg-blue-50 border-l-4 border-blue-900 p-6 rounded-xl shadow-md select-none ${
                  isExpanded ? "bg-blue-100" : "bg-blue-50"
                }`}
              >
                <motion.h3 layout className="text-xl font-bold text-blue-900 mb-2">
                  {rec.title}
                </motion.h3>
                <motion.p layout className="text-gray-700 text-base mb-1">
                  {rec.description}
                </motion.p>
                <motion.p layout className="text-gray-600 mb-0.5">
                  <span className="font-semibold">Otorgado a:</span> {rec.recipient}
                </motion.p>
                <motion.p layout className="text-gray-500 text-sm">{rec.date}</motion.p>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <img
                        src={rec.image}
                        alt={`Imagen del reconocimiento: ${rec.title}`}
                        loading="lazy"
                        className="w-full max-w-md rounded-lg shadow-lg mx-auto mt-4"
                        draggable={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default AffiliatesPage;
