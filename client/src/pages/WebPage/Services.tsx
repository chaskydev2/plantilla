import React, { useEffect, useState } from 'react';
import { getFirstFifteenServices, getAllServices } from '../../core/services/service/service.service';
import type { IService } from '../../core/types/IService';

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
          <header className=" px-6 py-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)] animate-fade-in">
              Popular Services Near You
            </h2>
            <p className="mt-3 text-gray-600 animate-fade-in delay-100">
              Find trusted professionals for your needs
            </p>
          </header>

          {/* Carousel */}
          <div className="relative overflow-hidden rounded-3xl bg-white px-6 py-12 text-center shadow-2xl border border-[rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 opacity-70 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,214,10,0.18),transparent_65%)]"></div>
            <div className="absolute -top-10 -right-6 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.08),transparent_55%)] blur-xl pointer-events-none"></div>
            <div className="relative z-10 space-y-10">
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between md:text-left">
                <div className="inline-flex items-center gap-3 rounded-full bg-[rgba(0,0,0,0.04)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-secondary)]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-secondary)] text-white shadow-md">
                    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 1.5 12.3 7l5.2.38-4 3.56 1.3 5.06L10 13.9 5.2 16.9 6.5 11.84 2.5 7.38 7.7 7z" />
                    </svg>
                  </span>
                  Curated Selection
                </div>
                <p className="max-w-2xl text-sm md:text-base text-gray-600 md:text-right md:ml-auto">
                  Browse highly rated professionals with verified reviews and premium availability windows.
                </p>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10 hidden md:block"></div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10 hidden md:block"></div>
                <div className="relative overflow-hidden group/services">
                  <div className="flex w-[200%] gap-6 animate-[scroll-left_40s_linear_infinite] group-hover/services:[animation-play-state:paused]">
                    {/* first strip */}
                    <div className="flex gap-6">
                      {loading ? (
                        <div className="text-center w-full">Loading...</div>
                      ) : (
                        popularServices.map((s, i) => (
                          <article
                            key={`a-${s.id}`}
                            className="group shrink-0 w-[280px] sm:w-[320px] transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in"
                            style={{ animationDelay: `${i * 60}ms` }}
                          >
                            <div className="relative w-full pt-[66%] rounded-2xl overflow-hidden shadow-md border border-[rgba(0,0,0,0.08)] bg-white">
                              <img
                                src={getServiceImageUrl(s.image)}
                                alt={s.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                            </div>
                            <h3 className="mt-4 text-center text-xl md:text-2xl font-semibold text-[var(--color-secondary)] group-hover:text-[var(--color-secondary)]/80 transition-colors duration-300">
                              {s.name}
                            </h3>
                            <p
                              className="mt-3 text-center text-sm text-gray-600"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                minHeight: '4.5rem',
                              }}
                            >
                              {getServiceDescription(s)}
                            </p>
                          </article>
                        ))
                      )}
                    </div>
                    {/* second strip */}
                    <div className="flex gap-6">
                      {loading ? (
                        <div className="text-center w-full">Loading...</div>
                      ) : (
                        popularServices.map((s, i) => (
                          <article
                            key={`b-${s.id}`}
                            className="group shrink-0 w-[280px] sm:w-[320px] transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in"
                            style={{ animationDelay: `${i * 60}ms` }}
                          >
                            <div className="relative w-full pt-[66%] rounded-2xl overflow-hidden shadow-md border border-[rgba(0,0,0,0.08)] bg-white">
                              <img
                                src={getServiceImageUrl(s.image)}
                                alt={s.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                            </div>
                            <h3 className="mt-4 text-center text-xl md:text-2xl font-semibold text-[var(--color-secondary)] group-hover:text-[var(--color-secondary)]/80 transition-colors duration-300">
                              {s.name}
                            </h3>
                            <p
                              className="mt-3 text-center text-sm text-gray-600"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                minHeight: '4.5rem',
                              }}
                            >
                              {getServiceDescription(s)}
                            </p>
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Show more button below carousel */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setServicesModalOpen(true)}
              className="inline-flex items-center px-6 py-3 rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white text-[var(--color-secondary)] hover:bg-[rgba(255,255,255,0.92)] shadow-lg font-semibold text-lg transition-all duration-300 animate-fade-in delay-200"
            >
              <span className="mr-2">Show More</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Modal para mostrar todos los servicios */}
      {servicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.35)] backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 relative animate-slide-up border border-[rgba(0,0,0,0.08)]">
            <button
              className="absolute top-2 right-3 text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.7)] text-3xl transition-colors duration-200"
              onClick={() => setServicesModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-secondary)] animate-fade-in">All Services</h2>
            {loadingAll ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allServices.map((s, i) => (
                  <article
                    key={s.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5 text-left shadow-md hover:shadow-2xl transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="relative w-full overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)] bg-white">
                      <div className="relative w-full pt-[62%]">
                        <img
                          src={getServiceImageUrl(s.image)}
                          alt={s.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[var(--color-secondary)]">
                        {s.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {getServiceDescription(s)}
                      </p>
                    </div>
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
      `}</style>
    </div>
  );
};

export default Services;