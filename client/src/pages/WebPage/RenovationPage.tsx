import { motion } from "framer-motion";
import { RefreshCcw, UserCheck, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createApiService } from "@/core/services/api.service";
import type { IRequirement } from "@/core/types/IRequirement";
import TitlePage from "@/components/common/TitlePage";

const RenovacionPage = () => {
  const [renovationReqs, setRenovationReqs] = useState<IRequirement[]>([]);
  const [updateInfoReqs, setUpdateInfoReqs] = useState<IRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const RequirementService = createApiService({ basePath: 'requirements' });

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        
        const renovationRes = await RequirementService.get('all?type=renovation');
        setRenovationReqs(renovationRes.data);
        
        const updateInfoRes = await RequirementService.get('all?type=updateinfo');
        setUpdateInfoReqs(updateInfoRes.data);
        
      } catch (err) {
        setError("Error al cargar los requisitos");
        console.error("Error fetching requirements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando información...</p>
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
    <div className="pt-18 pb-16 bg-gray-50 min-h-screen">
      <TitlePage 
        title="Renovación y Actualización de Datos" 
        subtitle="Mantén tu información actualizada y tu credencial vigente"
      />

      <div className="container mx-auto px-6 md:px-12 mt-12 grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <RefreshCcw className="text-blue-900" size={28} />
            <h2 className="text-2xl font-semibold text-blue-900">Renovación de Credencial</h2>
          </div>
          
          {renovationReqs.length === 0 ? (
            <p className="text-gray-500">No hay requisitos disponibles</p>
          ) : (
            <ul className="space-y-3">
              {renovationReqs.map((req, idx) => (
                <motion.li
                  key={req.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-600">•</span>
                  <span className="text-gray-700">{req.title}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <UserCheck className="text-blue-900" size={28} />
            <h2 className="text-2xl font-semibold text-blue-900">Actualización de Datos</h2>
          </div>
          
          {updateInfoReqs.length === 0 ? (
            <p className="text-gray-500">No hay requisitos disponibles</p>
          ) : (
            <ul className="space-y-3">
              {updateInfoReqs.map((req, idx) => (
                <motion.li
                  key={req.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-600">•</span>
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

export default RenovacionPage;