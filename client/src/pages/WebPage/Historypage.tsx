import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, easeIn, easeOut } from "framer-motion";
import { createApiService } from "@/core/services/api.service";
import type { IHistory } from "@/core/types/IHistory";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: easeOut },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.7, ease: easeIn },
  }),
};

const indicatorVariants = {
  active: {
    scale: 1.3,
    backgroundColor: "#0891b2",
    boxShadow: "0 0 10px #0891b2",
    transition: {
      yoyo: Infinity,
      duration: 1,
    },
  },
  inactive: {
    scale: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
};

const Historypage = () => {
  const [histories, setHistories] = useState<IHistory[]>([]);
  const [currentHistory, setCurrentHistory] = useState<IHistory | null>(null);
  const [[currentBanner, direction], setCurrentBanner] = useState([0, 0]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const HistoryService = createApiService({ basePath: 'histories' });

  useEffect(() => {
    getHistories();
  }, []);

  useEffect(() => {
    if (histories.length > 0) {
      setCurrentHistory(histories[0]);
    }
  }, [histories]);

  const getHistories = async () => {
    const response = await HistoryService.get('all');
    setHistories(response.data);
  };

  const getValidBanners = () => {
    if (!currentHistory) return [];
    
    return [
      currentHistory.banner1,
      currentHistory.banner2,
      currentHistory.banner3
    ].filter(banner => banner && banner.trim() !== '');
  };

  const validBanners = getValidBanners();
  const hasBanners = validBanners.length > 0;

  useEffect(() => {
    if (!hasBanners || validBanners.length <= 1) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentBanner(([prev]) => [(prev + 1) % validBanners.length, 1]);
    }, 5000);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentBanner, validBanners.length, hasBanners]);

  const prevBanner = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentBanner(([prev]) => [(prev - 1 + validBanners.length) % validBanners.length, -1]);
  };

  const nextBanner = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentBanner(([prev]) => [(prev + 1) % validBanners.length, 1]);
  };

  if (!currentHistory) {
    return (
      <div className="pt-24 pb-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen flex flex-col items-center">
      {hasBanners ? (
        <div className="relative h-96 max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentBanner}
              className="absolute top-0 left-0 w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${validBanners[currentBanner]})` }}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            />
          </AnimatePresence>

          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
            initial={{opacity:0}}
            animate={{opacity:0.7}}
            transition={{duration:1}}
          />

          {validBanners.length > 1 && (
            <>
              <motion.button
                onClick={prevBanner}
                aria-label="Anterior"
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-cyan-700 hover:bg-cyan-800 text-white p-4 rounded-full shadow-lg z-30 transition-shadow"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px #0891b2" }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>
              <motion.button
                onClick={nextBanner}
                aria-label="Siguiente"
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-cyan-700 hover:bg-cyan-800 text-white p-4 rounded-full shadow-lg z-30 transition-shadow"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px #0891b2" }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
                {validBanners.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentBanner([idx, idx > currentBanner ? 1 : -1])}
                    aria-label={`Slide ${idx + 1}`}
                    className="w-4 h-4 rounded-full"
                    variants={indicatorVariants}
                    initial="inactive"
                    animate={idx === currentBanner ? "active" : "inactive"}
                    transition={{ duration: 0.6 }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}

      <motion.div
        className="max-w-5xl mx-auto mt-6 mb-12"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="h-1 w-28 bg-cyan-600 rounded-full mx-auto shadow-md"></div>
      </motion.div>

      <motion.div
        className="max-w-4xl mx-auto px-6 md:px-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
          {currentHistory.title}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed text-justify tracking-wide">
          {currentHistory.content}
        </p>
      </motion.div>
    </div>
  );
};

export default Historypage;