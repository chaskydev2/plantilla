
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Locate, MapPin, Plus, Search, Tag } from "lucide-react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { ProfessionService } from "@/core/services/profession/profession.service";

import { toLucideIcon } from "@/pages/WebPage/HomePage/utils/iconUtils";

type PlacesPrediction = { description: string; place_id: string };
type PlacesAutocompleteService = {
  getPlacePredictions: (
    request: { input: string; sessionToken?: unknown; types?: string[] },
    callback: (predictions: PlacesPrediction[] | null, status: string) => void
  ) => void;
};
type AddressComponent = { long_name: string; short_name: string; types: string[] };
type LatLngLiteralFn = { lat: () => number; lng: () => number };
type GeocoderResult = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry?: { location?: LatLngLiteralFn };
};
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

type FilterPopupProps = {
  show: boolean;
  onClose: () => void;
  onApply: (service: string, tags: string, location: string, latLng: { lat: number; lng: number } | null) => void;
  error?: string | null;
};



export function FilterPopup({ show, onClose, onApply, error }: FilterPopupProps) {
  const navigate = useNavigate();
  const [queryService, setQueryService] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(undefined);
  const [queryTags, setQueryTags] = useState("");
  const [queryLocation, setQueryLocation] = useState("");
  const [queryLatLng, setQueryLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [services, setServices] = useState<{ id: number; name: string; icon?: LucideIcon; iconName?: string }[]>([]);
  const [locationPredictions, setLocationPredictions] = useState<PlacesPrediction[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationFetching, setLocationFetching] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [mapSearchError, setMapSearchError] = useState<string | null>(null);
  const [mapGeoLoading, setMapGeoLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const locationPopupRef = useRef<HTMLDivElement | null>(null);
  const autocompleteServiceRef = useRef<PlacesAutocompleteService | null>(null);
  const sessionTokenRef = useRef<unknown | null>(null);
  const geocoderRef = useRef<Geocoder | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const mapMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (!show) return;
    const loadServices = async () => {
      try {
        locationFetching; 
        mapReady; 
        const res = await ProfessionService.getAll();
        const data = (res.data as any[]) || [];
        const mapped = data.map((item, idx) => ({
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
  }, [show]);

  // Removed the effect that closed the map when closing the location dropdown

  useEffect(() => {
    if (!openLocation) return;
    const w = window;
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
    const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setLocationError("Could not load Google Maps");
      return;
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
    w.__gmapsLoadingPromise.then(() => {
      if (w.google && w.google.maps && w.google.maps.places) {
        autocompleteServiceRef.current = new w.google.maps.places.AutocompleteService();
        sessionTokenRef.current = new w.google.maps.places.AutocompleteSessionToken();
        if (!geocoderRef.current && w.google.maps.Geocoder) {
          geocoderRef.current = new w.google.maps.Geocoder();
        }
      }
    }).catch(() => setLocationError("Could not load Google Maps"));
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
        svc.getPlacePredictions(
          {
            input,
            sessionToken: sessionTokenRef.current,
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
        setLocationError("Autocomplete error");
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

  const resolveLatLngFromAddress = async (address: string) => {
    const ready = await ensureMapsAvailable();
    if (!ready) return null;
    const w = window;
    if (!geocoderRef.current && w.google && w.google.maps && w.google.maps.Geocoder) {
      geocoderRef.current = new w.google.maps.Geocoder();
    }
    const geo = geocoderRef.current;
    if (!geo) return null;
    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      geo.geocode({ address }, (results, status) => {
        if (status !== "OK" || !Array.isArray(results) || results.length === 0) {
          resolve(null);
          return;
        }
        const loc = results[0].geometry?.location;
        if (!loc) {
          resolve(null);
          return;
        }
        resolve({ lat: loc.lat(), lng: loc.lng() });
      });
    });
  };

  const ensureMapsAvailable = async () => {
    const w = window;
    if (w.google && w.google.maps) return true;
    const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setLocationError("Could not load Google Maps");
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
      setLocationError("Could not load Google Maps");
      return false;
    }
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
    // Forzar resize tras un pequeño timeout para asegurar el render
    setTimeout(() => {
      maps.event.trigger(mapInstanceRef.current, "resize");
      mapInstanceRef.current.setCenter({ lat: 40.4168, lng: -3.7038 });
    }, 200);
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
    setMapReady(true);
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
      setMapSearchError("We couldn't search on the map");
      return;
    }
    geo.geocode({ address: mapSearchQuery }, (results: any, status: string) => {
      setMapSearchLoading(false);
      if (status !== "OK" || !Array.isArray(results) || results.length === 0) {
        setMapSearchError("We couldn't find that location");
        return;
      }
      const first = results[0];
      const loc = first.geometry?.location;
      if (!loc) {
        setMapSearchError("We couldn't find that location");
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
      // Close map picker and location dropdown after successful search
      setShowMapPicker(false);
      setOpenLocation(false);
    });
  };

  const handleSelectPrediction = async (prediction: PlacesPrediction) => {
    setLocationError(null);
    setLocationFetching(true);
    setQueryLocation(prediction.description);
    try {
      const coords = await resolveLatLngFromAddress(prediction.description);
      if (coords) {
        setQueryLatLng(coords);
      } else {
        setQueryLatLng(null);
        setLocationError("We couldn't get coordinates for that location");
      }
      setOpenLocation(false);
    } catch {
      setLocationError("We couldn't get coordinates for that location");
    } finally {
      setLocationFetching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setMapSearchError(null);
    if (!navigator?.geolocation) {
      setMapSearchError("Geolocation is not available on this device");
      return;
    }
    setMapGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const ready = await ensureMapsAvailable();
          if (!ready) {
            setMapSearchError("Google Maps API is not loaded");
            setMapGeoLoading(false);
            return;
          }
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const w = window;
          const maps = w.google!.maps as any;
          if (!mapInstanceRef.current && mapContainerRef.current) {
            mapInstanceRef.current = new maps.Map(mapContainerRef.current, {
              center: { lat, lng },
              zoom: 14,
              disableDefaultUI: true,
            });
          }
          mapInstanceRef.current?.setCenter({ lat, lng });
          mapInstanceRef.current?.setZoom(14);
          if (!mapMarkerRef.current) {
            mapMarkerRef.current = new maps.Marker({ position: { lat, lng }, map: mapInstanceRef.current });
          } else {
            mapMarkerRef.current.setPosition({ lat, lng });
            mapMarkerRef.current.setMap(mapInstanceRef.current);
          }
          const resolved = await resolveAddressFromLatLng(lat, lng);
          setQueryLocation(resolved);
          setQueryLatLng({ lat, lng });
          setShowMapPicker(false);
          setOpenLocation(false);
          setMapSearchError(null);
        } catch {
          setMapSearchError("We couldn't get your location");
        } finally {
          setMapGeoLoading(false);
        }
      },
      (geoError) => {
        setMapGeoLoading(false);
        if (geoError?.code === 1) {
          setMapSearchError("You must allow location access");
          return;
        }
        setMapSearchError("We couldn't get your location");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (showMapPicker) {
      setTimeout(() => {
        initMapPicker();
      }, 50);
    } else {
      mapInstanceRef.current = null;
      mapMarkerRef.current = null;
      setMapReady(false);
    }
  }, [showMapPicker]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(queryService.toLowerCase())
  );

  const handleSelectService = (name: string, id: number) => {
    setQueryService(name);
    setSelectedServiceId(id);
    setShowServiceModal(false);
  };

 

  const [localError, setLocalError] = useState<string | null>(null);

  const handleApply = async () => {
    setLocalError(null);
    // Don't allow searching without a location or coordinates
    if (!queryLocation && !(queryLatLng && typeof queryLatLng.lat === "number" && typeof queryLatLng.lng === "number")) {
      setLocalError("You must enter a location or select one on the map.");
      return;
    }

    let finalLocation = queryLocation;
    let finalLatLng = queryLatLng;

    // If there's no location string but we do have lat/lng, resolve an address
    if (!finalLocation && finalLatLng && typeof finalLatLng.lat === "number" && typeof finalLatLng.lng === "number") {
      finalLocation = await resolveAddressFromLatLng(finalLatLng.lat, finalLatLng.lng);
      setQueryLocation(finalLocation);
    }

    const params = new URLSearchParams();
    
    // Service parameters (similar to FindProPage)
    if (selectedServiceId && queryService) {
      // If there's an ID and a name, use the name (do not send a different profession_name)
      params.set("profession_name", queryService);
    } else if (queryService) {
      // If we only have a name, send as profession_name
      params.set("profession_name", queryService);
    }
    
    // Tags parameter
    if (queryTags) {
      params.set("tag_name", queryTags);
    }
    
    // Location parameters
    if (finalLocation) {
      params.set("location", finalLocation);
    }
    if (finalLatLng && typeof finalLatLng.lat === "number" && typeof finalLatLng.lng === "number") {
      params.set("lat", String(finalLatLng.lat));
      params.set("lng", String(finalLatLng.lng));
    }
    
    console.log("🔍 FilterPopup applying search params:", {
      service_id: selectedServiceId,
      service_name: queryService,
      profession_name: queryService,
      tag_name: queryTags,
      location: finalLocation,
      lat: finalLatLng?.lat,
      lng: finalLatLng?.lng,
    });
    
    navigate({ search: params.toString() });
    onApply(queryService, queryTags, finalLocation, finalLatLng);
    onClose();
  };

  if (!show || typeof document === "undefined") return null;
  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Overlay background */}
        <div
          className="absolute inset-0 bg-[#1E1E17]/80 backdrop-blur-sm transition-opacity duration-300"
          aria-hidden="true"
          onClick={onClose}
        />
        {/* Popup content */}
        <div
          ref={containerRef}
          className="relative flex w-full max-w-4xl items-center rounded-full p-1 pr-2 shadow-2xl border border-[#F5D238] bg-[#1E1E17] backdrop-blur-md"
          style={{ minWidth: 320 }}
        >
          {/* Service select */}
          <div className="relative flex flex-1">
            <Plus aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
            <input
              placeholder="How can we help you?"
              aria-label="Select a service"
              value={queryService}
              onFocus={() => {
                setShowServiceModal(true);
                setOpenLocation(false);
              }}
              onChange={(e) => {
                setQueryService(e.target.value);
                setShowServiceModal(true);
              }}
              className="placeholder:text-[#F5D238] w-full py-3 pl-10 pr-8 rounded-l-full focus:outline-none text-[#F5D238] bg-transparent appearance-none cursor-text border-none"
            />
          </div>
          {/* Tags input */}
          <div className="relative flex-1">
            <span className="hidden md:block pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300" aria-hidden></span>
            <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
            <input
              type="text"
              aria-label="Describe your need"
              placeholder="e.g. experienced kitchen assistant"
              value={queryTags}
              onChange={(e) => setQueryTags(e.target.value)}
              className="w-full py-3 pl-10 pr-3 focus:outline-none text-[#F5D238] placeholder-[#F5D238] bg-transparent border-none"
            />
          </div>
          {/* Location input */}
          <div className="relative flex-1">
            <span className="hidden md:block pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300" aria-hidden></span>
            <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
            <input
              onFocus={() => {
                setOpenLocation(true);
              }}
              type="text"
              aria-label="Enter your ZIP code or city"
              placeholder="City, street, or ZIP code"
              value={queryLocation}
              onChange={(e) => {
                setQueryLocation(e.target.value);
                setQueryLatLng(null);
                if (!openLocation) setOpenLocation(true);
              }}
              className="w-full py-3 pl-10 pr-3 focus:outline-none text-[#F5D238] placeholder-[#F5D238] bg-transparent border-none"
            />
            {openLocation && (
              <div ref={locationPopupRef} className="absolute left-0 top-full mt-2 w-full z-50">
                <div className="rounded-2xl border bg-white shadow-xl p-0 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-b border-green-100">
                    <MapPin className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-green-700 text-base">Search location</span>
                  </div>
                  <div className="p-3">
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2 mb-2 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-medium transition"
                      onClick={() => {
                        setShowMapPicker(true);
                        setOpenLocation(false);
                      }}
                    >
                      <MapPin className="w-5 h-5 text-green-600" />
                      Choose on map
                    </button>
                    {queryLocation.trim() ? (
                      <div>
                        {locationLoading && <div className="px-3 py-2 text-sm text-gray-500">Searching…</div>}
                        {locationFetching && !locationLoading && (
                          <div className="px-3 py-2 text-sm text-gray-500">Getting coordinates…</div>
                        )}
                        {!locationLoading && locationPredictions.length === 0 && !locationError && (
                          <div className="px-3 py-2 text-sm text-gray-500">No results found</div>)}
                        {locationError && <div className="px-3 py-2 text-sm text-red-600">{locationError}</div>}
                        {!locationLoading && locationPredictions.length > 0 && (
                          <div className="max-h-60 overflow-y-auto">
                            {locationPredictions.map((p) => (
                              <button
                                key={p.place_id}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-50"
                                onClick={() => handleSelectPrediction(p)}
                                disabled={locationFetching}
                              >
                                {p.description}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">Type to search for a location…</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Button */}
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center bg-[#F5D238] hover:bg-[#e6c12e] text-[#1E1E17] font-bold py-3 px-6 md:px-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5D238] focus:ring-offset-[#1E1E17] ml-2 border border-[#F5D238]"
          >
            <span>Find a professional</span>
            <Search className="ml-2 size-4 text-[#1A1B16]" />
          </button>
          {/* Close button (optional, for modal context) */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 text-[#F5D238] hover:text-[#e6c12e] text-2xl font-bold"
          >
            ×
          </button>
          {(error || localError) && <div className="text-red-600 text-sm text-center mt-2 w-full absolute left-0 -bottom-8">{localError || error}</div>}
        </div>
      </div>
      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#1E1E17]/80 backdrop-blur-sm">
          <div className="relative bg-[#1E1E17] rounded-2xl shadow-2xl p-4 w-full max-w-2xl flex flex-col items-center border border-[#F5D238]">
            <button
              type="button"
              className="absolute top-2 right-2 text-[#F5D238] hover:text-[#e6c12e] text-2xl font-bold"
              aria-label="Close map picker"
              onClick={() => setShowMapPicker(false)}
            >
              ×
            </button>
            {/* Search input for map location */}
            <form
              onSubmit={handleMapSearch}
              className="w-full flex gap-2 mb-4"
              style={{ maxWidth: 480 }}
            >
              <input
                type="text"
                placeholder="Search location on the map..."
                value={mapSearchQuery}
                onChange={e => setMapSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#F5D238] rounded-lg focus:outline-none bg-[#1E1E17] text-[#F5D238] placeholder-[#F5D238]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#F5D238] text-[#1E1E17] rounded-lg hover:bg-[#e6c12e] transition font-bold"
                disabled={mapSearchLoading}
              >
                Search
              </button>
            </form>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-3 rounded-lg border border-[#F5D238] text-[#F5D238] hover:bg-[#F5D238]/10 transition font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={mapGeoLoading}
            >
              <Locate className="w-5 h-5" />
              <span>{mapGeoLoading ? "Locating..." : "Use my current location"}</span>
            </button>
            {mapSearchError && (
              <div className="text-red-600 text-sm mb-2 w-full text-center">{mapSearchError}</div>
            )}
            <div
              className="w-full h-96 rounded-lg overflow-hidden border border-[#F5D238]"
              ref={mapContainerRef}
              id="map-modal-container"
              style={{ minHeight: 384, minWidth: 320, height: 384, width: '100%' }}
            />
            <div className="mt-4 w-full flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-[#F5D238] text-[#1E1E17] rounded-lg hover:bg-[#e6c12e] transition font-bold"
                onClick={() => setShowMapPicker(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Picker Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#1E1E17]/80 backdrop-blur-sm">
          <div className="relative bg-[#1E1E17] rounded-2xl shadow-2xl p-4 w-full max-w-3xl flex flex-col border border-[#F5D238]">
            <button
              type="button"
              className="absolute top-2 right-2 text-[#F5D238] hover:text-[#e6c12e] text-2xl font-bold"
              aria-label="Close service picker"
              onClick={() => setShowServiceModal(false)}
            >
              ×
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-5 h-5 text-[#F5D238]" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">Select a service</h3>
                <p className="text-xs text-[#F5D238]/80">Type to filter or pick from the list</p>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={queryService}
                onChange={(e) => setQueryService(e.target.value)}
                placeholder="Search service..."
                className="w-full px-3 py-2 rounded-lg border border-[#F5D238] bg-[#1E1E17] text-[#F5D238] placeholder-[#F5D238] focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredServices.length === 0 && (
                <div className="col-span-full text-sm text-center text-[#F5D238]/80 border border-dashed border-[#F5D238]/40 rounded-lg p-4">
                  No services found
                </div>
              )}
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleSelectService(service.name, service.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#F5D238]/40 bg-[#1E1E17] hover:bg-[#F5D238]/10 transition text-left"
                >
                  <span className="w-10 h-10 bg-[#F5D238]/15 rounded-full flex items-center justify-center">
                    {(service.icon && <service.icon className="w-5 h-5 text-[#F5D238]" />) || (
                      <Briefcase className="w-5 h-5 text-[#F5D238]" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-white">{service.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 w-full flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-[#F5D238] text-[#1E1E17] rounded-lg hover:bg-[#e6c12e] transition font-bold"
                onClick={() => setShowServiceModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}

