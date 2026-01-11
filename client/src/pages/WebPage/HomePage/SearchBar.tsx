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

  const [queryLocation, setQueryLocation] = useState<string>("");
  const [services, setServices] = useState<ServiceItem[]>([]);

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
    const location = queryLocation.trim();
    const tags = queryTags.trim();

    if (selectedServiceId) params.set("service_id", selectedServiceId.toString());
    else if (serviceName) params.set("search", serviceName);

    if (location) params.set("location", location);
    if (tags) params.set("tags", tags);
    if (queryLatLng) {
      params.set("lat", queryLatLng.lat.toString());
      params.set("lng", queryLatLng.lng.toString());
    }

    const qs = params.toString();
    return qs ? `/findpro?${qs}` : "/findpro";
  }, [queryService, selectedServiceId, queryLocation, queryTags, queryLatLng]);

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

  const handleSelectService = (service: ServiceItem) => {
    setQueryService(service.name);
    setSelectedServiceId(service.id);
    setOpen(false);
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
    <div ref={containerRef} className="relative">
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
                  <div className="grid grid-cols-5 gap-2 h-86">
                    {services.slice(0, 10).map((service) => (
                      <DropdownItemGeneral
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
