import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookMarked,
  UserCheck,
  Stamp,
  Briefcase,
} from "lucide-react";

const certificaciones = [
  {
    icon: <BadgeCheck size={42} className="text-green-600" />,
    titulo: "Afiliación",
    descripcion:
      "Confirma tu registro como miembro activo del Colegio con validez nacional.",
  },
  {
    icon: <BookMarked size={42} className="text-blue-700" />,
    titulo: "Actualización",
    descripcion:
      "Acredita que tu información y membresía se encuentran actualizadas y vigentes.",
  },
  {
    icon: <UserCheck size={42} className="text-cyan-700" />,
    titulo: "Buena Conducta",
    descripcion:
      "Respalda tu ética profesional y cumplimiento de normas como colegiado.",
  },
  {
    icon: <Stamp size={42} className="text-yellow-600" />,
    titulo: "Experiencia Profesional",
    descripcion:
      "Documento que valida tu participación en proyectos técnicos o institucionales.",
  },
  {
    icon: <Briefcase size={42} className="text-indigo-700" />,
    titulo: "Certificado de Trabajo",
    descripcion:
      "Acredita tu relación contractual o laboral como topógrafo ante terceros.",
  },
];

const CertificacionesPage = () => {
  return (
    <div className="pt-24 pb-20 bg-gray-50 text-gray-800 min-h-screen">
      {/* TÍTULO PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-r from-cyan-700 to-blue-900 text-white py-16 px-6 md:px-12 mb-20 rounded-b-3xl shadow-xl max-w-6xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
          Certificaciones Oficiales
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
          Solicita certificados respaldados por el Colegio de Topógrafos de Bolivia. Documentación oficial, válida y reconocida.
        </p>
      </motion.div>

      {/* SECCIÓN DE CERTIFICADOS */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="max-w-6xl mx-auto px-6 md:px-10 mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {certificaciones.map((item, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              scale: 1.04,
              rotate: [-1, 0, 1, 0],
              transition: { duration: 0.4 },
            }}
            className="bg-white border border-gray-100 shadow-lg rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:border-cyan-600"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.titulo}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.descripcion}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* CTA FINAL */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-24 bg-white border border-gray-200 shadow-xl rounded-2xl max-w-5xl mx-auto p-10 text-center"
      >
        <h3 className="text-2xl font-bold mb-3 text-gray-800">
          ¿Deseas solicitar una certificación?
        </h3>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Puedes hacerlo de forma presencial o a través de nuestra plataforma digital. Nos aseguramos de brindarte un servicio eficiente y confiable.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition duration-300"
        >
          Solicitar Certificado
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CertificacionesPage;
