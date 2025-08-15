import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentMonth, setCurrentMonth] = useState('Junio 2025');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Para carousel automático de la galería
  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handlePrevMonth = () => {
    // Animación y cambio de mes simplificado
    if (currentMonth === 'Junio 2025') setCurrentMonth('Mayo 2025');
    else if (currentMonth === 'Julio 2025') setCurrentMonth('Junio 2025');
  };

  const handleNextMonth = () => {
    if (currentMonth === 'Mayo 2025') setCurrentMonth('Junio 2025');
    else if (currentMonth === 'Junio 2025') setCurrentMonth('Julio 2025');
  };

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-cyan-700 to-blue-900 text-white py-16 px-6 md:px-12 mb-20 rounded-b-3xl shadow-lg max-w-6xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-bold tracking-wide"
        >
          Eventos y Actividades
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-3 text-lg text-blue-100"
        >
          Mantente al día con los eventos más relevantes para los profesionales de la topografía.
        </motion.p>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 md:px-12 my-10">

        {/* Filtros */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Calendario de eventos</h2>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {['all','conferences','workshops','webinars','networking'].map((filter) => (
              <FilterButton 
                key={filter} 
                active={activeFilter === filter} 
                onClick={() => handleFilterChange(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter === 'all' ? 'Todos' : 
                 filter === 'conferences' ? 'Conferencias' : 
                 filter === 'workshops' ? 'Talleres' :
                 filter === 'webinars' ? 'Webinars' : 'Networking'}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Selector de mes */}
        <motion.div 
          key={currentMonth} // re-render para animar cuando cambia mes
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <motion.button 
            className="text-gray-600 hover:text-blue-900 transition-colors" 
            onClick={handlePrevMonth}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            &larr; Mes anterior
          </motion.button>
          <h3 className="text-xl font-semibold text-blue-900">{currentMonth}</h3>
          <motion.button 
            className="text-gray-600 hover:text-blue-900 transition-colors" 
            onClick={handleNextMonth}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Mes siguiente &rarr;
          </motion.button>
        </motion.div>

        {/* Eventos destacados */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Eventos destacados</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FeaturedEventCard 
              imageUrl="src/assets/images/Congreso.jpg"
              date="15-17 Jun 2025"
              title="Congreso Nacional de Topografía"
              location="Cochabamba, Bolivia"
              description="El evento más importante del año para profesionales de la topografía..."
              attendees={350}
              isFree={false}
              category="Conferencia"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.3 }}
            />
            <FeaturedEventCard 
              imageUrl="src/assets/images/taller.jpg"
              date="22 Jul 2025"
              title="Taller: Nuevas tecnologías en levantamientos topográficos"
              location="Cochabamba, Bolivia"
              description="Taller práctico sobre las últimas tecnologías aplicadas..."
              attendees={75}
              isFree={false}
              category="Taller"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Galería de fotos */}
        <PhotoGallery galleryIndex={galleryIndex} setGalleryIndex={setGalleryIndex} />

        {/* Próximos eventos */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Próximos eventos</h2>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
            }}
            className="space-y-6"
          >
            <EventCard date="5 Jun 2025" title="Webinar: Normativa catastral actualizada" category="Webinar" location="Online" time="17:00 - 19:00" isFree />
            <EventCard date="10 Jun 2025" title="Mesa redonda: El futuro de la profesión topográfica" category="Networking" location="Cochabamba, Bolivia" time="18:30 - 20:30" isFree />
            <EventCard date="18 Jun 2025" title="Taller práctico: Drones en topografía" category="Taller" location="Cochabamba, Bolivia" time="9:00 - 14:00" isFree={false} />
            <EventCard date="24 Jun 2025" title="Presentación: Nuevos equipos de medición láser" category="Presentación" location="Cochabamba, Bolivia" time="11:00 - 13:00" isFree />
            <EventCard date="28 Jun 2025" title="Seminario: Georreferenciación de parcelas rurales" category="Seminario" location="Cochabamba, Bolivia" time="10:00 - 14:00" isFree={false} />
            <EventCard date="30 Jun 2025" title="Networking: Oportunidades profesionales en topografía" category="Networking" location="Cochabamba, Bolivia" time="19:00 - 21:00" isFree />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Imágenes para galería
const images = [
  { url: 'src/assets/images/taller.jpg', alt: 'Evento 1' },
  { url: 'src/assets/images/congreso.jpg', alt: 'Evento 2' },
  { url: 'src/assets/images/reunion.jpg', alt: 'Evento 3' },
  { url: 'src/assets/images/taller.jpg', alt: 'Evento 4' },
];

// Componente Galería con animación y auto slide
const PhotoGallery = ({ galleryIndex, setGalleryIndex }: { galleryIndex: number, setGalleryIndex: React.Dispatch<React.SetStateAction<number>> }) => {
  const nextSlide = () => setGalleryIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="mb-20 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Galería de eventos</h2>
      <div className="relative overflow-hidden rounded-lg shadow-lg group">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[galleryIndex].url}
            src={images[galleryIndex].url}
            alt={images[galleryIndex].alt}
            className="w-full h-96 object-cover"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7 }}
          />
        </AnimatePresence>
        <motion.button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-800 rounded-full p-2 shadow"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          ◀
        </motion.button>
        <motion.button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-800 rounded-full p-2 shadow"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          ▶
        </motion.button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${i === galleryIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
              layoutId={i === galleryIndex ? "activeDot" : undefined}
              onClick={() => setGalleryIndex(i)}
              style={{ cursor: 'pointer' }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Botones filtro animados
const FilterButton = ({ active, onClick, children, ...props }: any) => (
  <motion.button
    className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${active ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </motion.button>
);

// Evento destacado animado
const FeaturedEventCard = ({ imageUrl, date, title, location, description, attendees, isFree, category, ...props }: any) => (
  <motion.div
    className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col border border-gray-200"
    {...props}
  >
    <div className="relative h-48 overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      <div className="absolute top-3 right-3 bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded">{category}</div>
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <div className="flex items-center text-sm text-blue-600 mb-2">
        <Calendar size={16} className="mr-1" />
        <span>{date}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 flex items-center mb-3"><MapPin size={16} className="mr-1" />{location}</p>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <div className="mt-auto flex justify-between items-center">
        <div className="flex items-center text-gray-500"><Users size={16} className="mr-1" /><span>{attendees} asistentes previstos</span></div>
        <span className={`text-sm font-semibold ${isFree ? 'text-green-600' : 'text-red-600'}`}>{isFree ? 'Gratuito' : 'De pago'}</span>
      </div>
    </div>
    <div className="bg-gray-50 p-4 border-t border-gray-100">
      <button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">Inscribirse</button>
    </div>
  </motion.div>
);

// Evento simple animado
const EventCard = ({ date, title, category, location, time, isFree }: any) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row md:items-center border border-gray-200"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
    transition={{ duration: 0.3 }}
  >
    <div className="md:mr-6 flex-shrink-0 text-blue-900 font-bold text-lg">{date}</div>
    <div className="flex-grow">
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <div className="flex flex-wrap text-sm text-gray-600 gap-4">
        <span className="flex items-center"><Calendar size={16} className="mr-1" />{category}</span>
        <span className="flex items-center"><MapPin size={16} className="mr-1" />{location}</span>
        <span className="flex items-center"><Clock size={16} className="mr-1" />{time}</span>
        <span className={`font-semibold ${isFree ? 'text-green-600' : 'text-red-600'}`}>{isFree ? 'Gratuito' : 'De pago'}</span>
      </div>
    </div>
  </motion.div>
);

export default EventsPage;
