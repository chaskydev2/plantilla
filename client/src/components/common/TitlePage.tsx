import { motion } from "framer-motion";

export default function TitlePage({title, subtitle} : {title: string, subtitle: string}){
    return (
        <section className="w-full bg-gradient-to-r from-cyan-700 to-blue-900 rounded-b-3xl shadow-lg max-w-6xl mx-auto text-center text-white py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>
      </section>
    );
}