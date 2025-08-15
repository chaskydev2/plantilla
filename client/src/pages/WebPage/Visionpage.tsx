import { Star, Eye, CheckCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TitlePage from "@/components/common/TitlePage";
import { useEffect, useState } from "react";
import { createApiService } from "@/core/services/api.service";
import type { IBeginning } from "@/core/types/IBeginning";
import type { IMoralValue } from "@/core/types/IMoralValue";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: "spring" as const, stiffness: 50 },
  }),
};

const FeatureCard = ({ icon, title, description, index, loading = false }: any) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    custom={index}
    whileHover={{ scale: 1.05 }}
    className="bg-white/90 border border-gray-200 rounded-3xl shadow-md p-8 cursor-pointer flex flex-col transition duration-300 min-h-[250px]"
  >
    {loading ? (
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-6">
          <div className="bg-gray-200 p-4 rounded-full shadow-md animate-pulse h-16 w-16"></div>
          <div className="h-8 bg-gray-200 rounded ml-6 w-3/4 animate-pulse"></div>
        </div>
        <div className="space-y-2 flex-grow">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
        </div>
      </div>
    ) : (
      <>
        <div className="flex items-center mb-6">
          <div className="bg-cyan-100 p-4 rounded-full shadow-md">{icon}</div>
          <h3 className="text-2xl font-semibold text-gray-800 ml-6">{title}</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </>
    )}
  </motion.div>
);

const ValorCard = ({ title, description, index, loading = false }: any) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    custom={index}
    whileHover={{ scale: 1.05 }}
    className="bg-gradient-to-tr from-cyan-50 to-white border border-cyan-200 p-6 rounded-3xl shadow-md cursor-pointer transition-shadow duration-300 min-h-[180px]"
  >
    {loading ? (
      <div className="flex items-start space-x-4 h-full">
        <div className="bg-gray-200 rounded-full h-7 w-7 mt-1 animate-pulse"></div>
        <div className="space-y-2 flex-grow">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>
    ) : (
      <div className="flex items-start space-x-4">
        <CheckCircle className="text-cyan-700 mt-1" size={28} />
        <div>
          <h4 className="font-semibold text-cyan-900 text-lg">{title}</h4>
          <p className="text-gray-700 mt-1 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    )}
  </motion.div>
);

const Visionpage = () => {
  const [beginnings, setBeginnings] = useState<IBeginning[]>([]);
  const [moralValues, setMoralValues] = useState<IMoralValue[]>([]);
  const [loading, setLoading] = useState({
    beginnings: true,
    moralValues: true
  });

  const BeginningService = createApiService({basePath: 'beginnings'});
  const MoralValueService = createApiService({basePath: 'moral_values'});
  
  useEffect(()=> {
    const fetchData = async () => {
      try {
        await Promise.all([getBeginnings(), getMoralValues()]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    fetchData();
  }, [])

  const getBeginnings = async() => {
    try {
      const response = await BeginningService.get('all');
      setBeginnings(response.data);
    } finally {
      setLoading(prev => ({...prev, beginnings: false}));
    }
  }

  const getMoralValues = async() => {
    try {
      const response = await MoralValueService.get('all');
      setMoralValues(response.data);
    } finally {
      setLoading(prev => ({...prev, moralValues: false}));
    }
  }

  return (
    <div className="pt-18 pb-24 bg-white text-gray-900 min-h-screen">
      {/* Hero */}
      <TitlePage
        title="Principios"
        subtitle="Nuestros principios son la brújula que guía cada acción, decisión y
            compromiso asumido por el Colegio Nacional de Topógrafos de Bolivia."
      />

      {/* Misión y Visión */}
      <section className="w-full bg-gray-50 py-20 text-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14">
          <FeatureCard
            icon={<Star className="text-cyan-600" size={40} />}
            title="Misión"
            description={beginnings[0]?.mission || ''}
            index={0}
            loading={loading.beginnings}
          />
          <FeatureCard
            icon={<Eye className="text-cyan-600" size={40} />}
            title="Visión"
            description={beginnings[0]?.vision || ''}
            index={1}
            loading={loading.beginnings}
          />
        </div>
      </section>

      {/* Valores */}
      <section className="w-full bg-white py-20 text-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold text-center text-cyan-800 mb-14"
          >
            Valores
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading.moralValues ? (
              [1, 2, 3, 4, 5, 6].map((_, index) => (
                <ValorCard 
                  key={`loading-${index}`}
                  index={index}
                  loading={true}
                />
              ))
            ) : (
              moralValues.map((valor, index) => (
                <ValorCard 
                  key={valor.id}
                  index={index}
                  title={valor.title}
                  description={valor.description}
                  loading={false}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Padre Nuestro del Topógrafo */}
      <section className="w-full bg-white py-20 text-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatePresence mode="wait">
            {loading.beginnings ? (
              <motion.div
                key="loading-prayer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-100 p-10 rounded-3xl shadow-xl border border-gray-200 min-h-[300px] flex items-center justify-center"
              >
                <div className="space-y-4 w-full">
                  <div className="h-10 bg-gray-200 rounded mx-auto w-1/2 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5 mx-auto"></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="prayer-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-cyan-50 p-10 rounded-3xl shadow-xl border border-cyan-100"
              >
                <div className="flex justify-center mb-6">
                  <BookOpen className="text-cyan-600" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-cyan-800 mb-4">
                  Padre Nuestro del Topógrafo
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg italic">
                  {beginnings[0]?.our_father || ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Visionpage;