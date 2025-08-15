import React, { useState } from 'react';
import { Users, Clock, Award } from 'lucide-react';
import { motion } from "framer-motion";

const Coursespage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="w-full bg-gradient-to-r from-cyan-700 to-blue-900 rounded-b-3xl shadow-lg max-w-6xl mx-auto text-center text-white py-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-wide"
        >
          Nuestros Cursos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-3 text-lg text-blue-100"
        >
          Potencia tus habilidades con cursos prácticos de topografía y geomática, dictados por expertos del sector.
        </motion.p>
      </div>
      
      <div className="container mx-auto px-6 md:px-12">
        {/* Course categories and filters */}
        <div className="my-10">
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Categorías de cursos</h2>
           {/*  <div className="flex items-center space-x-2">
              <Filter size={18} />
              <span className="text-gray-700">Filtrar por:</span>
            </div> */}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <FilterButton 
              active={activeFilter === 'all'} 
              onClick={() => handleFilterChange('all')}
            >
              Todos
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'topography'} 
              onClick={() => handleFilterChange('topography')}
            >
              Topografía
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'gis'} 
              onClick={() => handleFilterChange('gis')}
            >
              SIG
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'surveying'} 
              onClick={() => handleFilterChange('surveying')}
            >
              Medición
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'drones'} 
              onClick={() => handleFilterChange('drones')}
            >
              Drones
            </FilterButton>
          </div>
        </div>

        {/* Featured courses */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cursos destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCard 
              imageUrl="src/assets/images/Dron.jpg"
              title="Topografía con drones"
              category="Drones"
              rating={4.8}
              students={245}
              duration="6 semanas"
              description="Aprende a utilizar drones para levantamientos topográficos y modelos 3D del terreno con precisión."
              price="590Bs"
              featured={true}
            />
            <CourseCard 
              imageUrl="src/assets/images/Gis-urbanismo.jpg"
              title="SIG aplicado a urbanismo"
              category="SIG"
              rating={4.6}
              students={187}
              duration="8 semanas"
              description="Domina los sistemas de información geográfica aplicados a proyectos urbanísticos y planificación territorial."
              price="690Bs"
              featured={true}
            />
            <CourseCard 
              imageUrl="src/assets/images/Geomatica.jpg"
              title="Introducción a la geomática"
              category="Geomática"
              rating={4.9}
              students={312}
              duration="4 semanas"
              description="Fundamentos de la geomática para profesionales que inician en el sector de la topografía."
              price="390Bs"
              featured={true}
            />
          </div>
        </div>

        {/* All courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Todos los cursos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCard 
              imageUrl="src/assets/images/GNSS.jpeg"
              title="Tecnologías GNSS avanzadas"
              category="Medición"
              rating={4.7}
              students={156}
              duration="6 semanas"
              description="Profundiza en las técnicas avanzadas de medición con sistemas GNSS para topografía de precisión."
              price="590Bs"
            />
            <CourseCard 
              imageUrl="src/assets/images/cartografia-digital.jpg"
              title="Cartografía digital"
              category="SIG"
              rating={4.5}
              students={203}
              duration="5 semanas"
              description="Elaboración de cartografía digital con las herramientas más utilizadas en el sector profesional."
              price="490Bs"
            />
            <CourseCard 
              imageUrl="src/assets/images/teledeteccion.jpg"
              title="Fotogrametría y teledetección"
              category="Teledetección"
              rating={4.8}
              students={178}
              duration="7 semanas"
              description="Técnicas avanzadas de fotogrametría y teledetección para análisis territorial y medioambiental."
              price="590Bs"
            />
            <CourseCard 
              imageUrl="src/assets/images/topografia-obras.jpg"
              title="Topografía de obras"
              category="Topografía"
              rating={4.6}
              students={234}
              duration="8 semanas"
              description="Metodologías y técnicas para el control topográfico en obras de edificación e infraestructuras."
              price="690Bs"
            />
            <CourseCard 
              imageUrl="src/assets/images/sistema-lidar.jpg"
              title="Sistemas LiDAR en topografía"
              category="LiDAR"
              rating={4.9}
              students={145}
              duration="6 semanas"
              description="Aplicación de la tecnología LiDAR para levantamientos topográficos de alta precisión."
              price="750Bs"
            />
            <CourseCard 
              imageUrl="src/assets/images/Registro-catastral.jpg"
              title="Catastro y registros"
              category="Catastro"
              rating={4.4}
              students={167}
              duration="5 semanas"
              description="Gestión catastral y registral del territorio. Normativa y procedimientos administrativos."
              price="450Bs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const FilterButton = ({ active, onClick, children }: FilterButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-md transition-colors duration-200 ${
        active
          ? 'bg-blue-900 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface CourseCardProps {
  imageUrl: string;
  title: string;
  category: string;
  rating: number;
  students: number;
  duration: string;
  description: string;
  price: string;
  featured?: boolean;
}

const CourseCard = ({ 
  imageUrl, 
  title, 
  category, 
  rating, 
  students, 
  duration, 
  description, 
  price,
  featured = false
}: CourseCardProps) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
      featured ? 'border-2 border-cyan-500' : ''
    }`}>
      <div className="relative h-48 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        {featured && (
          <div className="absolute top-3 right-3 bg-cyan-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Destacado
          </div>
        )}
        <div className="absolute top-3 left-3 bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded">
          {category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Award size={16} className="mr-1 text-yellow-500" />
            <span>{rating}/5</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{students} estudiantes</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">{price}</span>
          <button className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Más información
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coursespage;