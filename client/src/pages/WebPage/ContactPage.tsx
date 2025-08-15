import { Mail, Phone, Clock, Send, Smartphone } from 'lucide-react';
import { motion } from "framer-motion";
import TitlePage from '@/components/common/TitlePage';
import { useEffect, useState } from 'react';
import type { IContact } from '@/core/types/IContact';
import { createApiService } from '@/core/services/api.service';
import type { IFaq } from '@/core/types/IFaq';
import { toastify } from '@/core/utils/toastify';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ContactPage = () => {
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: '',
  });
  
  const FaqService = createApiService({ basePath: 'faqs' });
  const ContactService = createApiService({ basePath: 'contacts' });
  const NewsletterService = createApiService({ basePath: 'newsletters' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [faqResponse, contactResponse] = await Promise.all([
          FaqService.get('all'),
          ContactService.get('all')
        ]);
        setFaqs(faqResponse.data || []);
        setContacts(contactResponse.data || []);
      } catch (err) {
        setError('Error al cargar los datos de contacto');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Formulario enviado:', formData);
      await NewsletterService.create('send', formData);
      toastify.success('Mensaje enviado correctamente');
      setFormData({ name: '', email: '', subject: '', content: '' });
    } catch (err) {
      toastify.error('Hubo un error al enviar tu mensaje');
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (error) return <div className="text-center p-8"><p className="text-red-500">{error}</p></div>;

  const mainContact = contacts[0] || {};

  return (
    <div className="pt-18 pb-16 bg-white">
      <TitlePage
        title="Contacto"
        subtitle="Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta."
      />

      <motion.div
        className="container mx-auto px-6 md:px-12 my-10 space-y-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 "
          variants={fadeInUp}
        >
          <ContactCard
            icon={<Phone size={24} />}
            title="Dirección"
            details={mainContact.address ? [mainContact.address] : []}
          />
          <ContactCard
            icon={<Smartphone size={24} />}
            title="Teléfono - Celular"
            details={mainContact.mobile_number ? [mainContact.phone_number, mainContact.mobile_number] : []}
          />
          <ContactCard
            icon={<Mail size={24} />}
            title="Email"
            details={mainContact.email ? [mainContact.email] : []}
          />
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={fadeInUp}>
          <motion.div
            className="card shadow-md rounded-xl"
            whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgb(255, 255, 255)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="card-body p-8">
              <h2 className="text-2xl font-semibold mb-6 text-cyan-800">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="form-control">
                    <label className="label" htmlFor="name">
                      <span className="label-text text-cyan-800 font-semibold">Nombre</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="input input-bordered bg-white w-full"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="email">
                      <span className="label-text text-cyan-800 font-semibold">Email</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="input input-bordered bg-white w-full"
                      placeholder="Tu email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-control mb-6">
                  <label className="label" htmlFor="subject">
                    <span className="label-text text-cyan-800 font-semibold">Asunto</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="input input-bordered bg-white w-full"
                    placeholder="Asunto de tu mensaje"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-control mb-6">
                  <label className="label" htmlFor="content">
                    <span className="label-text text-cyan-800 font-semibold">Contenido</span>
                  </label>
                  <textarea
                    id="content"
                    rows={6}
                    className="textarea textarea-bordered bg-white w-full"
                    placeholder="Tu mensaje"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="btn btn-primary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enviar mensaje
                  <Send size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>

          <motion.div className="space-y-8" variants={fadeInUp}>
            <motion.div
              className="card bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {mainContact.address && (
                <iframe
                  title="Ubicación Colegio Nacional de Topógrafos"
                  src="https://maps.google.com/maps?q=C.%20Junin%20N°848%20esq.%20Teniente%20Arevalo,%20Cochabamba&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-64"
                  frameBorder="0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
            </motion.div>

            <motion.div
              className="card bg-white border border-gray-200 shadow-md rounded-xl p-8"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="flex items-center text-xl font-semibold mb-4 text-cyan-800">
                <Clock size={20} className="mr-2 text-cyan-700" />
                Horario de atención
              </h3>
              {mainContact.business_hours ? (
                <div className="space-y-2 text-cyan-900 whitespace-pre-line">
                  {mainContact.business_hours.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </div>
              ) : (
                <p className="text-cyan-700">Horario no disponible</p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {faqs.length > 0 && (
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-bold mb-8 text-cyan-800">Preguntas frecuentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq) => (
                <FaqItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const ContactCard = ({ icon, title, details }: { icon: React.ReactNode, title: string, details: string[] }) => {
  return (
    <motion.div
      className="card bg-white border border-gray-200 shadow-md rounded-xl p-8 flex flex-col items-center text-center cursor-default hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.05, boxShadow: "0 12px 30px rgba(6, 182, 212, 0.3)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
        {icon}
      </div>
      <h3 className="card-title text-xl mb-3 text-cyan-800">{title}</h3>
      <div className="space-y-1 mb-6 text-cyan-900">
        {details.map((detail, index) => (
          <p key={index}>{detail}</p>
        ))}
      </div>
    </motion.div>
  );
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  return (
    <motion.div
      className="card bg-white border border-gray-200 shadow-md rounded-xl p-6 cursor-default hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.03, boxShadow: "0 12px 30px rgba(6, 182, 212, 0.2)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="card-title text-lg mb-3 font-semibold text-cyan-800">{question}</h3>
      <p className="text-cyan-900">{answer}</p>
    </motion.div>
  );
};

export default ContactPage;