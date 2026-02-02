import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Briefcase, ChevronLeft, ChevronRight, MapPin, Plus, Search, Tag } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { ProfessionService } from "@/core/services/profession/profession.service";
import { ServiceService } from "@/core/services/service/service.service";
import { MapPickerSection } from "./components/MapPickerSection";
import { QuickLocations } from "./components/QuickLocations";
import { toLucideIcon } from "./utils/iconUtils";
import { useTranslation } from "react-i18next";

// --- Types ---
type PlacesPrediction = { description: string; place_id: string };
type PlacesAutocompleteService = {
  getPlacePredictions: (
    request: { input: string; sessionToken?: unknown; types?: string[] },
    callback: (predictions: PlacesPrediction[] | null, status: string) => void
  ) => void;
};
type AddressComponent = { long_name: string; short_name: string; types: string[] };
type MinimalGeocoderResult = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
};
type MinimalGeocodeRequest = { location: { lat: number; lng: number } } | { address: string };
type MinimalGeocodeCallback = (results: MinimalGeocoderResult[] | null, status: string) => void;
type MinimalGeocoder = {
  geocode: (request: MinimalGeocodeRequest, callback: MinimalGeocodeCallback) => void;
};

type SearchBarProps = { isLoading: boolean };
type ServiceItem = { id: number; name: string; icon?: LucideIcon; iconName?: string };

// Ubicaciones rápidas
const quickLocations = ["Santa Cruz, BO", "La Paz, BO", "Cochabamba, BO", "Tarija, BO", "Sucre, BO"];

// Guardamos KEYS (no strings) para que al cambiar idioma se re-traduzca bien
type LocationErrorKey = null | "gmapsNotLoaded" | "gmapsFailedLoad" | "autocompleteFailed" | "couldNotGetLocation";
type MapSearchErrorKey = null | "mapCouldNotSearch" | "mapLocationNotFound";
type RequiredErrorKey = null | "locationRequired";

export default function SearchBar({ isLoading }: SearchBarProps) {
  const { t } = useTranslation();

  // State
  const [open, setOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const locationPopupRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Maps Refs
  const autocompleteServiceRef = useRef<PlacesAutocompleteService | null>(null);
  const sessionTokenRef = useRef<unknown | null>(null);
  const geocoderRef = useRef<MinimalGeocoder | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const mapMarkerRef = useRef<any>(null);

  // Form State
  const [queryService, setQueryService] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedProfessionName, setSelectedProfessionName] = useState<string>("");

  const [queryLocation, setQueryLocation] = useState<string>("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceFilters, setServiceFilters] = useState<ServiceItem[]>([]);
  const [serviceFiltersLoading, setServiceFiltersLoading] = useState<boolean>(false);
  const [serviceFiltersQuery, setServiceFiltersQuery] = useState<string>("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const serviceCarouselRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(5);

  // Location State
  const [locationPredictions, setLocationPredictions] = useState<Array<{ description: string; place_id: string }>>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationErrorKey, setLocationErrorKey] = useState<LocationErrorKey>(null);
  const [locationFetching, setLocationFetching] = useState(false);
  const [locationRequiredErrorKey, setLocationRequiredErrorKey] = useState<RequiredErrorKey>(null);

  // Map State
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [mapSearchErrorKey, setMapSearchErrorKey] = useState<MapSearchErrorKey>(null);

  // Other fields
  const [queryTags, setQueryTags] = useState<string>("");
  const [queryLatLng, setQueryLatLng] = useState<{ lat: number; lng: number } | null>(null);

  // --- CONSTRUCCIÓN DE LA URL ---
  const findProHref = useMemo(() => {
    const params = new URLSearchParams();
    const serviceName = queryService.trim();
    const professionName = (selectedProfessionName || queryService).trim();
    const location = queryLocation.trim();
    const tags = queryTags.trim();

    if (serviceName) {
      params.set("service", serviceName);
      params.set("service_name", serviceName);
    }
    if (professionName) {
      params.set("profesion", professionName);
      params.set("profession_name", professionName);
    }
    if (selectedServiceId) params.set("service_id", selectedServiceId.toString());
    else if (serviceName) params.set("search", serviceName);

    if (location) params.set("location", location);
    if (tags) {
      params.set("tags", tags);
      params.set("tag_name", tags);
    }
    if (queryLatLng) {
      params.set("lat", queryLatLng.lat.toString());
      params.set("lng", queryLatLng.lng.toString());
    }

    const qs = params.toString();
    return qs ? `/findpro?${qs}` : "/findpro";
  }, [queryService, selectedServiceId, selectedProfessionName, queryLocation, queryTags, queryLatLng]);

  // Load Services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await ProfessionService.getAll();
        const data = (res.data as any[]) || [];
        const mapped: ServiceItem[] = data.map((item, idx) => ({
          id: item.id ?? idx,
          name: item.name ?? item.slug ?? `Servicio ${idx + 1}`,
          icon: toLucideIcon(item.icon),
          iconName: item.icon as string | undefined,
        }));
        setServices(mapped);
      } catch {
        setServices([]);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    const loadServiceFilters = async () => {
      setServiceFiltersLoading(true);
      try {
        const res = await ServiceService.getAllServices();
        const data = (res.data as any[]) || [];
        const mapped: ServiceItem[] = data.map((item, idx) => ({
          id: item.id ?? idx,
          name: item.name ?? item.slug ?? `Servicio ${idx + 1}`,
          icon: toLucideIcon(item.icon),
          iconName: item.icon as string | undefined,
        }));
        setServiceFilters(mapped);
      } catch {
        setServiceFilters([]);
      } finally {
        setServiceFiltersLoading(false);
      }
    };
    loadServiceFilters();
  }, []);

  // Dropdown positioning
  useEffect(() => {
    function update() {
      const el = containerRef.current;
      if (!el) return;
      setRect(el.getBoundingClientRect());
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [open, openLocation]);

  // Outside click handler for services dropdown
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDropdown = dropdownRef.current?.contains(target);
      const inTrigger = containerRef.current?.contains(target);
      if (!inDropdown && !inTrigger) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Location popup handler
  useEffect(() => {
    if (!openLocation) setShowMapPicker(false);
  }, [openLocation]);

  useEffect(() => {
    if (!openLocation) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inPopup = locationPopupRef.current?.contains(target);
      const inTrigger = containerRef.current?.contains(target);
      if (!inPopup && !inTrigger) setOpenLocation(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenLocation(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openLocation]);

  // Google Maps Init (when opening location popup)
  useEffect(() => {
    if (!openLocation) return;

    const w = window as any;
    if (w.google && w.google.maps && w.google.maps.places) {
      if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current = new w.google.maps.places.AutocompleteService();
      }
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new w.google.maps.places.AutocompleteSessionToken();
      }
      if (!geocoderRef.current && w.google.maps.Geocoder) {
        geocoderRef.current = new w.google.maps.Geocoder() as unknown as MinimalGeocoder;
      }
      return;
    }

    setLocationErrorKey("gmapsNotLoaded");
  }, [openLocation]);

  const ensureMapsAvailable = async () => {
    const w = window as any;
    if (w.google && w.google.maps) return true;

    const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setLocationErrorKey("gmapsNotLoaded");
      return false;
    }

    if (!w.__gmapsLoadingPromise) {
      w.__gmapsLoadingPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&v=weekly`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });
    }

    try {
      await w.__gmapsLoadingPromise;
      return !!(w.google && w.google.maps);
    } catch {
      setLocationErrorKey("gmapsFailedLoad");
      return false;
    }
  };

  // Debounced predictions
  useEffect(() => {
    if (!openLocation) return;

    const input = queryLocation.trim();
    if (!input) {
      setLocationPredictions([]);
      setLocationLoading(false);
      setLocationErrorKey(null);
      return;
    }

    const svc = autocompleteServiceRef.current;
    if (!svc) return;

    setLocationLoading(true);
    setLocationErrorKey(null);

    const id = window.setTimeout(() => {
      try {
        svc.getPlacePredictions({ input, sessionToken: sessionTokenRef.current }, (preds, status) => {
          setLocationLoading(false);

          if (status !== "OK" || !Array.isArray(preds)) {
            setLocationPredictions([]);
            return;
          }

          setLocationPredictions(preds.map((p) => ({ description: p.description, place_id: p.place_id })));
        });
      } catch {
        setLocationLoading(false);
        setLocationErrorKey("autocompleteFailed");
      }
    }, 250);

    return () => window.clearTimeout(id);
  }, [queryLocation, openLocation]);

  const resolveAddressFromLatLng = async (lat: number, lng: number) => {
    setQueryLatLng({ lat, lng });

    const w = window as any;
    if (!geocoderRef.current && w.google && w.google.maps && w.google.maps.Geocoder) {
      geocoderRef.current = new w.google.maps.Geocoder() as unknown as MinimalGeocoder;
    }

    const geo = geocoderRef.current;
    if (!geo) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    return new Promise<string>((resolve) => {
      geo.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== "OK" || !Array.isArray(results) || results.length === 0) {
          resolve(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          return;
        }
        resolve(results[0].formatted_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      });
    });
  };

  const geocodeAddressToLatLng = async (address: string) => {
    const w = window as any;
    if (!geocoderRef.current && w.google && w.google.maps && w.google.maps.Geocoder) {
      geocoderRef.current = new w.google.maps.Geocoder() as unknown as MinimalGeocoder;
    }

    const geo = geocoderRef.current;
    if (!geo) return { formatted: address, latLng: null as null | { lat: number; lng: number } };

    return new Promise<{ formatted: string; latLng: { lat: number; lng: number } | null }>((resolve) => {
      geo.geocode({ address }, (results, status) => {
        if (status !== "OK" || !Array.isArray(results) || results.length === 0) {
          resolve({ formatted: address, latLng: null });
          return;
        }
        const first = results[0];
        const loc = first.geometry?.location;
        if (!loc) {
          resolve({ formatted: first.formatted_address || address, latLng: null });
          return;
        }
        resolve({
          formatted: first.formatted_address || address,
          latLng: { lat: loc.lat(), lng: loc.lng() },
        });
      });
    });
  };

  const initMapPicker = async () => {
    const ready = await ensureMapsAvailable();
    if (!ready || !mapContainerRef.current) return;

    const w = window as any;
    const maps = w.google.maps as any;

    mapInstanceRef.current = new maps.Map(mapContainerRef.current, {
      center: { lat: -16.5000, lng: -68.1500 }, // La Paz (ejemplo)
      zoom: 12,
      disableDefaultUI: true,
    });

    mapInstanceRef.current.addListener("click", async (event: any) => {
      const lat = event?.latLng?.lat?.();
      const lng = event?.latLng?.lng?.();
      if (typeof lat !== "number" || typeof lng !== "number") return;

      if (!mapMarkerRef.current) {
        mapMarkerRef.current = new maps.Marker({ position: { lat, lng }, map: mapInstanceRef.current });
      } else {
        mapMarkerRef.current.setPosition({ lat, lng });
        mapMarkerRef.current.setMap(mapInstanceRef.current);
      }

      setLocationFetching(true);
      setLocationErrorKey(null);

      const address = await resolveAddressFromLatLng(lat, lng);

      setLocationFetching(false);
      setQueryLocation(address);
      setQueryLatLng({ lat, lng });
      setOpenLocation(false);
      setShowMapPicker(false);
    });
  };

  const handleMapSearch = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!mapSearchQuery.trim()) return;

    setMapSearchErrorKey(null);
    setMapSearchLoading(true);

    const ready = await ensureMapsAvailable();
    if (!ready) {
      setMapSearchLoading(false);
      return;
    }

    const w = window as any;
    const maps = w.google.maps as any;

    if (!geocoderRef.current) geocoderRef.current = new maps.Geocoder() as MinimalGeocoder;

    const geo = geocoderRef.current;
    if (!geo) {
      setMapSearchLoading(false);
      setMapSearchErrorKey("mapCouldNotSearch");
      return;
    }

    geo.geocode({ address: mapSearchQuery }, (results: any, status: string) => {
      setMapSearchLoading(false);

      if (status !== "OK" || !Array.isArray(results) || results.length === 0) {
        setMapSearchErrorKey("mapLocationNotFound");
        return;
      }

      const first = results[0];
      const loc = first.geometry?.location;
      if (!loc) {
        setMapSearchErrorKey("mapLocationNotFound");
        return;
      }

      const lat = loc.lat();
      const lng = loc.lng();

      mapInstanceRef.current?.setCenter({ lat, lng });
      mapInstanceRef.current?.setZoom(14);

      if (!mapMarkerRef.current) {
        mapMarkerRef.current = new maps.Marker({ position: { lat, lng }, map: mapInstanceRef.current });
      } else {
        mapMarkerRef.current.setPosition({ lat, lng });
        mapMarkerRef.current.setMap(mapInstanceRef.current);
      }

      const formatted = first.formatted_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setQueryLocation(formatted);
      setQueryLatLng({ lat, lng });
      setMapSearchErrorKey(null);
    });
  };

  useEffect(() => {
    if (showMapPicker) initMapPicker();
    else {
      mapInstanceRef.current = null;
      mapMarkerRef.current = null;
    }
  }, [showMapPicker]);

  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(queryService.toLowerCase()));
  const visibleQuickServices = useMemo(() => {
    const query = serviceFiltersQuery.trim().toLowerCase();
    if (!query) return serviceFilters;
    return serviceFilters.filter((service) => service.name.toLowerCase().includes(query));
  }, [serviceFilters, serviceFiltersQuery]);

  // Servicios limitados para mostrar progresivamente
  const displayedServices = useMemo(() => {
    return visibleQuickServices.slice(0, visibleCount);
  }, [visibleQuickServices, visibleCount]);

  const hasMoreServices = visibleQuickServices.length > visibleCount;

  const updateCarouselScrollState = () => {
    const container = serviceCarouselRef.current;
    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  const handleCarouselScroll = () => updateCarouselScrollState();

  const handleCarouselScrollEnd = () => {
    const container = serviceCarouselRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth;
    
    // Si llegó al 80% del scroll, cargar más servicios
    if (scrollPercentage > 0.8 && hasMoreServices) {
      setVisibleCount((prev) => Math.min(prev + 5, visibleQuickServices.length));
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    const container = serviceCarouselRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.85;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    updateCarouselScrollState();
  }, [serviceFilters, serviceFiltersLoading, serviceFiltersQuery]);

  // Reiniciar contador cuando cambie la búsqueda
  useEffect(() => {
    setVisibleCount(5);
  }, [serviceFiltersQuery]);

  useEffect(() => {
    const onResize = () => updateCarouselScrollState();
    window.addEventListener("resize", onResize, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSelectService = (service: ServiceItem) => {
    setQueryService(service.name);
    setSelectedServiceId(service.id);
    setSelectedProfessionName(service.name);
    setOpen(false);
  };

  const handleQuickServiceSelect = (service: ServiceItem) => {
    handleSelectService(service);
    inputRef.current?.blur();
  };

  const handleUseLocation = () => {
    setLocationErrorKey(null);
    setLocationFetching(true);
    setQueryLocation(t("searchBar.modal.gettingLocationTitle", "Getting your location…"));

    if (!("geolocation" in navigator)) {
      setLocationErrorKey("couldNotGetLocation");
      setLocationFetching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolveAddressFromLatLng(latitude, longitude).then((addr) => setQueryLocation(addr));
        setLocationFetching(false);
        setOpenLocation(false);
      },
      () => {
        setLocationErrorKey("couldNotGetLocation");
        setLocationFetching(false);
      }
    );
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!queryLocation.trim()) {
      e.preventDefault();
      setLocationRequiredErrorKey("locationRequired");
      return;
    }
    setLocationRequiredErrorKey(null);
  };

  // Textos traducidos desde keys (esto sí reacciona al cambio de idioma)
  const locationErrorText = locationErrorKey ? t(`searchBar.errors.${locationErrorKey}`) : null;
  const mapSearchErrorText = mapSearchErrorKey ? t(`searchBar.errors.${mapSearchErrorKey}`) : null;
  const locationRequiredErrorText = locationRequiredErrorKey ? t(`searchBar.errors.${locationRequiredErrorKey}`) : null;

  return (
    <div ref={containerRef} className="relative" id="profesionales-section">
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="flex w-full max-w-9xl items-center rounded-full p-1 pr-2 shadow-2xl bg-white border border-gray-200"
      >
        {/* INPUT 1: SERVICES */}
        <div aria-label={t("searchBar.serviceAriaLabel", "Select a service")} className="relative flex">
          <Plus aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            placeholder={t("searchBar.servicePlaceholder", "What service do you need?")}
            aria-label={t("searchBar.serviceAriaLabel", "Select a service")}
            ref={inputRef}
            value={queryService}
            onFocus={() => {
              setOpen(true);
              setOpenLocation(false);
            }}
            onChange={(e) => {
              const value = e.target.value;
              setQueryService(value);
              setSelectedServiceId(null);
              setSelectedProfessionName("");
              if (!open) setOpen(true);
            }}
            className="placeholder:text-gray-400 w-full py-3 pl-10 pr-8 rounded-l-full focus:outline-none text-[#1A1B16] bg-transparent appearance-none cursor-text"
          />
        </div>

        {/* INPUT 2: TAGS */}
        <div className="relative flex-1">
          <span className="hidden md:block pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300" aria-hidden />
          <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            type="text"
            aria-label={t("searchBar.tagsAriaLabel", "Describe your need")}
            placeholder={t("searchBar.tagsPlaceholder", "E.g. Kitchen helper")}
            value={queryTags}
            onChange={(e) => setQueryTags(e.target.value)}
            className="w-full py-3 pl-10 pr-3 focus:outline-none text-[#1A1B16] placeholder-gray-500 bg-transparent"
          />
        </div>

        {/* INPUT 3: LOCATION */}
        <div className="relative flex-1">
          <span className="hidden md:block pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300" aria-hidden />
          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            onFocus={() => {
              setOpen(false);
              setOpenLocation(true);
            }}
            type="text"
            aria-label={t("searchBar.locationAriaLabel", "Enter your ZIP code or city")}
            placeholder={t("searchBar.locationPlaceholder", "City, street or ZIP code")}
            value={
              queryLatLng && queryLocation.trim()
                ? `${queryLocation} (Lat: ${queryLatLng.lat.toFixed(5)}, Lng: ${queryLatLng.lng.toFixed(5)})`
                : queryLocation
            }
            onChange={(e) => {
              setQueryLocation(e.target.value);
              setQueryLatLng(null);
              if (!openLocation) setOpenLocation(true);
            }}
            className="w-full py-3 pl-10 pr-3 focus:outline-none text-[#1A1B16] placeholder-gray-500 bg-transparent"
          />
        </div>

        {/* BUTTON: SEARCH */}
        <Link
          to={findProHref}
          onClick={handleSearchClick}
          className="inline-flex items-center bg-[#1A1B16] hover:bg-[#2A2B26] text-white font-bold py-3 px-6 md:px-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1B16] focus:ring-offset-white"
        >
          <span>{t("searchBar.searchButton", "Find a professional")}</span>
          <Search className="ml-2 size-4 text-white" />
        </Link>
      </motion.div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[120px] sm:min-w-[200px]">
              <Tag className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("searchBar.quickServices.filterPlaceholder", "Search a service")}
                value={serviceFiltersQuery}
                onChange={(e) => setServiceFiltersQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-full py-1.5 sm:py-2 pl-8 sm:pl-10 pr-2 sm:pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1B16]"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-5 sm:w-8 pointer-events-none" aria-hidden />
          <div className="absolute inset-y-0 right-0 w-5 sm:w-8 pointer-events-none" aria-hidden />
          <div
            className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1 sm:pb-2 max-w-full"
            style={{ maxWidth: '100vw' }}
            ref={serviceCarouselRef}
            onScroll={() => {
              handleCarouselScroll();
              handleCarouselScrollEnd();
            }}
          >
            {serviceFiltersLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <div key={`service-skeleton-${idx}`} className="min-w-[110px] sm:min-w-[160px] h-[48px] sm:h-[84px] rounded-2xl bg-gray-100 animate-pulse" />
                ))
              : displayedServices.map((service) => (
                  <ServiceQuickItem
                    key={`service-filter-${service.id}`}
                    label={service.name}
                    iconLabel={service.iconName}
                    icon={service.icon}
                    selected={selectedServiceId === service.id || queryService === service.name}
                    onSelect={() => handleQuickServiceSelect(service)}
                  />
                ))}
            {/* Show scroll message only if carousel is scrollable and has more items */}
            {!serviceFiltersLoading && hasMoreServices && (
              <div className="min-w-[110px] sm:min-w-[160px] h-[48px] sm:h-[84px] flex items-center justify-center text-xs sm:text-sm text-gray-400 italic select-none">
                <span className="block sm:hidden">{t("searchBar.quickServices.scrollMore", "Scroll for more...")}</span>
                <span className="hidden sm:block">
                  <span className="mr-2">{t("searchBar.quickServices.scrollMore", "")}</span>
                 
                </span>
              </div>
            )}
          </div>
          {!serviceFiltersLoading && visibleQuickServices.length === 0 && serviceFiltersQuery.trim() && (
            <div className="text-sm text-gray-500 py-4 text-center">
              {t("searchBar.quickServices.emptyFilter", "No matches for your search.")}
            </div>
          )}
          {!serviceFiltersLoading && serviceFilters.length === 0 && (
            <div className="text-sm text-gray-500 py-4 text-center">
              {t("searchBar.quickServices.empty", "No services available right now.")}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              disabled={!canScrollLeft}
              className={`pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border shadow bg-white transition-opacity duration-200 ${
                canScrollLeft ? "opacity-95" : "opacity-0"
              }`}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              disabled={!canScrollRight}
              className={`pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border shadow bg-white transition-opacity duration-200 ${
                canScrollRight ? "opacity-95" : "opacity-0"
              }`}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {locationRequiredErrorText && (
        <div className="mt-2 text-center text-sm text-red-600 font-semibold animate-pulse">{locationRequiredErrorText}</div>
      )}

      {/* DROPDOWN SERVICES */}
      {open && rect && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={dropdownRef}
              style={{ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX, width: rect.width }}
              className="absolute z-[9999]"
            >
              <div className="rounded-xl border bg-white shadow-lg p-3 overflow-y-auto">
                {queryService === "" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                    {services.slice(0, 10).map((service) => (
                      <DropdownItem
                        key={service.id}
                        label={service.name}
                        icon={service.icon}
                        iconLabel={service.iconName}
                        onClick={() => handleSelectService(service)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="gap-2">
                    {filteredServices.map((service) => (
                      <DropdownItem
                        key={service.id}
                        label={service.name}
                        icon={service.icon}
                        iconLabel={service.iconName}
                        onClick={() => handleSelectService(service)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>,
            document.body
          )
        : null}

      {/* POPUP LOCATION */}
      {openLocation && rect && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={locationPopupRef}
              style={{ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX, width: rect.width }}
              className="absolute z-[9999]"
            >
              <div className="rounded-xl border bg-white shadow-lg p-3">
                {queryLocation.trim() ? (
                  <div>
                    {locationLoading && (
                      <div className="px-3 py-2 text-sm text-gray-500">{t("searchBar.location.searching", "Searching…")}</div>
                    )}

                    {!locationLoading && locationPredictions.length === 0 && !locationErrorText && (
                      <div className="px-3 py-2 text-sm text-gray-500">{t("searchBar.location.noResults", "No results")}</div>
                    )}

                    {locationErrorText && <div className="px-3 py-2 text-sm text-red-600">{locationErrorText}</div>}

                    {!locationLoading && locationPredictions.length > 0 && (
                      <div className="max-h-80 overflow-y-auto">
                        {locationPredictions.map((p) => (
                          <DropdownItem
                            key={p.place_id}
                            label={p.description}
                            onClick={async () => {
                              const { formatted, latLng } = await geocodeAddressToLatLng(p.description);
                              setQueryLocation(formatted);
                              setQueryLatLng(latLng);
                              setOpenLocation(false);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-1">
                    <div className="flex items-start gap-3 p-2">
                      <MapPin className="mt-0.5 size-5 text-gray-600" />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[#1A1B16]">
                          {t("searchBar.location.useCurrentTitle", "Use current location?")}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          {t(
                            "searchBar.location.useCurrentDescription",
                            "We use your location to find nearby pros faster. You can also type a city or ZIP instead."
                          )}
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={handleUseLocation}
                            disabled={locationFetching}
                            className="inline-flex items-center bg-[#1A1B16] hover:bg-[#2A2B26] disabled:bg-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-3 rounded-md"
                          >
                            {locationFetching
                              ? t("searchBar.location.getting", "Getting…")
                              : t("searchBar.location.useMyLocation", "Use my location")}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowMapPicker(true);
                              setLocationErrorKey(null);
                            }}
                            className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-[#1A1B16] text-sm font-medium py-2 px-3 rounded-md"
                          >
                            {t("searchBar.location.pickOnMap", "Pick on map")}
                          </button>
                        </div>

                        {showMapPicker && (
                          <div className="mt-4">
                            <MapPickerSection
                              mapSearchQuery={mapSearchQuery}
                              onSearch={handleMapSearch}
                              onQueryChange={setMapSearchQuery}
                              searchLoading={mapSearchLoading}
                              searchError={mapSearchErrorText}
                              mapContainerRef={mapContainerRef}
                              locationFetching={locationFetching}
                            />
                          </div>
                        )}

                        <div className="mt-3">
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            {t("searchBar.location.quickLocations", "Quick locations")}
                          </div>

                          <QuickLocations
                            locations={quickLocations}
                            onPick={async (loc) => {
                              const { formatted, latLng } = await geocodeAddressToLatLng(loc);
                              setQueryLocation(formatted);
                              setQueryLatLng(latLng);
                              setOpenLocation(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>,
            document.body
          )
        : null}

      {/* LOADING MODAL */}
      {locationFetching &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#1E1E17]/80 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl px-8 py-6 flex flex-col items-center">
              <MapPin className="mb-2 size-8 text-[#1A1B16] animate-bounce" />
              <span className="text-lg font-semibold text-[#1A1B16]">
                {t("searchBar.modal.gettingLocationTitle", "Getting your location…")}
              </span>
              <span className="text-sm text-gray-500 mt-2">{t("searchBar.modal.pleaseWait", "Please wait.")}</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* ---------------------- Helper Components ---------------------- */

function DropdownItem({
  label,
  icon,
  iconLabel,
  disabled,
  onClick,
}: {
  label: string;
  icon?: LucideIcon;
  iconLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  // Buscar el icono por nombre como en el admin
  const iconName = iconLabel as keyof typeof LucideIcons | undefined;
  const Icon = iconName && LucideIcons[iconName] ? (LucideIcons[iconName] as LucideIcon) : (icon || Briefcase);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-base text-left transition-colors duration-150 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-sm
        ${disabled ? "text-gray-400 cursor-not-allowed bg-gray-50" : "hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer bg-white"}
      `}
    >
      <span className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900 shadow">
        {Icon ? (
          <Icon className="w-6 h-6 text-black dark:text-white" />
        ) : (
          <Briefcase className="w-6 h-6 text-black dark:text-white" />
        )}
      </span>
      <span className="flex flex-col items-start">
        <span className="font-medium text-[#1A1B16] dark:text-white">{label}</span>
      </span>
    </button>
  );
}

function ServiceQuickItem({
  label,
  icon,
  iconLabel,
  selected,
  onSelect,
}: {
  label: string;
  icon?: LucideIcon;
  iconLabel?: string;
  selected?: boolean;
  onSelect: () => void;
}) {
  const iconName = iconLabel as keyof typeof LucideIcons | undefined;
  const Icon = iconName && LucideIcons[iconName] ? (LucideIcons[iconName] as LucideIcon) : (icon || Briefcase);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`min-w-[160px] flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1A1B16]/40
        ${selected ? "bg-[#1A1B16] text-white border-[#1A1B16]" : "bg-white text-[#1A1B16] border-gray-200"}
      `}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full shadow ${
          selected ? "bg-white/10" : "bg-blue-100"
        }`}
      >
        {Icon ? (
          <Icon className={`w-6 h-6 ${selected ? "text-white" : "text-black"}`} />
        ) : (
          <Briefcase className={`w-6 h-6 ${selected ? "text-white" : "text-black"}`} />
        )}
      </span>
      <span className="font-medium line-clamp-2">{label}</span>
    </button>
  );
}
