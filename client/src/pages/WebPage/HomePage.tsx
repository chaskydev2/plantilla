import { MapPin, HardHat, LineChart, ShieldCheck, Search, FileText, CalendarDays, Wrench, User, Star, Plus, Minus, ArrowRight as ArrowRightIcon, BadgeDollarSign, CalendarClock, HandCoins } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import BannerImg from "@/assets/images/backgroudHD.jpg";
import { useEffect, useState } from "react";
import React from "react";
// removed: announcements

const HomePage = () => {
  // removed: banners/announcements state
  const [isLoading, setIsLoading] = useState(true);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  // removed: AnnouncementService

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Popular services data reused in carousel and modal
  const popularServices = [
    { title: 'Roofing', img: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Gutters', img: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Siding', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Windows', img: 'https://images.unsplash.com/photo-1584516025402-5ce32f67b86e?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Painting', img: 'https://images.unsplash.com/photo-1593282192539-9bdb07f6aa1f?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Drywall', img: 'https://images.unsplash.com/photo-1617695271857-0cf6e8404a89?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Solar', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Insulation', img: 'https://images.unsplash.com/photo-1600191729101-f54d9fba6032?q=80&w=1400&auto=format&fit=crop' },
  ];

  // removed: JS-based auto-scroll for services (replaced by CSS marquee)

  // Close modal on Escape
  useEffect(() => {
    if (!servicesModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [servicesModalOpen]);

   const bannerContent = {
    topText: "Protecting families in the U.S. and Canada",
    title: "Only vetted professionals. Backed by our $250,000 guarantee",
    subtitle: "All contractors are background-checked and financially screened—and if they mess up, your project is protected.",
  };

  // removed: getAnnouncements

  return (
    <div className="flex flex-col">
     <section className="relative min-h-screen overflow-hidden bg-[#F5D238] text-[#1A1B16]">
      {/* Background image + overlay - subtle overlay for yellow background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-10"
          style={{ backgroundImage: `url(${BannerImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5D238]/90 to-[#e6c531]/95" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center py-16">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col items-center"
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
              {bannerContent.title.split('.').map((sentence, index, arr) => (
                <React.Fragment key={index}>
                  {index === 1 ? (
                    <span className="text-[#1A1B16]">{sentence.trim()}</span>
                  ) : (
                    <>{sentence.trim()}</>
                  )}
                  {index < arr.length - 1 && '. '}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={!isLoading ? { opacity: 1 } : {}}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-col items-center w-full justify-center"
            >
              <div className="flex w-full max-w-2xl items-center rounded-full p-1 pr-2 shadow-2xl bg-white border border-gray-200">
                {/* Service select */}
                <div className="relative flex-1">
                  <svg aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v8"/><path d="M8 12h8"/>
                  </svg>
                  <select
                    aria-label="Select a service"
                    className="w-full py-3 pl-10 pr-8 rounded-l-full focus:outline-none text-[#1A1B16] bg-transparent appearance-none cursor-pointer"
                  >
                    <option className="text-[#1A1B16]">What can we do for you?</option>
                    <option className="text-[#1A1B16]">Option 1</option>
                    <option className="text-[#1A1B16]">Option 2</option>
                  </select>
                </div>

                {/* Location input */}
                <div className="relative flex-1">
                  <span className="hidden md:block pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300" aria-hidden></span>
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                  <input
                    type="text"
                    aria-label="Enter your ZIP code or city"
                    placeholder="City, ZIP"
                    className="w-full py-3 pl-10 pr-3 focus:outline-none text-[#1A1B16] placeholder-gray-500 bg-transparent"
                  />
                </div>

                {/* CTA */}
                <button
                  className="inline-flex items-center bg-[#1A1B16] hover:bg-[#2A2B26] text-white font-bold py-3 px-6 md:px-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1B16] focus:ring-offset-white"
                >
                  <span>Find a Pro</span>
                  <Search className="ml-2 size-4 text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Every contractor on Directorii - forced brand colors */}
  <section className="py-16 !bg-[#1A1B16] text-white">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-center text-3xl md:text-5xl font-bold tracking-tight mb-12">
            Que encontraras en Comercial
          </h2>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between md:divide-x md:divide-white/10 max-w-6xl mx-auto">
            {/* Item 1 */}
            <div className="flex-1 flex flex-col items-center text-center px-0 md:px-10 mb-10 md:mb-0">
              <div className="mb-6 inline-flex items-center justify-center size-16 rounded-full bg-white/5 ring-2 ring-[#F5D238] ring-opacity-50">
                <HardHat className="size-8 text-[#F5D238]" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold leading-snug">Licensed and background-checked</h3>
            </div>

            {/* Item 2 */}
            <div className="flex-1 flex flex-col items-center text-center px-0 md:px-10 mb-10 md:mb-0">
              <div className="mb-6 inline-flex items-center justify-center size-16 rounded-full bg-white/5 ring-2 ring-[#F5D238] ring-opacity-50">
                <LineChart className="size-8 text-[#F5D238]" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold leading-snug">Financially verified</h3>
            </div>

            {/* Item 3 */}
            <div className="flex-1 flex flex-col items-center text-center px-0 md:px-10">
              <div className="mb-6 inline-flex items-center justify-center size-16 rounded-full bg-white/5 ring-2 ring-[#F5D238] ring-opacity-50">
                <ShieldCheck className="size-8 text-[#F5D238]" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold leading-snug">Protected by a guarantee</h3>
              <p className="mt-2 text-sm text-gray-300">Up to $250,000</p>
            </div>
          </div>
        </div>
      </section>

      {!isLoading && (
        <>
          {/* What is Directorii.com - video section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-10">
                Que es Comercial
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Video 1 */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative w-full pt-[56.25%] bg-gray-100">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/6yYl2ucx2Ng"
                      title="Roofing Warranty : What Happens When Contractors Fail"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* Video 2 */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative w-full pt-[56.25%] bg-gray-100">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/n1G1kvt8R1g"
                      title="How to Never Get Scammed By A Contractor again!"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </section>
          

          {/* How it works */}
          <section className="py-16 bg-[#EEF2F7]">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-10">
                How it works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="group relative bg-white rounded-2xl shadow-md transition-shadow p-8 border border-[#F5D238]/50 hover:border-[#F5D238] hover:shadow-[0_0_0_2px_rgba(245,210,56,0.45)] overflow-hidden origin-center transform-gpu will-change-transform [transform-style:preserve-3d] hover:animate-[y-spin-once_700ms_linear_1] motion-reduce:animate-none motion-reduce:[transform:none]">
                  <div className="relative min-h-[260px] [transform-style:preserve-3d]">
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-[#F5D238] rounded-full px-3 py-1 shadow">
                        Step 1
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <Search className="size-12 text-[#F5D238]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Search</h3>
                        <p className="text-gray-600">Enter your location and project type</p>
                      </div>
                    </div>
                    {/* Back face (mirrored) */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-[#F5D238] rounded-full px-3 py-1 shadow">
                        Step 1
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <Search className="size-12 text-[#F5D238]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Search</h3>
                        <p className="text-gray-600">Enter your location and project type</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group relative bg-white rounded-2xl shadow-md transition-shadow p-8 border border-[#F5D238]/50 hover:border-[#F5D238] hover:shadow-[0_0_0_2px_rgba(245,210,56,0.45)] overflow-hidden origin-center transform-gpu will-change-transform [transform-style:preserve-3d] hover:animate-[y-spin-once_700ms_linear_1] motion-reduce:animate-none motion-reduce:[transform:none]">
                  <div className="relative min-h-[260px] [transform-style:preserve-3d]">
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-[#F5D238] rounded-full px-3 py-1 shadow">
                        Step 2
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <FileText className="size-12 text-[#F5D238]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Quotes</h3>
                        <p className="text-gray-600">Receive quotes from pre-screened contractors</p>
                      </div>
                    </div>
                    {/* Back face (mirrored) */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-[#F5D238] rounded-full px-3 py-1 shadow">
                        Step 2
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <FileText className="size-12 text-[#F5D238]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Quotes</h3>
                        <p className="text-gray-600">Receive quotes from pre-screened contractors</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group relative bg-white rounded-2xl shadow-md transition-shadow p-8 border border-[#F5D238]/50 hover:border-[#F5D238] hover:shadow-[0_0_0_2px_rgba(245,210,56,0.45)] overflow-hidden origin-center transform-gpu will-change-transform [transform-style:preserve-3d] hover:animate-[y-spin-once_700ms_linear_1] motion-reduce:animate-none motion-reduce:[transform:none]">
                  <div className="relative min-h-[260px] [transform-style:preserve-3d]">
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-[#F5D238] rounded-full px-3 py-1 shadow">
                        Step 3
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <HardHat className="size-12 text-[#F5D238]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select</h3>
                        <p className="text-gray-600">Choose the best contractor for your project</p>
                      </div>
                    </div>
                    {/* Back face (mirrored) */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-[#F5D238] rounded-full px-3 py-1 shadow">
                        Step 3
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <HardHat className="size-12 text-[#F5D238]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select</h3>
                        <p className="text-gray-600">Choose the best contractor for your project</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group relative bg-white rounded-2xl shadow-md transition-shadow p-8 border border-[#F5D238]/50 hover:border-[#F5D238] hover:shadow-[0_0_0_2px_rgba(245,210,56,0.45)] overflow-hidden origin-center transform-gpu will-change-transform [transform-style:preserve-3d] hover:animate-[y-spin-once_700ms_linear_1] motion-reduce:animate-none motion-reduce:[transform:none]">
                  <div className="relative min-h-[260px] [transform-style:preserve-3d]">
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-[#F5D238] rounded-full px-3 py-1 shadow">
                        Step 4
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <ShieldCheck className="size-12 text-[#F5D238]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Guaranteed</h3>
                        <p className="text-gray-600">Your project is protected up to $250,000</p>
                      </div>
                    </div>
                    {/* Back face (mirrored) */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#1A1B16] bg-[#F5D238] rounded-full px-3 py-1 shadow">
                        Step 4
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-24 rounded-full bg-gray-50 ring-2 ring-gray-200">
                          <ShieldCheck className="size-12 text-[#F5D238]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Guaranteed</h3>
                        <p className="text-gray-600">Your project is protected up to $250,000</p>
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
              <p className="text-center text-gray-600 mt-3 mb-10">See actual claims we've paid to protect homeowners like you.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Card 1 */}
                <article className="bg-white rounded-[14px] shadow-sm transition-all duration-300 p-2 flex flex-col border-[0.5px] border-[#F5D238] max-w-[360px] w-full mx-auto hover:shadow-[0_0_24px_6px_rgba(245,210,56,0.55),0_0_120px_40px_rgba(245,210,56,0.25),inset_0_0_0_1px_rgba(245,210,56,0.85)]">
                  <div className="relative w-full pt-[65%] rounded-[12px] overflow-hidden mb-2.5">
                    <img src="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1400&auto=format&fit=crop" alt="Neighborhood" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 leading-tight">"I was charged $4K after my contractor shut down. Directorii took care of it"</h3>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="size-3 text-gray-400" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm md:text-base">Ben & Susan Smith</span>
                  </div>
                  <div className="mt-auto">
                    <ul className="space-y-1.5 text-gray-600 text-sm md:text-base">
                      <li className="flex items-center gap-2"><MapPin className="size-4 text-gray-400" /> Oklahoma, OK</li>
                      <li className="flex items-center gap-2"><Wrench className="size-4 text-gray-400" /> Roofing</li>
                    </ul>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base"><CalendarDays className="size-4 text-gray-400" /> Jan 2023</div>
                      <button className="inline-flex items-center justify-center size-9 rounded-full bg-[#F5D238] shadow hover:shadow-md transition">
                        <ArrowRightIcon className="size-4 text-[#1A1B16]" />
                      </button>
                    </div>
                  </div>
                </article>

                {/* Card 2 */}
                <article className="bg-white rounded-[14px] shadow-sm transition-all duration-300 p-2 flex flex-col border-[0.5px] border-[#F5D238] max-w-[360px] w-full mx-auto hover:shadow-[0_0_24px_6px_rgba(245,210,56,0.55),0_0_120px_40px_rgba(245,210,56,0.25),inset_0_0_0_1px_rgba(245,210,56,0.85)]">
                  <div className="relative w-full pt-[65%] rounded-[12px] overflow-hidden mb-2.5">
                    <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1400&auto=format&fit=crop" alt="Home exterior" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 leading-tight">"A contractor destroyed my siding, but Directorii paid $15K to fix it"</h3>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="size-3 text-gray-400" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm md:text-base">Brandy Oberg</span>
                  </div>
                  <div className="mt-auto">
                    <ul className="space-y-1.5 text-gray-600 text-sm md:text-base">
                      <li className="flex items-center gap-2"><MapPin className="size-4 text-gray-400" /> Minnesota, MN</li>
                      <li className="flex items-center gap-2"><Wrench className="size-4 text-gray-400" /> Roofing</li>
                    </ul>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base"><CalendarDays className="size-4 text-gray-400" /> Apr 2022</div>
                      <button className="inline-flex items-center justify-center size-9 rounded-full bg-[#F5D238] shadow hover:shadow-md transition">
                        <ArrowRightIcon className="size-4 text-[#1A1B16]" />
                      </button>
                    </div>
                  </div>
                </article>

                {/* Card 3 */}
                <article className="bg-white rounded-[14px] shadow-sm transition-all duration-300 p-2 flex flex-col border-[0.5px] border-[#F5D238] max-w-[360px] w-full mx-auto hover:shadow-[0_0_24px_6px_rgba(245,210,56,0.55),0_0_120px_40px_rgba(245,210,56,0.25),inset_0_0_0_1px_rgba(245,210,56,0.85)]">
                  <div className="relative w-full pt-[65%] rounded-[12px] overflow-hidden mb-2.5">
                    <img src="https://images.unsplash.com/photo-1585842378054-ee2e52f94ba3?q=80&w=1400&auto=format&fit=crop" alt="Roof repair" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 leading-tight">"A contractor damaged my roof. Directorii paid $8K to replace it"</h3>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="size-3 text-gray-400" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm md:text-base">Lisa Brown</span>
                  </div>
                  <div className="mt-auto">
                    <ul className="space-y-1.5 text-gray-600 text-sm md:text-base">
                      <li className="flex items-center gap-2"><MapPin className="size-4 text-gray-400" /> New York, NY</li>
                      <li className="flex items-center gap-2"><Wrench className="size-4 text-gray-400" /> Roofing</li>
                    </ul>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base"><CalendarDays className="size-4 text-gray-400" /> Jun 2024</div>
                      <button className="inline-flex items-center justify-center size-9 rounded-full bg-[#F5D238] shadow hover:shadow-md transition">
                        <ArrowRightIcon className="size-4 text-[#1A1B16]" />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
          {/* Stats strip (placed directly under Real Stories) - brand styled with icons */}
          <section className="py-16 bg-[#1A1B16]">
            <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {/* Stat 1 */}
                <div className="flex flex-col items-center">
                  <div className="group mb-6 inline-flex items-center justify-center size-14 rounded-full bg-white/5 ring-2 ring-[#F5D238]/30 transition-all duration-300 [perspective:800px] group-hover:ring-[#F5D238]/40 group-hover:bg-[#F5D238]/5">
                    <BadgeDollarSign className="size-7 text-[#F5D238] origin-center transform-gpu will-change-transform [transform-style:preserve-3d] animate-[planet-spin_6s_linear_infinite] transition-transform duration-300 ease-out group-hover:animate-none group-hover:[transform:rotateY(0deg)]" />
                  </div>
                  <div className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">100%</div>
                  <div className="mt-2 text-gray-300 text-base md:text-lg">Claims Paid</div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center">
                  <div className="group mb-6 inline-flex items-center justify-center size-14 rounded-full bg-white/5 ring-2 ring-[#F5D238]/30 transition-all duration-300 [perspective:800px] group-hover:ring-[#F5D238]/40 group-hover:bg-[#F5D238]/5">
                    <CalendarClock className="size-7 text-[#F5D238] origin-center transform-gpu will-change-transform [transform-style:preserve-3d] animate-[planet-spin_6s_linear_infinite] transition-transform duration-300 ease-out group-hover:animate-none group-hover:[transform:rotateY(0deg)]" />
                  </div>
                  <div className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">15–30 Days</div>
                  <div className="mt-2 text-gray-300 text-base md:text-lg">Average Resolution</div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center">
                  <div className="group mb-6 inline-flex items-center justify-center size-14 rounded-full bg-white/5 ring-2 ring-[#F5D238]/30 transition-all duration-300 [perspective:800px] group-hover:ring-[#F5D238]/40 group-hover:bg-[#F5D238]/5">
                    <HandCoins className="size-7 text-[#F5D238] origin-center transform-gpu will-change-transform [transform-style:preserve-3d] animate-[planet-spin_6s_linear_infinite] transition-transform duration-300 ease-out group-hover:animate-none group-hover:[transform:rotateY(0deg)]" />
                  </div>
                  <div className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">$8,000</div>
                  <div className="mt-2 text-gray-300 text-base md:text-lg">Average Claim</div>
                </div>
              </div>
            </div>
          </section>
          {/* Why Directorii? comparison - restyled to project brand */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1A1B16] text-center mb-10">Why Directorii?</h2>

              <div className="overflow-hidden rounded-[28px] shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left: Directorii */}
                  <div className="bg-[#EEF2F7]">
                    {/* Header */}
                    <div className="px-6 md:px-10 py-6 bg-[#F5D238] text-[#1A1B16] font-extrabold text-2xl md:text-3xl">
                      Directorii
                    </div>
                    {/* Rows */}
                    <ul className="divide-y divide-[#F5D238]/30">
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-[#F5D238] text-[#1A1B16] bg-white">✓</span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">Verified contractors only</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-[#F5D238] text-[#1A1B16] bg-white">✓</span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">Backed guarantee up to $250K</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-[#F5D238] text-[#1A1B16] bg-white">✓</span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">Data-driven rankings</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-[#F5D238] text-[#1A1B16] bg-white">✓</span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">We pay homeowners</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-[#F5D238] text-[#1A1B16] bg-white">✓</span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">Real-life support</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-[#F5D238] text-[#1A1B16] bg-white">✓</span>
                        <span className="text-[#1A1B16] text-base md:text-lg font-medium">Only 4.5 stars and up reviews</span>
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
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">✕</span>
                        <span className="text-gray-700 text-base md:text-lg">Pay to play</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">✕</span>
                        <span className="text-gray-700 text-base md:text-lg">Zero financial guarantee</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">✕</span>
                        <span className="text-gray-700 text-base md:text-lg">No algorithm, manual and outdated ranking</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">✕</span>
                        <span className="text-gray-700 text-base md:text-lg">No payouts</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">✕</span>
                        <span className="text-gray-700 text-base md:text-lg">Submit a complaint and wait</span>
                      </li>
                      <li className="flex items-center gap-4 px-6 md:px-10 py-5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full border-2 border-gray-400 text-gray-500 bg-white">✕</span>
                        <span className="text-gray-700 text-base md:text-lg">Money buys higher rating</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Services Near You */}
          <section className="py-16 bg-[#F8FAFC]">
            <div className="container mx-auto px-6 md:px-12">
              <div className="text-center mb-1">
                <h2 className="text-3xl md:text-5xl font-bold text-[#1A1B16]">Popular Services Near You</h2>
              </div>
              <p className="text-center text-gray-600 mt-1 mb-10">We work in the US and Canada with 100% vetted contractors.</p>

              {/* Carousel */}
              <div className="relative">
                {/* edge fades */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 hidden md:block"></div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 hidden md:block"></div>

                {/* viewport using CSS marquee */}
                <div className="relative overflow-hidden group/services">
                  <div className="flex gap-6 w-[200%] animate-[scroll-left_40s_linear_infinite] group-hover/services:[animation-play-state:paused]">
                    {/* first strip */}
                    <div className="flex gap-6">
                      {popularServices.map((s) => (
                        <article key={`a-${s.title}`} className="group shrink-0 w-[280px] sm:w-[320px]">
                          <div className="relative w-full pt-[66%] rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                            <img
                              src={s.img}
                              alt={s.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <h3 className="mt-4 text-center text-xl md:text-2xl font-semibold text-[#1A1B16]">{s.title}</h3>
                        </article>
                      ))}
                    </div>
                    {/* second strip */}
                    <div className="flex gap-6">
                      {popularServices.map((s) => (
                        <article key={`b-${s.title}`} className="group shrink-0 w-[280px] sm:w-[320px]">
                          <div className="relative w-full pt-[66%] rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                            <img
                              src={s.img}
                              alt={s.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <h3 className="mt-4 text-center text-xl md:text-2xl font-semibold text-[#1A1B16]">{s.title}</h3>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>

                {/* controls removed to keep clean centered layout */}
              </div>
              {/* Show more button below carousel */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setServicesModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-300 bg-white text-[#1A1B16] hover:bg-gray-50 shadow-sm"
                >
                  Show more
                </button>
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
                onMouseDown={(e) => { if (e.target === e.currentTarget) setServicesModalOpen(false); }}
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
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1A1B16] mb-10">What Our Customers Say</h2>

              {/* Carousel viewport */}
              <div className="relative overflow-hidden">
                {/* edge fades */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent"></div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent"></div>

                {/* Track: duplicate items for seamless loop; pause on hover */}
                <div className="group/carousel">
                  <div
                    className="flex gap-6 w-[200%] animate-[scroll-left_40s_linear_infinite] group-hover/carousel:[animation-play-state:paused]"
                  >
                    {(() => {
                      const items = [
                        { name: 'Adam B.', rating: 5.0, date: 'Apr 2024', text: 'The entire process was smooth. Most importantly I was always informed of what and when to expect the next step. When questions came up, I got immediate responses from my sales guy.' },
                        { name: 'Ryan Quarless', rating: 5.0, date: 'May 2025', text: 'I highly recommend Richard & Camel City Roofing if you are looking to have any roofing work done! Richard was very knowledgeable & was quickly responsive to all my questions/concerns.' },
                        { name: 'Chris Munson', rating: 5.0, date: 'Mar 2025', text: 'Directorii is the best! They vet the contractors to make sure only the best are allowed. They stand behind the work and are making the roofing space a much better place.' },
                        { name: 'Joseph Wisnaskas', rating: 5.0, date: 'Feb 2025', text: 'Brehm Roofing recently completed a re-roof of our home and we are very happy with the new roof and installation process. Quick response to questions and professional crew.' },
                      ];
                      const loop = [...items, ...items];
                      return loop.map((t, idx) => (
                        <article key={`${t.name}-${idx}`} className="min-w-[320px] max-w-[360px] bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="size-10 rounded-full bg-gray-100"></div>
                            <div>
                              <h3 className="font-semibold text-[#1A1B16]">{t.name}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="inline-flex items-center gap-1"><Star className="size-4 text-yellow-500" /> {t.rating.toFixed(1)}</span>
                                <span className="inline-flex items-center gap-1"><CalendarDays className="size-4 text-gray-400" /> {t.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 line-clamp-5">{t.text}</p>
                          <button className="mt-4 text-[#1A1B16] font-semibold hover:text-[#F5D238]">Read more</button>
                        </article>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* $250K Guarantee Banner (placed after testimonials) */}
          <section className="py-8 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <div className="relative overflow-hidden rounded-[28px]">
                {/* Background image */}
                <div
                  className="relative h-[360px] md:h-[440px] w-full bg-center bg-cover"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2000&auto=format&fit=crop)",
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/55"></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                    <div className="max-w-5xl">
                      <h2 className="text-white font-extrabold leading-tight text-3xl md:text-5xl lg:text-6xl">
                        Join homeowners who've chosen
                        <br className="hidden md:block" />
                        the security of our $250,000 guarantee
                      </h2>
                      <p className="text-white/90 mt-5 text-base md:text-lg max-w-3xl mx-auto">
                        We understand the trust you place in contractors when you invite them into your space.
                        That's why we've created the most comprehensive protection program in the industry.
                      </p>
                      <div className="mt-7">
                        <Link
                          to="/contractors"
                          className="inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-[#F5D238] text-[#1A1B16] font-bold shadow hover:shadow-md transition"
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

          {/* FAQ - Questions about Directorii (final section at bottom) */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1A1B16] mb-6">Questions about Directorii</h2>
              <div className="max-w-4xl mx-auto divide-y divide-gray-200">
                {[
                  { q: 'How do I use Directorii?', a: 'Search for your project type and location, compare vetted contractors, and hire with confidence under our protection program.' },
                  { q: 'How are Directorii contractors different?', a: 'All contractors on Directorii are verified, financially screened, and backed by our guarantee to protect homeowners.' },
                  { q: 'What if there are no contractors in my area?', a: 'We are expanding rapidly. If none are listed, leave your info and we will notify you as soon as vetted contractors are available.' },
                  { q: 'How much does it cost?', a: 'Using Directorii is free for homeowners. Contractors may have membership fees, but your protection is always included.' },
                  { q: 'What does the $250,000 Guarantee cover?', a: 'It covers eligible losses such as contractor abandonment, shoddy workmanship, or damage caused during the project, up to the specified limit.' },
                ].map((item, idx) => (
                  <FaqItem key={idx} question={item.q} answer={item.a} />
                ))}
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
        <span
          className="shrink-0 inline-flex items-center justify-center size-9 rounded-full border border-gray-300 text-[#1A1B16] bg-white transform transition-colors transition-transform duration-200 ease-out group-hover:bg-[#F5D238] group-hover:border-[#F5D238] group-hover:text-[#1A1B16] group-hover:scale-110"
        >
          {open ? <Minus className="size-5" /> : <Plus className="size-5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
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