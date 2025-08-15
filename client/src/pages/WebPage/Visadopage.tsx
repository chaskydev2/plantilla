import { motion } from "framer-motion";
import {
FileCheck,
UploadCloud,
ShieldCheck,
} from "lucide-react";

const Visadopage = () => {
return (
    <div className="pt-24 pb-16 bg-white min-h-screen text-gray-800">
      {/* ENCABEZADO */}
    <motion.header
        className="w-full bg-gradient-to-r from-cyan-700 to-blue-900 rounded-b-3xl shadow-lg max-w-6xl mx-auto text-center text-white py-20"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
        Visado y Legalizaciones
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto drop-shadow-md">
        Accede a los servicios del Colegio de Topógrafos de forma presencial
        o digital, con total seguridad y validez legal.
        </p>
    </motion.header>

      {/* VISADO PRESENCIAL */}
    <motion.section
        className="max-w-5xl mx-auto px-6 md:px-12 mb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        <h2 className="text-3xl font-bold mb-6 text-center">
        Visado de Planos Presencial
        </h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 text-lg leading-relaxed">
        <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Entrega física de planos en nuestras oficinas.</li>
            <li>Revisión técnica y validación profesional.</li>
            <li>Sellado oficial con número de registro único.</li>
            <li>Tiempo estimado: 2 a 3 días hábiles.</li>
        </ul>
        <div className="flex justify-center">
            <button className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm">
            Más información
            </button>
        </div>
        </div>
    </motion.section>

      {/* VISADO DIGITAL */}
    <motion.section
        className="max-w-6xl mx-auto px-6 md:px-12 mb-24"
        initial="hidden"
        animate="visible"
        variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
        }}
    >
        <h2 className="text-3xl font-bold mb-8 text-center">Visado Digital</h2>

        <div className="grid gap-10 md:grid-cols-3">
        {[
            {
            icon: <UploadCloud size={48} className="text-cyan-600" />,
            title: "Subida de documentos",
            desc: "Carga digital de tus planos y requisitos desde tu cuenta.",
            },
            {
            icon: <FileCheck size={48} className="text-blue-700" />,
            title: "Revisión técnica",
            desc: "Nuestros especialistas validan digitalmente tu archivo.",
            },
            {
            icon: <ShieldCheck size={48} className="text-green-600" />,
            title: "Entrega legal",
            desc: "Sellado y firma digital válida, lista para descargar.",
            },
        ].map((item, index) => (
            <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.03 }}
            >
            {item.icon}
            <h3 className="mt-5 mb-3 text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
            </motion.div>
        ))}
        </div>
    </motion.section>

      {/* LEGALIZACIONES */}
    <motion.section
        className="max-w-5xl mx-auto px-6 md:px-12 mb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
    >
        <h2 className="text-3xl font-bold mb-8 text-center">Legalizaciones</h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 text-lg text-gray-700 leading-relaxed">
        <p>
            Las legalizaciones consisten en validar documentos emitidos por
            profesionales colegiados para su uso oficial ante instituciones
            públicas o privadas.
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>Legalización de planos y certificaciones.</li>
            <li>Validación con sello y firma autorizada por el Colegio.</li>
            <li>Entrega física o digital según requerimiento.</li>
        </ul>
        <div className="flex justify-center mt-6">
            <button className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm">
            Solicitar legalización
            </button>
        </div>
        </div>
    </motion.section>

      {/* CTA FINAL */}
    <motion.div
        className="bg-gradient-to-r from-cyan-700 to-blue-900 text-white rounded-3xl p-10 text-center shadow-xl max-w-5xl mx-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
    >
        <h3 className="text-3xl font-extrabold mb-4 drop-shadow-lg">
        Inicia tus trámites en línea o presencialmente
        </h3>
        <p className="text-cyan-200 mb-6 max-w-xl mx-auto">
        El Colegio de Topógrafos de Bolivia facilita el acceso a sus servicios
        con procesos modernos y confiables.
        </p>
        <button className="bg-white text-cyan-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition duration-300">
        Comenzar ahora
        </button>
    </motion.div>
    </div>
);
};

export default Visadopage;
