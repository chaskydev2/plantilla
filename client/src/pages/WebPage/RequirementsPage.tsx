import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { IRequirement } from "@/core/types/IRequirement";
import { useEffect, useState } from "react";
import { createApiService } from "@/core/services/api.service";
import TitlePage from "@/components/common/TitlePage";

const RequisitosPage = () => {
  const [requirements, setRequirements] = useState<IRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const RequirementService = createApiService({ basePath: 'requirements' });

  useEffect(() => {
    const getRequirements = async () => {
      try {
        setLoading(true);
        const response = await RequirementService.get('all?type=inscription');
        setRequirements(response.data);
      } catch (err) {
        setError("No se pudieron cargar los requisitos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getRequirements();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando requisitos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-18 pb-20">
      <TitlePage 
        title="Requisitos para Inscripción" 
        subtitle="Documentación necesaria para formar parte de nuestra institución"
      />

      <div className="container mx-auto mt-12 px-6 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-8 pb-2 border-b border-blue-100">
            Requisitos Obligatorios
          </h2>

          {requirements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay requisitos registrados actualmente
            </p>
          ) : (
            <ul className="space-y-4">
              {requirements.map((req, index) => (
                <motion.li
                  key={req.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 hover:bg-blue-50 rounded-lg transition"
                >
                  <CheckCircle2 className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{req.title}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RequisitosPage;