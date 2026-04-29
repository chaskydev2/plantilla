import React, { useEffect, useState } from 'react';
import { getFirstFifteenServices, getAllServices } from '../../core/services/service/service.service';
import type { IService } from '../../core/types/IService';
import { FaChevronRight, FaListUl, FaTimes } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
const DEFAULT_SERVICE_IMAGE = 'https://via.placeholder.com/150/0891b2/ffffff?text=Service';

function getServiceImageUrl(image?: string | null): string {
  if (!image || image.trim() === '') return DEFAULT_SERVICE_IMAGE;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const fullUrl = `${API_BASE}/${image.replace(/^\//, '')}`;
  return fullUrl;
}

const getServiceDescription = (service: IService): string => {
  return (service.description ?? '').trim() || '';
};

const Services: React.FC = () => {
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [popularServices, setPopularServices] = useState<IService[]>([]);
  const [allServices, setAllServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [visibleServicesCount, setVisibleServicesCount] = useState(6);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Cargar los primeros 15 servicios al montar
  useEffect(() => {
    setLoading(true);
    getFirstFifteenServices()
      .then((res) => {
        if (res.success) setPopularServices(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Cargar todos los servicios cuando se abre el modal
  useEffect(() => {
    if (servicesModalOpen && allServices.length === 0) {
      setLoadingAll(true);
      getAllServices()
        .then((res) => {
          if (res.success) setAllServices(res.data);
        })
        .finally(() => setLoadingAll(false));
    }
  }, [servicesModalOpen, allServices.length]);

  // Reset visible count when modal closes
  useEffect(() => {
    if (!servicesModalOpen) {
      setVisibleServicesCount(6);
    }
  }, [servicesModalOpen]);

  // Handle scroll for infinite loading
  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPercentage = (target.scrollTop + target.clientHeight) / target.scrollHeight;
    if (scrollPercentage > 0.8 && visibleServicesCount < allServices.length) {
      setVisibleServicesCount((prev) => Math.min(prev + 6, allServices.length));
    }
  };

  // Carousel navigation
  const itemsPerView = 3;
  const maxIndex = Math.max(0, popularServices.length - itemsPerView);
  
  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-primary)', color: 'var(--color-secondary)' }}
    >
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12 space-y-10">
          <header className="px-6 py-10 text-center flex flex-col items-center gap-2">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)] animate-fade-in">
              Popular Services
            </h2>
            <p className="mt-2 text-gray-600 animate-fade-in delay-100 text-base">
              Find trusted professionals for your needs
            </p>
          </header>
          <div className="rounded-2xl border px-6 py-10 md:px-10 shadow-sm text-center" style={{ background: 'white', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', opacity: 1, transform: 'none' }}>
            <div className="relative z-10">
              <div className="relative overflow-hidden">
                {/* Botón anterior */}
                {carouselIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all"
                    aria-label="Previous"
                  >
                    <svg className="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                <div className="overflow-hidden">
                  <div 
                    className="flex gap-6 transition-transform duration-500 ease-out py-2"
                    style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerView)}%)` }}
                  >
                    {loading ? (
                      <div className="text-center w-full">Loading...</div>
                    ) : (
                      popularServices.map((s, i) => (
                        <article
                          key={s.id}
                          className="group min-w-[calc(100%/3-1rem)] rounded-2xl bg-white border border-[rgba(0,0,0,0.08)] shadow-md hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center gap-2 animate-fade-in"
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--color-secondary)] shadow">
                            <img
                              src={getServiceImageUrl(s.image)}
                              alt={s.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = DEFAULT_SERVICE_IMAGE;
                              }}
                            />
                          </div>
                          <h3 className="mt-2 text-lg font-bold text-[var(--color-secondary)] flex items-center gap-1">
                            {s.name}
                          </h3>
                          <p className="text-xs text-gray-500 text-center line-clamp-2 min-h-[2.5em]">
                            {getServiceDescription(s)}
                          </p>
                        </article>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Botón siguiente */}
                {carouselIndex < maxIndex && (
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all"
                    aria-label="Next"
                  >
                    <svg className="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setServicesModalOpen(true)}
                className="inline-flex items-center px-6 py-3 rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white text-[var(--color-secondary)] hover:bg-[rgba(255,255,255,0.92)] shadow-lg font-semibold text-lg transition-all duration-300 animate-fade-in delay-200"
              >
                <span className="mr-2">All Services</span>
                <FaChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {servicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.35)] backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] p-8 relative animate-slide-up border border-[rgba(0,0,0,0.08)] flex flex-col">
            <button
              className="absolute top-2 right-3 text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.7)] text-3xl transition-colors duration-200 z-10"
              onClick={() => setServicesModalOpen(false)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-secondary)] animate-fade-in flex items-center justify-center gap-2">
              <FaListUl className="w-7 h-7 text-[var(--color-secondary)]" /> Todos los Servicios
            </h2>
            {loadingAll ? (
              <div className="text-center py-8">Cargando...</div>
            ) : (
              <div 
                className="overflow-y-auto flex-1 pr-2"
                onScroll={handleModalScroll}
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-secondary) transparent' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allServices.slice(0, visibleServicesCount).map((s, i) => (
                    <article
                      key={s.id}
                      className="flex flex-col gap-3 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5 text-left shadow-md hover:shadow-2xl transition-all duration-300 animate-fade-in items-center"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--color-secondary)] shadow mx-auto">
                        <img
                          src={getServiceImageUrl(s.image)}
                          alt={s.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = DEFAULT_SERVICE_IMAGE;
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-1">
                        {s.name}
                      </h3>
                    </article>
                  ))}
                </div>
                {visibleServicesCount < allServices.length && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Desliza para ver más servicios ({visibleServicesCount} de {allServices.length})
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Animaciones CSS */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.7s both; }
        .animate-fade-in-fast { animation: fade-in 0.3s both; }
        @keyframes slide-up { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(.4,2,.6,1) both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Services;