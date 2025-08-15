import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import BannerImg from "@/assets/images/backgroudHD.jpg";
import { createApiService } from '@/core/services/api.service'
import { useEffect, useState } from "react";
import type { IBanner } from "@/core/types/IBanner";
import type { IAnnouncement } from "@/core/types/IAnnouncement";
import { formatDate, formatDateTime } from "@/core/utils/dateUtils";
import type { ICourse } from "@/core/types/ICourse";
import type { IEvent } from "@/core/types/IEvent";
import TitleMain from "@/components/common/TitleMain";

const HomePage = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const BannerService = createApiService({ basePath: 'banners' });
  const AnnouncementService = createApiService({ basePath: 'announcements' });
  const CourseService = createApiService({ basePath: 'courses' });
  const EventService = createApiService({ basePath: 'events' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getBanners(),
          getAnnouncements(),
          getCourses(),
          getEvents()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBanners = async () => {
    const response = await BannerService.get("all");
    setBanners(response.data);
  }

  const getAnnouncements = async () => {
    const response = await AnnouncementService.get("all");
    setAnnouncements(response.data);
  }

  const getCourses = async () => {
    const response = await CourseService.get("all");
    setCourses(response.data);
  }

  const getEvents = async () => {
    const response = await EventService.get("all");
    setEvents(response.data);
  }

  return (
    <div className="flex flex-col">
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading-banner"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-700 via-blue-900 to-indigo-800"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="h-16 w-16 rounded-full border-4 border-white/30 border-t-white animate-spin"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="loaded-banner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url(${banners[0]?.image || BannerImg})`,
              }}
            >
              <div className="absolute inset-0 bg-blue-950/75"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={!isLoading ? { opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-lg"
              >
                {banners[0]?.title || "Bienvenido al Colegio de Topógrafos"}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={!isLoading ? { opacity: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-xl text-gray-200 mb-8 drop-shadow-md"
              >
                {banners[0]?.subtitle || "Formación especializada para profesionales"}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={!isLoading ? { opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link
                  to="/contacto"
                  className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-bold py-3 px-10 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
                >
                  Contactar
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 100"
            className="fill-white w-full block"
            preserveAspectRatio="none"
            style={{ height: "100px" }}
          >
            <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {!isLoading && (
        <>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Noticias y Comunicados</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Mantente informado sobre las últimas actualizaciones del Colegio de Topógrafos.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    title={announcement.title}
                    description={announcement.content || ''}
                    imageUrl={announcement.image || ''}
                    date={announcement.start_date}
                  />
                ))}
              </div>
            </div>
          </section>

          <TitleMain 
            title="Por qué elegirnos"
            subtitle="Una formación completa y especializada para quienes construyen el futuro de la topografía."
          />

          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Cursos destacados</h2>
                  <p className="text-lg text-gray-600 max-w-2xl">
                    Explora nuestra selección de cursos diseñados para mejorar tus habilidades en topografía.
                  </p>
                </div>
                <Link
                  to="/cursos"
                  className="mt-4 md:mt-0 text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
                >
                  Ver todos los cursos
                  <ArrowRight size={18} className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    title={course.name}
                    duration={formatDate(course.start_date) + " - " + formatDate(course.end_date)}
                    cost={course.cost + "Bs"}
                    modality={course.modality}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Próximos eventos</h2>
                  <p className="text-lg text-gray-600 max-w-2xl">
                    Participa y potencia tu conocimiento con las tendencias más actuales de la industria.
                  </p>
                </div>
                <Link
                  to="/events"
                  className="mt-4 md:mt-0 text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
                >
                  Ver todos los eventos
                  <ArrowRight size={18} className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    date={formatDate(event.start_date)}
                    title={event.name}
                    location={event.location}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const AnnouncementCard = ({
  imageUrl,
  title,
  description,
  date,
}: {
  imageUrl: string;
  title: string;
  description: string;
  date: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
  >
    {imageUrl && <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />}
    <div className="p-6">
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-700 mb-4">{description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Fecha: {formatDateTime(date)}</span>
      </div>
    </div>
  </motion.div>
);

const CourseCard = ({
  title,
  duration,
  cost,
  modality,
}: {
  title: string;
  duration: string;
  cost: string;
  modality: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
  >
    <div className="p-6">
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-700 mb-4">{duration}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Costo: {cost}</span>
        <span>Modalidad: {modality}</span>
      </div>
    </div>
  </motion.div>
);

const EventCard = ({
  date,
  title,
  location,
}: {
  date: string;
  title: string;
  location: string;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
  >
    <div>
      <time dateTime={date} className="block mb-3 text-sm text-cyan-600 font-semibold">
        {date}
      </time>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
    </div>
    <div className="flex items-center text-gray-500 text-sm">
      <MapPin size={16} className="mr-1" /> {location}
    </div>
  </motion.article>
);

export default HomePage;