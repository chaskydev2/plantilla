import TitlePage from "@/components/common/TitlePage";
import { motion } from "framer-motion";

const pdfFile = '/documents/estatutos.pdf';

const Estatutospage = () => {
  return (
    <div className="pt-18 pb-16 bg-white min-h-screen">
      <TitlePage
        title="Estatutos del Colegio Nacional de Topógrafos de Bolivia"
        subtitle="El Estatuto Orgánico del Colegio Nacional de Topógrafos de Bolivia establece las bases legales y organizativas para el ejercicio profesional de la topografía en el país. Este documento define la estructura institucional, los derechos y deberes de los colegiados, y las atribuciones de los órganos de gobierno como el Congreso Nacional y el Comité Ejecutivo Nacional. Además, detalla los requisitos para ser miembro del Comité Ejecutivo y otros aspectos fundamentales para el funcionamiento del colegio."
      />

      {/* PDF Viewer */}
      <div className="container mx-auto px-6 md:px-12 mt-12 max-w-5xl">
        <motion.iframe
          src={pdfFile}
          title="Estatutos Colegio Nacional de Topógrafos"
          className="w-full h-[700px] rounded-3xl shadow-2xl border-4 border-cyan-600"
          frameBorder="0"
          allowFullScreen
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>

      {/* Texto adicional con fondo degradado de ancho completo */}
      <section className="bg-gradient-to-br from-blue-900 to-sky-700 py-16 mt-16">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl text-center text-white text-lg leading-relaxed">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            Puedes descargar el documento para revisarlo detalladamente o consultarlo en cualquier momento.
          </motion.p>
          <motion.a
            href={pdfFile}
            download="ESTATUROREGLAMENTOSCOTOBOLCBBA.pdf"
            className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Descargar PDF
          </motion.a>
        </div>
      </section>
    </div>
  );
};

export default Estatutospage;
