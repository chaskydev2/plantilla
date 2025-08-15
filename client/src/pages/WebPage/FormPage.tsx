import { useState } from "react";
import { motion } from "framer-motion";

const Formulariopage = () => {
const [formData, setFormData] = useState({
    nombre: "",
    ci: "",
    tipo: "",
    telefono: "",
    email: "",
    observaciones: "",
});

const handleChange = (e: any) => {
    setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
    }));
};

const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí puedes integrar lógica para enviar los datos
};

return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen text-gray-800">
      {/* Encabezado */}
    <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-cyan-700 to-blue-900 text-white py-16 px-6 md:px-12 mb-20 rounded-b-3xl shadow-lg max-w-6xl mx-auto text-center"
    >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow">
        Solicitud de Certificación
        </h1>
        <p className="text-lg mt-2 max-w-2xl mx-auto opacity-90">
        Completa el siguiente formulario para solicitar tu certificado oficial como colegiado.
        </p>
    </motion.div>

      {/* Formulario */}
    <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-4xl mx-auto bg-white mt-16 p-8 rounded-2xl shadow-lg border border-gray-200"
    >
        <div className="grid md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-semibold mb-1">Nombre Completo</label>
            <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-cyan-600 outline-none"
            />
        </div>
        <div>
            <label className="block text-sm font-semibold mb-1">Cédula de Identidad</label>
            <input
            type="text"
            name="ci"
            value={formData.ci}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-cyan-600 outline-none"
            />
        </div>
        <div>
            <label className="block text-sm font-semibold mb-1">Tipo de Certificación</label>
            <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-cyan-600 outline-none"
            >
            <option value="">Seleccione una opción</option>
            <option value="Afiliación">Afiliación</option>
            <option value="Buena Conducta">Buena Conducta</option>
            <option value="Experiencia Profesional">Experiencia Profesional</option>
            <option value="Trabajo">Certificado de Trabajo</option>
            <option value="Actualización">Actualización</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-1">Teléfono</label>
            <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-cyan-600 outline-none"
            />
        </div>
        <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Correo Electrónico</label>
            <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-cyan-600 outline-none"
            />
        </div>
        <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Observaciones</label>
            <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows={4}
            placeholder="Ej. Solicito certificado de trabajo con entrega en formato digital..."
            className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-cyan-600 outline-none"
            />
        </div>
        </div>

        {/* Botón */}
        <div className="text-center mt-10">
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
        >
            Enviar Solicitud
        </motion.button>
        </div>
    </motion.form>
    </div>
);
};

export default Formulariopage;
