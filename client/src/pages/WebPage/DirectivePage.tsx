import TitlePage from "@/components/common/TitlePage";
import { createApiService } from "@/core/services/api.service";
import type { IDirectivity } from "@/core/types/IDirectivity";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import defaultAvatar from "@/assets/images/juan-perez.jpg";

const Directivapage = () => {
  const [directivities, setDirectivities] = useState<IDirectivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DirectivityService = createApiService({ basePath: 'directivities' });
  
  useEffect(() => {
    getDirectivities();
  }, []);

  const getDirectivities = async () => {
    try {
      setLoading(true);
      const response = await DirectivityService.get('all');
      setDirectivities(response.data);
    } catch (err) {
      setError("Error al cargar los datos de la directiva");
      console.error("Error fetching directivities:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-18 pb-16 bg-white text-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando miembros de la directiva...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-18 pb-16 bg-white text-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={getDirectivities}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-18 pb-16 bg-white text-gray-900">
      <TitlePage
        title="Mesa Directiva"
        subtitle="Conformada por profesionales de excelencia, esta directiva trabaja por el fortalecimiento del Colegio de Topógrafos de Cochabamba, promoviendo el desarrollo técnico, académico e institucional de la profesión."
      />

      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-20">
      
        {directivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron miembros registrados</p>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {directivities.map((miembro, index) => (
              <motion.div
                key={miembro.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className="bg-white border border-cyan-100 rounded-2xl shadow-md p-6 text-center hover:shadow-lg hover:border-cyan-300 transition-all duration-300 flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <img
                    src={miembro.photo || defaultAvatar}
                    alt={miembro.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-cyan-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = defaultAvatar;
                    }}
                  />
                  {miembro.position === "Presidente" && (
                    <div className="absolute -top-3 -right-3 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      ★
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-cyan-800 mb-1">
                  {miembro.name}
                </h3>
                <p className="text-gray-600 mb-3">{miembro.position}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Directivapage;