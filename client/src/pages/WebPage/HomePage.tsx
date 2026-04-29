import * as React from "react";

import {
  MapPin,
  HardHat,
  LineChart,
  ShieldCheck,
  Search,
  FileText,
  CalendarDays,
  Wrench,
  User,
  Plus,
  Minus,
  ArrowRight as ArrowRightIcon,
  BadgeDollarSign,
  CalendarClock,
  HandCoins,
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "./HomePage/SearchBar";
import { JobContractService } from '@/core/services/job-contracts/jobContract.service';
import type { IJobContract } from '@/core/types/IJobContract';
import { FaqService } from '@/core/services/faq/faq.service';
import type { IFaq } from '@/core/types/IFaq';
import { TextBlockService } from '@/core/services/textblock/textblock.service';
import type { ITextBlock } from '@/core/types/ITextBlock';
import { YouTubeVideoService } from '@/core/services/youtube/youtubeVideo.service';
import type { IYouTubeVideo } from '@/core/types/IYouTubeVideo';
import { BannerService } from '@/core/services/banner/banner.service';
import type { IBanner } from '@/core/types/IBanner';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Popular services data reused in carousel and modal
  const popularServices = [
    {
      title: t('services.roofing'),
      img: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: t('services.gutters'),
      img: "https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: t('services.siding'),
      img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: t('services.windows'),
      img: "https://images.unsplash.com/photo-1584516025402-5ce32f67b86e?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: t('services.painting'),
      img: "https://images.unsplash.com/photo-1593282192539-9bdb07f6aa1f?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: t('services.drywall'),
      img: "https://images.unsplash.com/photo-1617695271857-0cf6e8404a89?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: t('services.solar'),
      img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: t('services.insulation'),
      img: "https://images.unsplash.com/photo-1600191729101-f54d9fba6032?q=80&w=1400&auto=format&fit=crop",
    },
  ];

  // removed: JS-based auto-scroll for services (replaced by CSS marquee)

  // Close modal on Escape
  useEffect(() => {
    if (!servicesModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [servicesModalOpen]);

  // removed: getAnnouncements

  // Extiende el tipo para los contratos recientes
  interface IJobContractExtended extends IJobContract {
    creator?: any;
    contractor?: any;
    image_url?: string;
    title?: string;
    location?: string;
    created_at?: string;
  }

  const [latestContracts, setLatestContracts] = useState<IJobContractExtended[]>([]);
  const [contractsLoading, setContractsLoading] = useState(true);
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [textBlock, setTextBlock] = useState<ITextBlock | null>(null);
  const [youtubeVideos, setYouTubeVideos] = useState<IYouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [banner, setBanner] = useState<IBanner | null>(null);

  const bannerContent = {
    topText: textBlock?.text_tertiary || t('hero.topText'),
    title: textBlock?.text_primary || t('hero.title'),
    subtitle: textBlock?.text_secondary || t('hero.subtitle'),
  };

  useEffect(() => {
    async function fetchLatestContracts() {
      setContractsLoading(true);
      try {
        const res = await JobContractService.getAllPaginated({ limit: 3, sort_by: 'id', sort_dir: 'desc' });
        console.log(res);
        setLatestContracts(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
      } catch (err) {
        console.log('Error fetching latest contracts:', err);
        setLatestContracts([]);
      } finally {
        setContractsLoading(false);
      }
    }
    fetchLatestContracts();
  }, []);

  useEffect(() => {
    async function fetchFaqs() {
      setFaqsLoading(true);
      try {
        const res = await FaqService.getAll();
        setFaqs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log('Error fetching FAQs:', err);
        setFaqs([]);
      } finally {
        setFaqsLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  useEffect(() => {
    async function fetchTextBlock() {
      try {
        const res = await TextBlockService.getFirst();
        if (res.data) {
          setTextBlock(res.data);
        }
      } catch (err) {
        console.log('Error fetching text block:', err);
      }
    }
    fetchTextBlock();
  }, []);

  useEffect(() => {
    async function fetchYouTubeVideos() {
      setVideosLoading(true);
      try {
        const res = await YouTubeVideoService.getAllPaginated({ per_page: 10 });
        const videoList = Array.isArray(res.data) ? res.data : [];
        setYouTubeVideos(videoList);
      } catch (err) {
        console.log('Error fetching YouTube videos:', err);
        setYouTubeVideos([]);
      } finally {
        setVideosLoading(false);
      }
    }
    fetchYouTubeVideos();
  }, []);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await BannerService.getAll();
        const bannerList = Array.isArray(res.data) ? res.data : [];
        if (bannerList.length > 0) {
          setBanner(bannerList[0]);
        }
      } catch (err) {
        console.log('Error fetching banner:', err);
        setBanner(null);
      }
    }
    fetchBanner();
  }, []);

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
  function getJobImageUrl(image?: string | null): string {
    if (!image) return '/images/default-service.jpg';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    // Quitar cualquier /api o api al inicio
    return `${API_BASE}/${image.replace(/^\/?api(\/|$)/, '')}`;
  }

  function getBannerImageUrl(image?: string | null): string {
    if (!image) return 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2000&auto=format&fit=crop';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return `${API_BASE}/${image.replace(/^\/?api(\/|$)/, '')}`;
  }

  function getYouTubeEmbedUrl(url?: string): string {
    if (!url) return '';
    
    // Si ya es una URL de embed, devolverla
    if (url.includes('youtube.com/embed/')) return url;
    
    // Extraer video ID de diferentes formatos
    let videoId = '';
    
    // Formato: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) videoId = watchMatch[1];
    
    // Formato: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && !videoId) videoId = shortMatch[1];
    
    // Si se extrajo un video ID, retornar URL de embed
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Si no se pudo extraer, retornar la URL original
    return url;
  }

  return (
    <div className="flex flex-col">
    <section className="relative min-h-screen overflow-hidden bg-primary text-[#1A1B16] pt-20 md:pt-24">
        <div className="relative h-full flex items-center justify-center text-center py-16">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col items-center "
            >
              {/* Top pill - now white with dark text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={!isLoading ? { opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="px-4 py-1 mb-6 rounded-full text-[#1A1B16] bg-white text-sm font-semibold shadow-lg ring-1 ring-inset ring-black/10"
              >
                {bannerContent.topText}
              </motion.div>

              {/* Main title - now dark text */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={!isLoading ? { opacity: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-3 text-[#1A1B16] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]"
              >
                {bannerContent.title.split(".").map((sentence, index, arr) => (
                  <React.Fragment key={index}>
                    {index === 1 ? <span className="text-[#1A1B16]">{sentence.trim()}</span> : <>{sentence.trim()}</>}
                    {index < arr.length - 1 && ". "}
                  </React.Fragment>
                ))}
              </motion.h1>

              {/* Subtitle - now dark text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={!isLoading ? { opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-lg md:text-xl text-[#1A1B16]/80 mb-10 max-w-3xl"
              >
                {bannerContent.subtitle}
              </motion.p>

              {/* Search bar and button */}
              {/* This is not on top, its behind id=gusection */}
              <SearchBar isLoading={isLoading} />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Every contractor on GU - forced brand colors */}
      <section className=" py-16 !bg-[#1A1B16] text-white" id="gusection">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-center text-3xl md:text-5xl font-bold tracking-tight mb-12">{t('whatYouFind.title')}</h2>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between md:divide-x md:divide-white/10 max-w-6xl mx-auto">
            {/* Item 1 */}
            <div className="flex-1 flex flex-col items-center text-center px-0 md:px-10 mb-10 md:mb-0">
              <div className="mb-6 inline-flex items-center justify-center size-16 rounded-full bg-white/5 ring-2 ring-primary ring-opacity-50">
                <HardHat className="size-8 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold leading-snug">{t('whatYouFind.licensed')}</h3>
            </div>

            {/* Item 2 */}
            <div className="flex-1 flex flex-col items-center text-center px-0 md:px-10 mb-10 md:mb-0">
              <div className="mb-6 inline-flex items-center justify-center size-16 rounded-full bg-white/5 ring-2 ring-primary ring-opacity-50">
                <LineChart className="size-8 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold leading-snug">{t('whatYouFind.verified')}</h3>
            </div>

            {/* Item 3 */}
            <div className="flex-1 flex flex-col items-center text-center px-0 md:px-10">
              <div className="mb-6 inline-flex items-center justify-center size-16 rounded-full bg-white/5 ring-2 ring-primary ring-opacity-50">
                <ShieldCheck className="size-8 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold leading-snug">{t('whatYouFind.protected')}</h3>
              <p className="mt-2 text-sm text-gray-300">{t('whatYouFind.upTo')}</p>
            </div>
          </div>
        </div>
      </section>

      {!isLoading && (
        <>
          {/* What is GU.com - video section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-10">{t('videos.title')}</h2>

              {videosLoading ? (
                <div className="text-center py-10 text-gray-400">Loading videos...</div>
              ) : youtubeVideos.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No videos available.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {youtubeVideos.slice(0, 2).map((video) => (
                    <div key={video.id} className="rounded-2xl overflow-hidden shadow-lg">
                      <div className="relative w-full pt-[56.25%] bg-gray-100">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={getYouTubeEmbedUrl(video.youtube_url)}
                          title={video.title || 'YouTube Video'}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      </div>
                      {video.title && (
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
                          {video.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* How it works */}
          <section className="py-16 bg-[#EEF2F7]">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-10">{t('howItWorks.title')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="group relative bg-white rounded-2xl shadow-md transition-shadow p-8 border border-primary/50 hover:border-primary hover:shadow-[0_0_0_2px_rgba(245,210,56,0.45)] overflow-hidden origin-center transform-gpu will-change-transform [transform-style:preserve-3d] hover:animate-[y-spin-once_700ms_linear_1] motion-reduce:animate-none motion-reduce:[transform:none]">
                  <div className="relative min-h-[260px] [transform-style:preserve-3d]">
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-primary rounded-full px-3 py-1 shadow">
                        {t('howItWorks.step', { number: 1 })}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <Search className="size-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks.search.title')}</h3>
                        <p className="text-gray-600">{t('howItWorks.search.description')}</p>
                      </div>
                    </div>
                    {/* Back face (mirrored) */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-primary rounded-full px-3 py-1 shadow">
                        {t('howItWorks.step', { number: 1 })}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <Search className="size-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks.search.title')}</h3>
                        <p className="text-gray-600">{t('howItWorks.search.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group relative bg-white rounded-2xl shadow-md transition-shadow p-8 border border-primary/50 hover:border-primary hover:shadow-[0_0_0_2px_rgba(245,210,56,0.45)] overflow-hidden origin-center transform-gpu will-change-transform [transform-style:preserve-3d] hover:animate-[y-spin-once_700ms_linear_1] motion-reduce:animate-none motion-reduce:[transform:none]">
                  <div className="relative min-h-[260px] [transform-style:preserve-3d]">
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-primary rounded-full px-3 py-1 shadow">
                        {t('howItWorks.step', { number: 2 })}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <FileText className="size-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks.quotes.title')}</h3>
                        <p className="text-gray-600">{t('howItWorks.quotes.description')}</p>
                      </div>
                    </div>
                    {/* Back face (mirrored) */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-primary rounded-full px-3 py-1 shadow">
                        {t('howItWorks.step', { number: 2 })}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <FileText className="size-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks.quotes.title')}</h3>
                        <p className="text-gray-600">{t('howItWorks.quotes.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group relative bg-white rounded-2xl shadow-md transition-shadow p-8 border border-primary/50 hover:border-primary hover:shadow-[0_0_0_2px_rgba(245,210,56,0.45)] overflow-hidden origin-center transform-gpu will-change-transform [transform-style:preserve-3d] hover:animate-[y-spin-once_700ms_linear_1] motion-reduce:animate-none motion-reduce:[transform:none]">
                  <div className="relative min-h-[260px] [transform-style:preserve-3d]">
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-primary rounded-full px-3 py-1 shadow">
                        {t('howItWorks.step', { number: 3 })}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <HardHat className="size-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks.select.title')}</h3>
                        <p className="text-gray-600">{t('howItWorks.select.description')}</p>
                      </div>
                    </div>
                    {/* Back face (mirrored) */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-primary rounded-full px-3 py-1 shadow">
                        {t('howItWorks.step', { number: 3 })}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <HardHat className="size-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks.select.title')}</h3>
                        <p className="text-gray-600">{t('howItWorks.select.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group relative bg-white rounded-2xl shadow-md transition-shadow p-8 border border-primary/50 hover:border-primary hover:shadow-[0_0_0_2px_rgba(245,210,56,0.45)] overflow-hidden origin-center transform-gpu will-change-transform [transform-style:preserve-3d] hover:animate-[y-spin-once_700ms_linear_1] motion-reduce:animate-none motion-reduce:[transform:none]">
                  <div className="relative min-h-[260px] [transform-style:preserve-3d]">
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-primary rounded-full px-3 py-1 shadow">
                        {t('howItWorks.step', { number: 4 })}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <ShieldCheck className="size-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks.guarantee.title')}</h3>
                        <p className="text-gray-600">{t('howItWorks.guarantee.description')}</p>
                      </div>
                    </div>
                    {/* Back face (mirrored) */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-primary rounded-full px-3 py-1 shadow">
                        {t('howItWorks.step', { number: 4 })}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <ShieldCheck className="size-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks.guarantee.title')}</h3>
                        <p className="text-gray-600">{t('howItWorks.guarantee.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Real Stories, Real Payouts */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center">Real Stories, Real Payouts</h2>
              <p className="text-center text-gray-600 mt-3 mb-10">
                See actual claims we've paid to protect homeowners like you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {contractsLoading ? (
                  <div className="col-span-3 text-center py-10 text-gray-400">Loading...</div>
                ) : (
                  <div className="col-span-3 text-center py-10 text-gray-400"></div>
                )}
                {contractsLoading ? (
                  <div className="col-span-3 text-center py-10 text-gray-400">Loading...</div>
                ) : latestContracts.length === 0 ? (
                  <div className="col-span-3 text-center py-10 text-gray-400">No recent payouts found.</div>
                ) : (
                  latestContracts.map((contract) => {
                    // Adaptar a la nueva estructura de datos
                    const contractor = contract.creator || contract.contractor || {};
                    const professions = contractor.contractor?.professions || [];
                    const mainProfession = professions.length > 0 ? professions[0].name : 'Profession';
                    const imageUrl = getJobImageUrl(contract.image_url);
                    return (
                      <article key={contract.id} className="bg-white rounded-[14px] shadow-sm transition-all duration-300 p-2 flex flex-col border-[0.5px] border-primary max-w-[360px] w-full mx-auto hover:shadow-[0_0_24px_6px_rgba(245,210,56,0.55),0_0_120px_40px_rgba(245,210,56,0.25),inset_0_0_0_1px_rgba(245,210,56,0.85)]">
                        <div className="relative w-full pt-[65%] rounded-[12px] overflow-hidden mb-2.5">
                          <img
                            src={imageUrl}
                            alt={contract.title || 'Job'}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 leading-tight">
                          {contract.title || 'Job payout'}
                        </h3>
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="size-3 text-gray-400" />
                          </div>
                          <span className="font-semibold text-gray-700 text-sm md:text-base">
                            {contractor.name || 'Contractor'}
                          </span>
                        </div>
                        <div className="text-xs text-primary font-semibold mb-2">{mainProfession}</div>
                        <div className="text-xs text-gray-500 mb-2">
                          {contractor.email && <div>Email: {contractor.email}</div>}
                          {contractor.mobile_number && <div>Phone: {contractor.mobile_number}</div>}
                          {contractor.contractor?.company_name && <div>Company: {contractor.contractor.company_name}</div>}
                        </div>
                        <div className="mt-auto">
                          <ul className="space-y-1.5 text-gray-600 text-sm md:text-base">
                            <li className="flex items-center gap-2">
                              <MapPin className="size-4 text-gray-400" /> {contract.location || 'Location'}
                            </li>
                            <li className="flex items-center gap-2">
                              <Wrench className="size-4 text-gray-400" /> {mainProfession}
                            </li>
                          </ul>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                              <CalendarDays className="size-4 text-gray-400" />
                              {contract.created_at ? new Date(contract.created_at).toLocaleDateString() : ''}
                            </div>
                            <button className="inline-flex items-center justify-center size-9 rounded-full bg-primary shadow hover:shadow-md transition">
                              <ArrowRightIcon className="size-4 text-[#1A1B16]" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </section>
          {/* Stats strip (placed directly under Real Stories) - brand styled with icons */}
          <section className="py-16 bg-[#1A1B16]">
            <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {/* Stat 1 */}
                <div className="flex flex-col items-center">
                  <div className="group mb-6 inline-flex items-center justify-center size-14 rounded-full bg-white/5 ring-2 ring-primary/30 transition-all duration-300 [perspective:800px] group-hover:ring-primary/40 group-hover:bg-primary/5">
                    <BadgeDollarSign className="size-7 text-primary origin-center transform-gpu will-change-transform [transform-style:preserve-3d] animate-[planet-spin_6s_linear_infinite] transition-transform duration-300 ease-out group-hover:animate-none group-hover:[transform:rotateY(0deg)]" />
                  </div>
                  <div className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">100%</div>
                  <div className="mt-2 text-gray-300 text-base md:text-lg">Claims Paid</div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center">
                  <div className="group mb-6 inline-flex items-center justify-center size-14 rounded-full bg-white/5 ring-2 ring-primary/30 transition-all duration-300 [perspective:800px] group-hover:ring-primary/40 group-hover:bg-primary/5">
                    <CalendarClock className="size-7 text-primary origin-center transform-gpu will-change-transform [transform-style:preserve-3d] animate-[planet-spin_6s_linear_infinite] transition-transform duration-300 ease-out group-hover:animate-none group-hover:[transform:rotateY(0deg)]" />
                  </div>
                  <div className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">15–30 Days</div>
                  <div className="mt-2 text-gray-300 text-base md:text-lg">Average Resolution</div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center">
                  <div className="group mb-6 inline-flex items-center justify-center size-14 rounded-full bg-white/5 ring-2 ring-primary/30 transition-all duration-300 [perspective:800px] group-hover:ring-primary/40 group-hover:bg-primary/5">
                    <HandCoins className="size-7 text-primary origin-center transform-gpu will-change-transform [transform-style:preserve-3d] animate-[planet-spin_6s_linear_infinite] transition-transform duration-300 ease-out group-hover:animate-none group-hover:[transform:rotateY(0deg)]" />
                  </div>
                  <div className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">$8,000</div>
                  <div className="mt-2 text-gray-300 text-base md:text-lg">Average Claim</div>
                </div>
              </div>
            </div>
          </section>
          {/* Why GU? comparison - restyled to project brand */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1A1B16] text-center mb-10">Why GU?</h2>

              <div className="overflow-hidden rounded-[28px] shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left: GU */}
                  <div className="bg-[#EEF2F7]">
                    {/* Header */}
                    <div className="px-6 md:px-10 py-6 bg-primary text-[#1A1B16] font-extrabold text-2xl md:text-3xl">
                      GU
                    </div>
                    {/* Rows */}
                    <ul className="divide-y divide-primary/30">
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-primary text-[#1A1B16] bg-white">
                          ✓
                        </span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">
                          Verified contractors only
                        </span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-primary text-[#1A1B16] bg-white">
                          ✓
                        </span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">
                          Backed guarantee up to $250K
                        </span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-primary text-[#1A1B16] bg-white">
                          ✓
                        </span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">Data-driven rankings</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-primary text-[#1A1B16] bg-white">
                          ✓
                        </span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">We pay homeowners</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-primary text-[#1A1B16] bg-white">
                          ✓
                        </span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">Real-life support</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-primary text-[#1A1B16] bg-white">
                          ✓
                        </span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">
                          Only 4.5 stars and up reviews
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Right: BBB */}
                  <div className="bg-white">
                    {/* Header */}
                    <div className="px-6 md:px-10 py-6 bg-gray-100 text-gray-700 font-extrabold text-2xl md:text-3xl">
                      BBB
                    </div>
                    {/* Rows */}
                    <ul className="divide-y divide-gray-200">
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">
                          ✕
                        </span>
                        <span className="text-gray-700 text-base md:text-lg">Pay to play</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">
                          ✕
                        </span>
                        <span className="text-gray-700 text-base md:text-lg">Zero financial guarantee</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">
                          ✕
                        </span>
                        <span className="text-gray-700 text-base md:text-lg">
                          No algorithm, manual and outdated ranking
                        </span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">
                          ✕
                        </span>
                        <span className="text-gray-700 text-base md:text-lg">No payouts</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">
                          ✕
                        </span>
                        <span className="text-gray-700 text-base md:text-lg">Submit a complaint and wait</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">
                          ✕
                        </span>
                        <span className="text-gray-700 text-base md:text-lg">Money buys higher rating</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Services Modal */}
          <AnimatePresence>
            {servicesModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                aria-modal="true"
                role="dialog"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) setServicesModalOpen(false);
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  className="w-full max-w-5xl bg-white rounded-2xl shadow-xl max-h-[85vh] flex flex-col overflow-hidden"
                >
                  <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {popularServices.map((s) => (
                        <article key={s.title} className="group">
                          <div className="relative w-full pt-[66%] rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                            <img
                              src={s.img}
                              alt={s.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <h4 className="mt-3 text-lg font-semibold text-[#1A1B16]">{s.title}</h4>
                        </article>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* What Our Customers Say - infinite scroll carousel */}
          {/* <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1A1B16] mb-10">
                What Our Customers Say
              </h2>

              <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent"></div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent"></div>

                <div className="group/carousel">
                  <div className="flex gap-6 w-[200%] animate-[scroll-left_40s_linear_infinite] group-hover/carousel:[animation-play-state:paused]">
                    {(() => {
                      const items = [
                        {
                          name: "Adam B.",
                          rating: 5.0,
                          date: "Apr 2024",
                          text: "The entire process was smooth. Most importantly I was always informed of what and when to expect the next step. When questions came up, I got immediate responses from my sales guy.",
                        },
                        {
                          name: "Ryan Quarless",
                          rating: 5.0,
                          date: "May 2025",
                          text: "I highly recommend Richard & Camel City Roofing if you are looking to have any roofing work done! Richard was very knowledgeable & was quickly responsive to all my questions/concerns.",
                        },
                        {
                          name: "Chris Munson",
                          rating: 5.0,
                          date: "Mar 2025",
                          text: "GU is the best! They vet the contractors to make sure only the best are allowed. They stand behind the work and are making the roofing space a much better place.",
                        },
                        {
                          name: "Joseph Wisnaskas",
                          rating: 5.0,
                          date: "Feb 2025",
                          text: "Brehm Roofing recently completed a re-roof of our home and we are very happy with the new roof and installation process. Quick response to questions and professional crew.",
                        },
                      ];
                      const loop = [...items, ...items];
                      return loop.map((t, idx) => (
                        <article
                          key={`${t.name}-${idx}`}
                          className="min-w-[320px] max-w-[360px] bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="size-10 rounded-full bg-gray-100"></div>
                            <div>
                              <h3 className="font-semibold text-[#1A1B16]">{t.name}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="inline-flex items-center gap-1">
                                  <Star className="size-4 text-yellow-500" /> {t.rating.toFixed(1)}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <CalendarDays className="size-4 text-gray-400" /> {t.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 line-clamp-5">{t.text}</p>
                          <button className="mt-4 text-[#1A1B16] font-semibold hover:text-primary">Read more</button>
                        </article>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          {/* $250K Guarantee Banner (placed after testimonials) */}
          <section className="py-8 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <div className="relative overflow-hidden rounded-[28px]">
                {/* Background image */}
                <div
                  className="relative h-[360px] md:h-[440px] w-full bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${getBannerImageUrl(banner?.image)})`,
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/55"></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                    <div className="max-w-5xl">
                      <h2 className="text-white font-extrabold leading-tight text-3xl md:text-5xl lg:text-6xl">
                        {banner?.title || (
                          <>
                            Join homeowners who've chosen
                            <br className="hidden md:block" />
                            the security of our $250,000 guarantee
                          </>
                        )}
                      </h2>
                      <p className="text-white/90 mt-5 text-base md:text-lg max-w-3xl mx-auto">
                        {banner?.subtitle || (
                          <>
                            We understand the trust you place in contractors when you invite them into your space. That's
                            why we've created the most comprehensive protection program in the industry.
                          </>
                        )}
                      </p>
                      <div className="mt-7">
                        <Link
                          to="/contractors"
                          className="inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-primary text-[#1A1B16] font-bold shadow hover:shadow-md transition"
                        >
                          Find Your Guaranteed Contractor
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Removed: Noticias y Comunicados section */}

          {/* FAQ - Questions about GU (final section at bottom) */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1A1B16] mb-6">Questions about GU</h2>
              <div className="max-w-4xl mx-auto divide-y divide-gray-200">
                {faqsLoading ? (
                  <div className="text-center py-10 text-gray-400">Loading FAQs...</div>
                ) : faqs.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">No FAQs available.</div>
                ) : (
                  faqs.map((item) => (
                    <FaqItem key={item.id} question={item.question} answer={item.answer} />
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

// Removed AnnouncementCard as the section is deleted

// Removed CourseCard and EventCard as their sections were deleted

// Simple FAQ item with toggle behavior
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group w-full flex items-start justify-between gap-4 text-left"
      >
        <span className="text-lg md:text-xl font-semibold text-[#1A1B16]">{question}</span>
        <span className="shrink-0 inline-flex items-center justify-center size-9 rounded-full border border-gray-300 text-[#1A1B16] bg-white transform transition-colors transition-transform duration-200 ease-out group-hover:bg-primary group-hover:border-primary group-hover:text-[#1A1B16] group-hover:scale-110">
          {open ? <Minus className="size-5" /> : <Plus className="size-5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
