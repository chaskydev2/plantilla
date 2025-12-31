import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Plus, Search, Tag } from "lucide-react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { ProfessionService } from "@/core/services/profession/profession.service";
import { MapPickerSection } from "./components/MapPickerSection";
import { QuickLocations } from "./components/QuickLocations";
import { toLucideIcon } from "./utils/iconUtils";
// Minimal typings for Google Places to avoid using any
type PlacesPrediction = { description: string; place_id: string };
type PlacesAutocompleteService = {
  getPlacePredictions: (
    request: { input: string; sessionToken?: unknown; types?: string[] },
    callback: (predictions: PlacesPrediction[] | null, status: string) => void
  ) => void;
};
type AddressComponent = { long_name: string; short_name: string; types: string[] };
type GeocoderResult = { address_components: AddressComponent[]; formatted_address: string };
type Geocoder = {
  geocode: (
    request: { location: { lat: number; lng: number } } | { address: string },
    callback: (results: GeocoderResult[] | null, status: string) => void
  ) => void;
};

declare global {
  interface Window {
    google?: {
      maps?: {
        Geocoder: new () => Geocoder;
        places?: {
          AutocompleteService: new () => PlacesAutocompleteService;
          AutocompleteSessionToken: new () => unknown;
        };
      };
    };
    __gmapsLoadingPromise?: Promise<void>;
  }
}

type SearchBarProps = { isLoading: boolean };

type ServiceItem = { id: number; name: string; icon?: LucideIcon; iconName?: string };

const quickLocations = [
  "Madrid, ES",
  "Barcelona, ES",
  "Valencia, ES",
  "Sevilla, ES",
  "Bilbao, ES",
];


export default function SearchBar({ isLoading }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const locationPopupRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteServiceRef = useRef<PlacesAutocompleteService | null>(null);
  const sessionTokenRef = useRef<unknown | null>(null);
  const geocoderRef = useRef<Geocoder | null>(null);

  const [queryService, setQueryService] = useState<string>("");
  const [queryLocation, setQueryLocation] = useState<string>("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [locationPredictions, setLocationPredictions] = useState<Array<{ description: string; place_id: string }>>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationFetching, setLocationFetching] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [mapSearchError, setMapSearchError] = useState<string | null>(null);
  const [queryTags, setQueryTags] = useState<string>("");
  const [queryLatLng, setQueryLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const mapMarkerRef = useRef<any>(null);

  // Nuevo estado para mensaje de error de ubicación
  const [locationRequiredError, setLocationRequiredError] = useState<string | null>(null);

  const findProHref = useMemo(() => {
    const params = new URLSearchParams();
    const service = queryService.trim();
    const location = queryLocation.trim();
    const tags = queryTags.trim();
    if (service) params.set("service", service);
    if (location) params.set("location", location);
    if (tags) params.set("tags", tags);
    if (queryLatLng) {
      params.set("lat", queryLatLng.lat.toString());
      params.set("lng", queryLatLng.lng.toString());
    }
    const qs = params.toString();
    return qs ? `/findpro?${qs}` : "/findpro";
  }, [queryService, queryLocation, queryTags, queryLatLng]);


  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await ProfessionService.getAll();
        console.log(res);
        const data = (res.data as any[]) || [];
        const mapped: ServiceItem[] = data.map((item, idx) => ({
          id: item.id ?? idx,
          name: item.name ?? item.slug ?? `Servicio ${idx + 1}`,
          // Let render-time resolver pick the best match; fallback handled in DropdownItem.
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

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDropdown = dropdownRef.current?.contains(target);
      const inTrigger = containerRef.current?.contains(target);
      if (!inDropdown && !inTrigger) {
        setOpen(false);
      }
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

  useEffect(() => {
    if (!openLocation) setShowMapPicker(false);
  }, [openLocation]);

  // Close behavior for the Location popup (outside click/Escape)
  useEffect(() => {
    if (!openLocation) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inPopup = locationPopupRef.current?.contains(target);
      const inTrigger = containerRef.current?.contains(target);
      if (!inPopup && !inTrigger) {
        setOpenLocation(false);
      }
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

  // Ensure Google Places is available when opening the location popup
  useEffect(() => {
    if (!openLocation) return;

    const ensurePlaces = async () => {
      const w = window;
      // Already available
      if (w.google && w.google.maps && w.google.maps.places) {
        if (!autocompleteServiceRef.current) {
          autocompleteServiceRef.current = new w.google.maps.places.AutocompleteService();
        }
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new w.google.maps.places.AutocompleteSessionToken();
        }
        if (!geocoderRef.current && w.google.maps.Geocoder) {
          geocoderRef.current = new w.google.maps.Geocoder();
        }
        return;
      }

      // Try to load script if API key exists
      const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
      if (!key) {
        // If no key but script already present, do nothing; else show hint
        setLocationError("Google Maps API not loaded");
        return;
      }

      // Avoid duplicate loads
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
        if (w.google && w.google.maps && w.google.maps.places) {
          autocompleteServiceRef.current = new w.google.maps.places.AutocompleteService();
          sessionTokenRef.current = new w.google.maps.places.AutocompleteSessionToken();
          if (!geocoderRef.current && w.google.maps.Geocoder) {
            geocoderRef.current = new w.google.maps.Geocoder();
          }
        }
      } catch {
        setLocationError("Failed to load Google Maps");
      }
    };

    ensurePlaces();
  }, [openLocation]);

  const ensureMapsAvailable = async () => {
    const w = window;
    if (w.google && w.google.maps) return true;

    const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setLocationError("Google Maps API not loaded");
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
      setLocationError("Failed to load Google Maps");
      return false;
    }
  };

  // Debounced predictions fetch
  useEffect(() => {
    if (!openLocation) return;
    const input = queryLocation.trim();
    if (!input) {
      setLocationPredictions([]);
      setLocationLoading(false);
      setLocationError(null);
      return;
    }
    const svc = autocompleteServiceRef.current;
    if (!svc) return;

    setLocationLoading(true);
    setLocationError(null);
    const id = window.setTimeout(() => {
      try {
        svc.getPlacePredictions(
          {
            input,
            sessionToken: sessionTokenRef.current,
            // no types filter to allow street-level addresses
          },
          (preds: PlacesPrediction[] | null, status: string) => {
            setLocationLoading(false);
            if (status !== "OK" || !Array.isArray(preds)) {
              setLocationPredictions([]);
              return;
            }
            setLocationPredictions(preds.map((p) => ({ description: p.description, place_id: p.place_id })));
          }
        );
      } catch {
        setLocationLoading(false);
        setLocationError("Autocomplete failed");
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [queryLocation, openLocation]);

  const resolveAddressFromLatLng = async (lat: number, lng: number) => {
    setQueryLatLng({ lat, lng });
    const w = window;
    if (!geocoderRef.current && w.google && w.google.maps && w.google.maps.Geocoder) {
      geocoderRef.current = new w.google.maps.Geocoder();
    }

    const geo = geocoderRef.current;
    if (!geo) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    return new Promise<string>((resolve) => {
      geo.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== "OK" || !Array.isArray(results) || results.length === 0) {
          resolve(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          return;
        }

        const ac = results[0].address_components;
        const postal = ac.find((c) => c.types.includes("postal_code"))?.long_name;
        const city =
          ac.find((c) => c.types.includes("locality"))?.long_name ||
          ac.find((c) => c.types.includes("postal_town"))?.long_name ||
          ac.find((c) => c.types.includes("sublocality"))?.long_name;
        const state = ac.find((c) => c.types.includes("administrative_area_level_1"))?.short_name;

        if (postal) {
          resolve(postal);
          return;
        }
        if (city && state) {
          resolve(`${city}, ${state}`);
          return;
        }
        resolve(results[0].formatted_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      });
    });
  };

  const initMapPicker = async () => {
    const ready = await ensureMapsAvailable();
    if (!ready || !mapContainerRef.current) return;

    const w = window;
    const maps = w.google!.maps as any;

    mapInstanceRef.current = new maps.Map(mapContainerRef.current, {
      center: { lat: 40.4168, lng: -3.7038 },
      zoom: 5,
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
      setLocationError(null);
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

    setMapSearchError(null);
    setMapSearchLoading(true);

    const ready = await ensureMapsAvailable();
    if (!ready) {
      setMapSearchLoading(false);
      return;
    }

    const w = window;
    const maps = w.google!.maps as any;
    if (!geocoderRef.current) {
      geocoderRef.current = new maps.Geocoder();
    }

    const geo = geocoderRef.current;
    if (!geo) {
      setMapSearchLoading(false);
      setMapSearchError("No pudimos buscar en el mapa");
      return;
    }

    geo.geocode({ address: mapSearchQuery }, (results: any, status: string) => {
      setMapSearchLoading(false);
      if (status !== "OK" || !Array.isArray(results) || results.length === 0) {
        setMapSearchError("No encontramos esa ubicación");
        return;
      }

      const first = results[0];
      const loc = first.geometry?.location;
      if (!loc) {
        setMapSearchError("No encontramos esa ubicación");
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
      setMapSearchError(null);
    });
  };

  useEffect(() => {
    if (showMapPicker) {
      initMapPicker();
    } else {
      mapInstanceRef.current = null;
      mapMarkerRef.current = null;
    }
  }, [showMapPicker]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(queryService.toLowerCase())
  );

  const handleSelect = (name: string) => {
    setQueryService(name);
    setOpen(false);
    // re-focus the input after selection
  };

  const handleUseLocation = () => {
    const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
    setLocationError(null);
    setLocationFetching(true);
    setQueryLocation("Obteniendo ubicación…");

    const ensureGeocoder = async () => {
      const w = window;
      if (w.google && w.google.maps) {
        if (!geocoderRef.current && w.google.maps.Geocoder) {
          geocoderRef.current = new w.google.maps.Geocoder();
        }
        return;
      }
      if (!key) return;
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
        if (w.google && w.google.maps && w.google.maps.Geocoder) {
          geocoderRef.current = new w.google.maps.Geocoder();
        }
      } catch {
        // ignore, we'll fallback
      }
    };

    const applyAddress = (results: GeocoderResult[] | null, status: string, lat?: number, lng?: number) => {
      if (status !== "OK" || !Array.isArray(results) || results.length === 0) {
        setQueryLocation("Current location");
        setOpenLocation(false);
        return;
      }
      const ac = results[0].address_components;
      const postal = ac.find((c) => c.types.includes("postal_code"))?.long_name;
      const city =
        ac.find((c) => c.types.includes("locality"))?.long_name ||
        ac.find((c) => c.types.includes("postal_town"))?.long_name ||
        ac.find((c) => c.types.includes("sublocality"))?.long_name;
      const state = ac.find((c) => c.types.includes("administrative_area_level_1"))?.short_name;

      const value = postal || (city && state ? `${city}, ${state}` : results[0].formatted_address);
      setQueryLocation(value);
      if (typeof lat === "number" && typeof lng === "number") {
        setQueryLatLng({ lat, lng });
      }
      setOpenLocation(false);
    };

    const reverseGeocode = async (lat: number, lng: number) => {
      await ensureGeocoder();
      const geo = geocoderRef.current;
      if (!geo) {
        setQueryLocation("Current location");
        setOpenLocation(false);
        return;
      }
      geo.geocode({ location: { lat, lng } }, (results, status) => applyAddress(results, status, lat, lng));
    };

    const fallbackWithGoogleGeoAPI = async () => {
      if (!key) return false;
      try {
        const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${key}`, {
          method: "POST",
        });
        if (!res.ok) return false;
        const data = await res.json();
        if (data?.location?.lat && data?.location?.lng) {
          await reverseGeocode(data.location.lat, data.location.lng);
          return true;
        }
      } catch {
        return false;
      }
      return false;
    };

    const handleFailure = async () => {
      const ok = await fallbackWithGoogleGeoAPI();
      if (!ok) {
        setLocationError("No pudimos obtener tu ubicación. Intenta escribir tu ciudad o ZIP.");
        setQueryLocation("");
        setOpenLocation(false);
      }
      setLocationFetching(false);
    };

    if (!("geolocation" in navigator)) {
      handleFailure();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        reverseGeocode(latitude, longitude);
        setLocationFetching(false);
      },
      () => {
        handleFailure();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handler para el botón de buscar profesional (ajustado para <a> de Link)
  const handleSearchClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // Si no hay ubicación, mostrar error y evitar redirección
    if (!queryLocation.trim()) {
      e.preventDefault();
      setLocationRequiredError("Selecciona tu ubicación");
      return;
    }
    setLocationRequiredError(null);
    // Permitir redirección
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="flex w-full max-w-9xl items-center rounded-full p-1 pr-2 shadow-2xl bg-white border border-gray-200"
      >
        {/* Service select */}
        <div aria-label="Select a service" className="relative flex">
          <Plus aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            placeholder="¿En qué podemos ayudarte?"
            aria-label="Select a service"
            ref={inputRef}
            value={queryService}
            onFocus={() => {
              setOpen(true);
              setOpenLocation(false);
            }}
            onChange={(e) => {
              const value = e.target.value;
              setQueryService(value);
              if (!open) setOpen(true);
            }}
            className="placeholder:text-gray-400 w-full py-3 pl-10 pr-8 rounded-l-full focus:outline-none text-[#1A1B16] bg-transparent appearance-none cursor-text"
          />
        </div>

        {/* Free-text tags */}
        <div className="relative flex-1">
          <span
            className="hidden md:block pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300"
            aria-hidden
          ></span>
          <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            type="text"
            aria-label="Describe libremente tu necesidad"
            placeholder="Ej. ayudante de cocina experto"
            value={queryTags}
            onChange={(e) => setQueryTags(e.target.value)}
            className="w-full py-3 pl-10 pr-3 focus:outline-none text-[#1A1B16] placeholder-gray-500 bg-transparent"
          />
        </div>

        {/* Location input */}
        <div className="relative flex-1">
          <span
            className="hidden md:block pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300"
            aria-hidden
          ></span>
          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            onFocus={() => {
              setOpen(false);
              setOpenLocation(true);
            }}
            type="text"
            aria-label="Enter your ZIP code or city"
            placeholder="Ciudad, calle o código postal"
            value={queryLocation}
            onChange={(e) => {
              setQueryLocation(e.target.value);
              setQueryLatLng(null);
              if (!openLocation) setOpenLocation(true);
            }}
            className="w-full py-3 pl-10 pr-3 focus:outline-none text-[#1A1B16] placeholder-gray-500 bg-transparent"
          />
        </div>

        {/* Botón buscar profesional con validación */}
        <Link
          to={findProHref}
          onClick={handleSearchClick}
          className="inline-flex items-center bg-[#1A1B16] hover:bg-[#2A2B26] text-white font-bold py-3 px-6 md:px-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1B16] focus:ring-offset-white"
        >
          <span>Buscar un profesional</span>
          <Search className="ml-2 size-4 text-white" />
        </Link>
      </motion.div>
      {/* Mensaje de error si no hay ubicación */}
      {locationRequiredError && (
        <div className="mt-2 text-center text-sm text-red-600 font-semibold animate-pulse">
          {locationRequiredError}
        </div>
      )}
      {open && rect && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={dropdownRef}
              style={{
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: rect.width,
              }}
              className="absolute z-[9999]"
            >
              <div className="rounded-xl border bg-white shadow-lg p-3 overflow-y-auto">
                {queryService === "" ? (
                  <div className="grid grid-cols-5 gap-2 h-86">
                    {services.slice(0, 10).map((service) => (
                      <DropdownItemGeneral
                        key={service.id}
                        label={service.name}
                        icon={service.icon}
                        iconLabel={service.iconName}
                        onClick={() => handleSelect(service.name)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className=" gap-2">
                    {queryService !== "" &&
                      filteredServices.map((service) => (
                        <DropdownItem
                          key={service.id}
                          label={service.name}
                          icon={service.icon}
                          iconLabel={service.iconName}
                          onClick={() => handleSelect(service.name)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>,
            document.body
          )
        : null}

      {openLocation && rect && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={locationPopupRef}
              style={{
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: rect.width,
              }}
              className="absolute z-[9999]"
            >
              <div className="rounded-xl border bg-white shadow-lg p-3">
                {queryLocation.trim() ? (
                  <div>
                    {locationLoading && <div className="px-3 py-2 text-sm text-gray-500">Searching…</div>}
                    {!locationLoading && locationPredictions.length === 0 && !locationError && (
                      <div className="px-3 py-2 text-sm text-gray-500">No results</div>
                    )}
                    {locationError && <div className="px-3 py-2 text-sm text-red-600">{locationError}</div>}
                    {!locationLoading && locationPredictions.length > 0 && (
                      <div className="max-h-80 overflow-y-auto">
                        {locationPredictions.map((p) => (
                          <DropdownItem
                            key={p.place_id}
                            label={p.description}
                            onClick={() => {
                              setQueryLocation(p.description);
                              setQueryLatLng(null);
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
                        <h3 className="text-sm font-semibold text-[#1A1B16]">Allow access to your location?</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          We use your location to find nearby pros faster. You can also type a city or ZIP instead.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={handleUseLocation}
                            disabled={locationFetching}
                            className="inline-flex items-center bg-[#1A1B16] hover:bg-[#2A2B26] disabled:bg-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-3 rounded-md"
                          >
                            {locationFetching ? "Obteniendo…" : "Use my location"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowMapPicker(true);
                              setLocationError(null);
                            }}
                            className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-[#1A1B16] text-sm font-medium py-2 px-3 rounded-md"
                          >
                            Elegir en el mapa
                          </button>
                        </div>
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-gray-600 mb-1">Quick locations</div>
                          <QuickLocations
                            locations={quickLocations}
                            onPick={(loc) => {
                              setQueryLocation(loc);
                                setQueryLatLng(null);
                              setOpenLocation(false);
                            }}
                          />
                          {showMapPicker && (
                            <MapPickerSection
                              mapSearchQuery={mapSearchQuery}
                              onSearch={handleMapSearch}
                              onQueryChange={setMapSearchQuery}
                              searchLoading={mapSearchLoading}
                              searchError={mapSearchError}
                              mapContainerRef={mapContainerRef}
                              locationFetching={locationFetching}
                            />
                          )}
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
  const SafeIcon = icon || (iconLabel ? toLucideIcon(iconLabel) : undefined) || Briefcase;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-sm text-left ${
        disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shadow-sm">
          <SafeIcon className="w-4 h-4 text-blue-700 dark:text-blue-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-black">{label}</span>
          {iconLabel && <span className="text-xs text-gray-500">{iconLabel}</span>}
        </div>
      </div>
    </button>
  );
}
function DropdownItemGeneral({
  label,
  icon: Icon,
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
  const SafeIcon = Icon || (iconLabel ? toLucideIcon(iconLabel) : undefined) || Briefcase;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex-col h-28 border-black w-full flex justify-between items-center px-3 py-2 rounded-md text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer`}
    >
      <div className="h-1/2 flex items-center">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shadow-sm">
          <SafeIcon className="w-5 h-5 text-black dark:text-white" />
        </div>
      </div>
      <div className="h-1/2 flex flex-col items-center justify-center text-black">
        <span>{label}</span>
      </div>
    </button>
  );
}
