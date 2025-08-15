import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createApiService } from '@/core/services/api.service'
import type { IAgreement } from "@/core/types/IAgreement";
import TitlePage from "@/components/common/TitlePage";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 120, damping: 20 } 
  },
  hover: { scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" } // sombra más marcada y elegante
};

const logoVariants = {
  hover: {
    scale: 1.15,
    filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.7))",
    transition: { duration: 0.3, yoyo: Infinity }
  }
};

const ConveniosPage = () => {
  const [institutions, setInstitutions] = useState<IAgreement[]>([]);
  const AggrementService = createApiService({basePath: 'agreements'});

  useEffect(()=> {
    getInstitutions();
  }, [])

  const getInstitutions = async() => {
    await AggrementService.get('all')
      .then(response => setInstitutions(response.data));
  }

  return (
    <div className="pt-18 pb-16">
      {/* Hero con gradiente estático */}
      <TitlePage
        title="Convenios Institucionales"
        subtitle="Establecemos alianzas estratégicas con instituciones educativas de prestigio para impulsar la formación y desarrollo profesional en topografía"
      />

      {/* Tarjetas con animación de entrada */}
      <motion.div 
        className="container mx-auto px-6 md:px-12 mt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {institutions.map((inst, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 text-center cursor-pointer shadow-lg shadow-gray-300/50"
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
              transition={{ type: "spring", stiffness: 100 }}
            >
              <motion.div
                className="bg-gradient-to-br from-white via-blue-50 to-cyan-100 rounded-xl shadow-sm p-4 mb-4 inline-block"
                variants={logoVariants}
                whileHover="hover"
              >
                <img
                  src={inst.photo}
                  alt={inst.name}
                  className="h-24 object-contain"
                />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{inst.name}</h3>
              <p className="text-gray-600 text-sm">{inst.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ConveniosPage;
