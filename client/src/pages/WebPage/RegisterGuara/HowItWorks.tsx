import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryService } from '@/core/services/history/history.service';
import type { IHistory } from '@/core/types/IHistory';
import { RequirementService } from '@/core/services/requirement/requirement.service';
import type { IRequirement } from '@/core/types/IRequirement';

export default function RegisterGuaraHowItWorks() {
  const { t } = useTranslation();
  const [histories, setHistories] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<IRequirement[]>([]);
  const [reqLoading, setReqLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
  
  function getBannerImageUrl(image?: string | null): string {
    if (!image) return 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2000&auto=format&fit=crop';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return `${API_BASE}/${image.replace(/^\/?api(\/|$)/, '')}`;
  }

  useEffect(() => {
    async function fetchHistories() {
      setLoading(true);
      try {
        const res = await HistoryService.getAll();
        const historyList = Array.isArray(res.data) ? res.data : [];
        setHistories(historyList);
      } catch (err) {
        console.log('Error fetching histories:', err);
        setHistories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistories();
  }, []);

  useEffect(() => {
    async function fetchRequirements() {
      setReqLoading(true);
      try {
        const res = await RequirementService.getAll();
        const list = Array.isArray(res.data) ? res.data : [];
        // Sort by order if present
        list.sort((a: IRequirement, b: IRequirement) => {
          const ao = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
          const bo = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
          return ao - bo;
        });
        setRequirements(list);
      } catch (err) {
        console.log('Error fetching requirements:', err);
        setRequirements([]);
      } finally {
        setReqLoading(false);
      }
    }
    fetchRequirements();
  }, []);

  function FileIcon() {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 4a2 2 0 012-2h7.586a2 2 0 011.414.586l3.414 3.414A2 2 0 0120 7.414V20a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9h6M8 13h6M8 17h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - More elegant */}
      <section className="relative !bg-[#1A1B16]  text-white py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
          
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {t('navigation.howItWorks')}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Learn how GU protects your home improvement projects with verified contractors
            </p>
          </div>
        </div>
      </section>

      {/* Requirements - List Style Card */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          {reqLoading ? (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Loading requirements...</span>
            </div>
          ) : requirements.length === 0 ? (
            <div className="text-gray-500">No requirements available at this time.</div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-[#1A1B16]/10 bg-white shadow-sm">
              <div className="bg-primary text-[#1A1B16] px-6 py-4 font-extrabold text-2xl">GU</div>
              <ul className="divide-y divide-primary/20">
                {requirements.map((req) => (
                  <li key={req.id} className="bg-[#F7FAFF]" style={{ background: 'white', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', opacity: 1, transform: 'none' }}>
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-primary ring-1 ring-primary/30">
                        <FileIcon />
                      </div>
                      <div className="flex-1">
                        <div className="text-[#1A1B16] font-medium">{req.title}</div>
                        {req.description && (
                          <div className="text-sm text-gray-600">{req.description}</div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Histories Content - Elegant Cards */}
      <section className="py-20 bg-gradient-to-br from-primary via-[#f5d865] to-primary relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
              </div>
              <p className="mt-6 text-gray-600 font-medium">Loading content...</p>
            </div>
          ) : histories.length === 0 ? (
            <div className="text-center py-32">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-xl">No content available at this time.</p>
            </div>
          ) : (
            <div className="space-y-32">
              {histories.map((history, index) => (
                <article 
                  key={history.id} 
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                >
                  {/* Image Gallery - Refined */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative">
                      {/* Main Banner */}
                      {history.banner1 && (
                        <div className="rounded-3xl overflow-hidden shadow-2xl mb-6 group">
                          <div className="relative overflow-hidden">
                            <img
                              src={getBannerImageUrl(history.banner1)}
                              alt={history.title}
                              className="w-full h-[28rem] object-cover will-change-transform transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.08] group-hover:rotate-[0.5deg] group-hover:-translate-y-1 group-hover:brightness-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Secondary Banners Grid */}
                      {(history.banner2 || history.banner3) && (
                        <div className="grid grid-cols-2 gap-6">
                          {history.banner2 && (
                            <div className="rounded-2xl overflow-hidden shadow-xl group">
                              <div className="relative overflow-hidden">
                                <img
                                  src={getBannerImageUrl(history.banner2)}
                                  alt={`${history.title} - 2`}
                                  className="w-full h-56 object-cover will-change-transform transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.06] group-hover:rotate-[0.5deg] group-hover:-translate-y-1 group-hover:brightness-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </div>
                            </div>
                          )}
                          
                          {history.banner3 && (
                            <div className="rounded-2xl overflow-hidden shadow-xl group">
                              <div className="relative overflow-hidden">
                                <img
                                  src={getBannerImageUrl(history.banner3)}
                                  alt={`${history.title} - 3`}
                                  className="w-full h-56 object-cover will-change-transform transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.06] group-hover:rotate-[0.5deg] group-hover:-translate-y-1 group-hover:brightness-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content - Refined Typography */}
                  <div className="w-full lg:w-1/2">
                    <div className="lg:px-8">
                      {/* Badge (beautified) */}
                      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6 bg-[#1A1B16]/70 backdrop-blur-sm ring-1 ring-[#1A1B16]/30 shadow-sm hover:shadow-md transition">
                        <span className="relative flex w-2.5 h-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping"></span>
                          <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-primary"></span>
                        </span>
                        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-white">
                          Story GU
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        {history.title}
                      </h2>
                      
                      {history.description && (
                        <p className="text-xl text-white mb-8 leading-relaxed font-medium border-l-4 border-[#1A1B16] pl-6">
                          {history.description}
                        </p>
                      )}
                      
                      {history.content && (
                        <div className="prose prose-lg max-w-none">
                          <p className="text-white/90 leading-loose whitespace-pre-wrap">
                            {history.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - Refined */}
    
    </div>
  );
}
