import { useEffect, useState } from 'react';
import { HistoryService } from '@/core/services/history/history.service';
import type { IHistory } from '@/core/types/IHistory';

const RegisterGuara = () => {
  const [histories, setHistories] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white py-20">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-center">
            GU History & Guarantee
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-300">
            Discover our story, values, and the guarantee that protects your home improvement projects
          </p>
        </div>
      </section>

      {/* Histories Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading histories...</p>
            </div>
          ) : histories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No histories available at this time.</p>
            </div>
          ) : (
            <div className="space-y-20">
              {histories.map((history, index) => (
                <article 
                  key={history.id} 
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                >
                  {/* Image Gallery */}
                  <div className="w-full lg:w-1/2">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Main Banner */}
                      {history.banner1 && (
                        <div className="col-span-2 rounded-2xl overflow-hidden shadow-xl">
                          <img
                            src={getBannerImageUrl(history.banner1)}
                            alt={history.title}
                            className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      {/* Secondary Banners */}
                      {history.banner2 && (
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                          <img
                            src={getBannerImageUrl(history.banner2)}
                            alt={`${history.title} - 2`}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      {history.banner3 && (
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                          <img
                            src={getBannerImageUrl(history.banner3)}
                            alt={`${history.title} - 3`}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1A1B16] mb-4">
                      {history.title}
                    </h2>
                    
                    {history.description && (
                      <p className="text-lg text-gray-700 mb-6 font-medium">
                        {history.description}
                      </p>
                    )}
                    
                    {history.content && (
                      <div className="prose prose-lg max-w-none text-gray-600">
                        <p className="whitespace-pre-wrap">{history.content}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1B16] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-[#1A1B16]/80 mb-8 max-w-2xl mx-auto">
            Find verified contractors backed by our $250,000 guarantee
          </p>
          <a
            href="/findpro"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#1A1B16] text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Find Your Contractor
          </a>
        </div>
      </section>
    </div>
  );
};

export default RegisterGuara;