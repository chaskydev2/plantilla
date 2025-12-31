import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FilterPopup } from "../../../components/FilterPopup";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, OverlayView } from "@react-google-maps/api";
import { Navigation, MapPin, Star, ShieldCheck, Search } from "lucide-react";
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
// Quick locations for the filter popup
const quickLocations = [
  "Madrid, ES",
  "Barcelona, ES",
  "Valencia, ES",
  "Sevilla, ES",
  "Bilbao, ES",
];
import locationContractorIcon from "../../../assets/images/locationContractor.svg";
import type { Contractor } from "./ContractorCard";
interface Props {
  contractors: Contractor[];
  initialCenter?: { lat: number; lng: number };
}

export default function MainMapView({ contractors, initialCenter }: Props) {
  // Popup filter state
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  // Filter fields
  const [filterService, setFilterService] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterTags, setFilterTags] = useState("");
  const [filterLatLng, setFilterLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);
  // For closing popup on outside click/Escape
  useEffect(() => {
    if (!showFilter) return;
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFilter(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showFilter]);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyContractors, setNearbyContractors] = useState<Contractor[]>([]);
  // Opcional: para mostrar todos los contractors filtrados
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([]);
  const [searchRadius, setSearchRadius] = useState(10);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    const fallback = { lat: 35.4676, lng: -97.5164 };

    const applyNearby = (location: { lat: number; lng: number }) => {
      const nearby = contractors
        .filter((c) => calculateDistance(location.lat, location.lng, c.lat, c.lng) <= searchRadius)
        .sort((a, b) => calculateDistance(location.lat, location.lng, a.lat, a.lng) - calculateDistance(location.lat, location.lng, b.lat, b.lng));
      setUserLocation(location);
      setNearbyContractors(nearby);
      setFilteredContractors(nearby); // default filtered = nearby
    };

    if (initialCenter && !Number.isNaN(initialCenter.lat) && !Number.isNaN(initialCenter.lng)) {
      setLocationError(null);
      applyNearby(initialCenter);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setUserLocation(fallback);
      setNearbyContractors(contractors);
      setFilteredContractors(contractors);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocationError(null);
        applyNearby(location);
      },
      () => {
        setLocationError("Unable to get your location. Showing default area.");
        setUserLocation(fallback);
        setNearbyContractors(contractors);
        setFilteredContractors(contractors);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [contractors, searchRadius, initialCenter]);
  // Filtrar contractors según el filtro del popup
  const handleApplyFilter = () => {
    let filtered = [...nearbyContractors];
    if (filterService.trim()) {
      filtered = filtered.filter((c) => c.services.some((s) => s.toLowerCase().includes(filterService.trim().toLowerCase())));
    }
    if (filterTags.trim()) {
      filtered = filtered.filter((c) =>
        filterTags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .every((tag) => c.services.some((s) => s.toLowerCase().includes(tag)) || (c?.tags && c.tags.some((t2: string) => t2.toLowerCase().includes(tag))))
      );
    }
    // Si hay ubicación, podrías filtrar por ciudad, pero aquí solo por servicios/tags
    setFilteredContractors(filtered);
    setShowFilter(false);
  };

  const mapCenter = useMemo(() => userLocation || { lat: 35.4676, lng: -97.5164 }, [userLocation]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    []
  );

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Find Contractors Near You</h2>
                <p className="text-sm text-gray-600">Discovering professionals in your area</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[500px] bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <Navigation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Your Location</h3>
            <p className="text-gray-600">Finding contractors near you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
      {/* Popup buscador tipo filtro extraído a componente */}
      <FilterPopup
        show={showFilter}
        onClose={() => setShowFilter(false)}
        error={filterError}
        onApply={(service, tags, location, latLng) => {
          setFilterService(service);
          setFilterTags(tags);
          setFilterLocation(location);
          setFilterLatLng(latLng);
          handleApplyFilter();
        }}
      />
      <div className="p-0 border-b border-gray-200 bg-gradient-to-r from-[#23231b] via-[#1E1E17] to-[#23231b]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#F5D238] rounded-xl shadow-md">
              <Navigation className="h-5 w-5 text-[#1E1E17]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight mb-0.5">Contractors Near You</h2>
              <p className="text-xs text-[#F5D238] font-medium">
                {locationError ? locationError : `${nearbyContractors.length} contractors found within ${searchRadius} miles`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-200">Search radius:</label>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="px-3 py-1 border border-gray-400 rounded-lg text-xs bg-white text-[#1E1E17] font-semibold focus:outline-none focus:ring-2 focus:ring-[#F5D238] shadow-sm"
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowFilter(true)}
              className="flex items-center gap-2 px-5 py-2 bg-[#F5D238] text-[#1E1E17] rounded-full font-bold shadow-lg hover:bg-yellow-300 transition text-sm"
            >
              <Search className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-0 mb-0 px-4 pb-2">
          {/* Total Contractors Card - stylized */}
          

          {/* Divider for desktop */}
          <div className="hidden sm:block w-px bg-gray-200 my-1"></div>

          {/* Elite Contractors Card moved to map overlay */}

        
        </div>
      </div>

      <div className="relative h-[500px]">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={userLocation ? 13 : 12}
          options={mapOptions}
          onLoad={() => console.log("Main map loaded successfully")}
        >
          {/* Elite Contractors Card as OverlayView at top center of map */}
          {nearbyContractors.filter((c) => c.elite).length > 0 && (
            <OverlayView
              position={mapCenter}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={() => ({ x: -70, y: -210 })}
            >
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg border border-yellow-200 flex flex-col items-center justify-center py-1 px-3 shadow-md min-h-[38px] min-w-[110px]">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-yellow-400/20">
                    <Star className="w-2.5 h-2.5 text-yellow-600" />
                  </span>
                  <span className="text-[10px] font-bold text-yellow-700 tracking-wide">Elite</span>
                </div>
                <span className="text-base font-extrabold text-yellow-600 leading-none mb-0.5 text-center">{nearbyContractors.filter((c) => c.elite).length}</span>
                <span className="text-[8px] text-yellow-700 text-center">Contractors</span>
              </div>
            </OverlayView>
          )}
          {userLocation && (
            <>
              <Marker
                position={userLocation}
                options={{
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 9,
                    fillColor: "#1E1E17",
                    fillOpacity: 1,
                    strokeColor: "#F5D238",
                    strokeWeight: 3,
                  },
                }}
                title="Your Location"
              />

              <Circle
                center={userLocation}
                radius={searchRadius * 1609.34}
                options={{
                  fillColor: "#F5D238",
                  fillOpacity: 0.12,
                  strokeColor: "#1E1E17",
                  strokeOpacity: 0.4,
                  strokeWeight: 2,
                }}
              />
            </>
          )}

          {filteredContractors.map((contractor) => (
            <Marker
              key={contractor.id}
              position={{ lat: contractor.lat, lng: contractor.lng }}
              onClick={() => setSelectedContractor(contractor)}
              options={{
                icon: {
                  url: locationContractorIcon,
                  scaledSize: new window.google.maps.Size(48, 48),
                  anchor: new window.google.maps.Point(24, 48),
                },
              }}
              title={contractor.name}
            />
          ))}

          {selectedContractor && (
            <InfoWindow
              position={{ lat: selectedContractor.lat, lng: selectedContractor.lng }}
              onCloseClick={() => setSelectedContractor(null)}
              options={{ pixelOffset: new google.maps.Size(0, -10) }}
            >
              <div className="p-4 max-w-sm">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{selectedContractor.name}</h3>
                {selectedContractor.elite && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-[#1E1E17] px-3 py-1 text-sm font-semibold mb-3">
                    <ShieldCheck className="h-4 w-4" /> Elite Contractor
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(selectedContractor.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedContractor.rating.toFixed(1)} ({selectedContractor.reviews} reviews)
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">Services:</p>
                  <p className="text-sm text-gray-600">
                    {selectedContractor.services.join(", ")}
                    {selectedContractor.extraServicesCount && ` and ${selectedContractor.extraServicesCount} more`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 text-[#1E1E17]" />
                  <span className="font-medium">{selectedContractor.distanceMiles} miles away</span>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-[#1E1E17] to-[#1E1E17] text-white text-sm font-semibold py-3 px-4 rounded-lg hover:from-[#1E1E17] hover:to-[#1E1E17] transition-all duration-200 transform hover:scale-105 shadow-md"
                  onClick={() => console.log("Get quote for:", selectedContractor.name)}
                >
                  Get Free Quote
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        <div className="absolute top-3 right-3 bg-white/95 border border-yellow-200 shadow-sm rounded-lg px-3 py-2 text-xs text-[#1E1E17] flex items-center gap-2">
          <MapPin className="h-3 w-3 text-[#F5D238]" />
          <span className="font-semibold">Lat:</span>
          <span>{mapCenter.lat.toFixed(5)}</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold">Lng:</span>
          <span>{mapCenter.lng.toFixed(5)}</span>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-gray-50 to-yellow-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#1E1E17] rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#1E1E17] rounded-full"></div>
              <span>Regular Contractors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#F5D238] rounded-full"></div>
              <span>Elite Contractors</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">Interactive map showing contractors within your selected radius</p>
        </div>
      </div>
    </div>
  );
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
