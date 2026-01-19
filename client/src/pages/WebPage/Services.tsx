import React, { useEffect, useState } from 'react';
import { getFirstFifteenServices, getAllServices } from '../../core/services/service/service.service';
import type { IService } from '../../core/types/IService';
import { FaChevronRight, FaListUl, FaTimes } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';

function getServiceImageUrl(image?: string | null): string {
  if (!image) return '/images/default-service.jpg';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${API_BASE}/${image.replace(/^\//, '')}`;
}

const getServiceDescription = (service: IService): string => {
  return (service.description ?? '').trim() || 'Details coming soon for this service.';
};

const Services: React.FC = () => {
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [popularServices, setPopularServices] = useState<IService[]>([]);
  const [allServices, setAllServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

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
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 min-w-full py-2">
                  {loading ? (
                    <div className="text-center w-full">Loading...</div>
                  ) : (
                    popularServices.map((s, i) => (
                      <article
                        key={s.id}
                        className="group w-64 rounded-2xl bg-white border border-[rgba(0,0,0,0.08)] shadow-md hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center gap-2 animate-fade-in"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--color-secondary)] shadow">
                          <img
                            src={getServiceImageUrl(s.image)}
                            alt={s.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 relative animate-slide-up border border-[rgba(0,0,0,0.08)]">
            <button
              className="absolute top-2 right-3 text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.7)] text-3xl transition-colors duration-200"
              onClick={() => setServicesModalOpen(false)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-secondary)] animate-fade-in flex items-center justify-center gap-2">
              <FaListUl className="w-7 h-7 text-[var(--color-secondary)]" /> All Services
            </h2>
            {loadingAll ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allServices.map((s, i) => (
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
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-1">
                      {s.name}
                    </h3>
                  </article>
                ))}
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