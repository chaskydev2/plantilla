import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  PaintbrushVertical,
  Home,
  Wrench,
  Plug,
  Search,
  Droplet,
  Fan,
  Snowflake,
  ShieldCheck,
  Hammer,
  MapPin,
  Plus,
} from "lucide-react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
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
    request: { location: { lat: number; lng: number } },
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

const mockInitialServices = [
  { name: "Plumbing", icon: Wrench },
  { name: "Electrical", icon: Plug },
  { name: "Cleaning", icon: Droplet },
  { name: "Landscaping", icon: Hammer }, // closest available
  { name: "Painting", icon: PaintbrushVertical },
  { name: "Roofing", icon: Home },
  { name: "HVAC", icon: Fan },
  { name: "Carpentry", icon: Hammer },
  { name: "Pest Control", icon: ShieldCheck }, // protective/fallback
  { name: "Moving", icon: ChevronRight }, // directional fallback
  { name: "Appliance Repair", icon: Wrench },
  { name: "Flooring", icon: Home },
  { name: "Window Cleaning", icon: Droplet },
  { name: "Gutter Cleaning", icon: Droplet },
  { name: "Pool Maintenance", icon: Droplet },
  { name: "Snow Removal", icon: Snowflake },
  { name: "Handyman Services", icon: Wrench },
  { name: "Home Inspection", icon: Search },
  { name: "Interior Design", icon: Home },
  { name: "Moving Services", icon: ChevronRight },
];

const mockList = [
  { id: 1, name: "Roof Cleaning" },
  { id: 2, name: "Roof Maxx" },
  { id: 3, name: "Roof Repairs" },
  { id: 4, name: "Roof Replacements" },
  { id: 5, name: "Roof Restoration" },
  { id: 6, name: "Gutter Cleaning" },
  { id: 7, name: "Gutter Guards" },
  { id: 8, name: "Roof Inspection" },
  { id: 9, name: "Skylight Installation" },
  { id: 10, name: "Chimney Repair" },
  { id: 11, name: "Roof Ventilation" },
  { id: 12, name: "Emergency Roof Repair" },
  { id: 13, name: "Commercial Roofing" },
  { id: 14, name: "Residential Roofing" },
  { id: 15, name: "Flat Roof Services" },
  { id: 16, name: "Metal Roofing" },
  { id: 17, name: "Tile Roofing" },
  { id: 18, name: "Asphalt Shingle Roofing" },
  { id: 19, name: "Wood Shake Roofing" },
  { id: 20, name: "Solar Panel Installation" },
  { id: 21, name: "Roof Cleaning Services" },
  { id: 22, name: "Roof Maintenance" },
  { id: 23, name: "Roof Leak Repair" },
  { id: 24, name: "Plumbing" },
  { id: 25, name: "Electrical" },
  { id: 26, name: "Cleaning" },
  { id: 27, name: "Landscaping" }, // closest available
  { id: 28, name: "Painting" },
  { id: 29, name: "Roofing" },
  { id: 30, name: "HVAC" },
  { id: 31, name: "Carpentry" },
  { id: 32, name: "Pest Control" }, // protective/fallback
  { id: 33, name: "Moving" }, // directional fallback
  { id: 34, name: "Appliance Repair" },
  { id: 35, name: "Flooring" },
  { id: 36, name: "Window Cleaning" },
  { id: 37, name: "Gutter Cleaning" },
  { id: 38, name: "Pool Maintenance" },
  { id: 39, name: "Snow Removal" },
  { id: 40, name: "Handyman Services" },
  { id: 41, name: "Home Inspection" },
  { id: 42, name: "Interior Design" },
  { id: 43, name: "Moving Services" },
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
  const [locationPredictions, setLocationPredictions] = useState<Array<{ description: string; place_id: string }>>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

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
        // Choose a single valid type: use regions for city names, geocode for ZIP-like queries
        const types = /\d/.test(input) ? ["geocode"] : ["(regions)"];
        svc.getPlacePredictions(
          {
            input,
            sessionToken: sessionTokenRef.current,
            types,
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

  const filteredServices = mockList.filter((service) =>
    service.name.toLowerCase().includes(queryService.toLowerCase())
  );

  const handleSelect = (name: string) => {
    setQueryService(name);
    setOpen(false);
    // re-focus the input after selection
  };

  const handleUseLocation = () => {
    if (!("geolocation" in navigator)) {
      setQueryLocation("Location not available");
      setOpenLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const w = window;
        // Ensure Maps is available (script might not be ready if user clicks quickly)
        const ensureGeocoder = async () => {
          if (w.google && w.google.maps) {
            if (!geocoderRef.current && w.google.maps.Geocoder) {
              geocoderRef.current = new w.google.maps.Geocoder();
            }
            return;
          }
          const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
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
            // swallow, we'll fallback below
          }
        };

        const applyAddress = (results: GeocoderResult[] | null, status: string) => {
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
          setOpenLocation(false);
        };

        (async () => {
          await ensureGeocoder();
          const geo = geocoderRef.current;
          if (!geo) {
            setQueryLocation("Current location");
            setOpenLocation(false);
            return;
          }
          geo.geocode({ location: { lat: latitude, lng: longitude } }, applyAddress);
        })();
      },
      () => {
        setQueryLocation("");
        setOpenLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="flex w-full max-w-2xl items-center rounded-full p-1 pr-2 shadow-2xl bg-white border border-gray-200"
      >
        {/* Service select */}
        <div aria-label="Select a service" className="relative flex">
          <Plus aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            placeholder="What can we do for you?"
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
            placeholder="City, ZIP"
            value={queryLocation}
            onChange={(e) => {
              setQueryLocation(e.target.value);
              if (!openLocation) setOpenLocation(true);
            }}
            className="w-full py-3 pl-10 pr-3 focus:outline-none text-[#1A1B16] placeholder-gray-500 bg-transparent"
          />
        </div>

        <Link
          to="/findpro"
          className="inline-flex items-center bg-[#1A1B16] hover:bg-[#2A2B26] text-white font-bold py-3 px-6 md:px-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1B16] focus:ring-offset-white"
        >
          <span>Find a Pro</span>
          <Search className="ml-2 size-4 text-white" />
        </Link>
      </motion.div>
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
                    {mockInitialServices.map((service) => (
                      <DropdownItemGeneral
                        key={service.name}
                        label={service.name}
                        icon={service.icon}
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
                            className="inline-flex items-center bg-[#1A1B16] hover:bg-[#2A2B26] text-white text-sm font-medium py-2 px-3 rounded-md"
                          >
                            Use my location
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenLocation(false)}
                            className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-[#1A1B16] text-sm font-medium py-2 px-3 rounded-md"
                          >
                            Not now
                          </button>
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

function DropdownItem({ label, disabled, onClick }: { label: string; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-sm text-left ${
        disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-black">{label}</span>
      </div>
    </button>
  );
}
function DropdownItemGeneral({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex-col h-28 border-black w-full flex justify-between items-center px-3 py-2 rounded-md text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer`}
    >
      <div className="h-1/2 flex items-center">{Icon && <Icon className="size-7 text-black" />}</div>
      <div className="h-1/2 text-center text-black items-center">{label}</div>
    </button>
  );
}
