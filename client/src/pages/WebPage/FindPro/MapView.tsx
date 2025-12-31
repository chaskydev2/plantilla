import { useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import { MapPin, Star, ShieldCheck } from "lucide-react";
import type { Contractor } from "./ContractorCard";

interface Props {
  contractors: Contractor[];
  initialCenter?: { lat: number; lng: number };
  radiusMiles?: number;
}

export default function MapView({ contractors, initialCenter, radiusMiles = 10 }: Props) {
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const mapCenter = useMemo(() => initialCenter || { lat: 35.4676, lng: -97.5164 }, [initialCenter]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    }),
    []
  );

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-yellow-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Interactive Contractor Map</h3>
                <p className="text-sm text-gray-600">Discover professionals in Oklahoma City area</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                <div>
                  <p className="text-xs text-gray-500">Available</p>
                  <p className="font-bold text-blue-600">{contractors.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-yellow-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                <div>
                  <p className="text-xs text-gray-500">Elite $250K</p>
                  <p className="font-bold text-yellow-600">{contractors.filter((c) => c.elite).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                  <p className="font-bold text-green-600">{contractors.length ? (contractors.reduce((acc, c) => acc + c.rating, 0) / contractors.length).toFixed(1) : "0.0"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="font-bold text-purple-600">24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[600px] bg-gradient-to-br from-blue-50 via-gray-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <MapPin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Interactive Map</h3>
            <p className="text-gray-600">Preparing contractor locations...</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Regular Contractors</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Elite $250K Guaranteed</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">Interactive Google Maps • Click pins for details • Zoom to explore</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-yellow-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Interactive Contractor Map</h3>
              <p className="text-sm text-gray-600">Discover professionals in Oklahoma City area</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="font-bold text-blue-600">{contractors.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-yellow-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
              <div>
                <p className="text-xs text-gray-500">Elite $250K</p>
                <p className="font-bold text-yellow-600">{contractors.filter((c) => c.elite).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Avg Rating</p>
                <p className="font-bold text-green-600">{contractors.length ? (contractors.reduce((acc, c) => acc + c.rating, 0) / contractors.length).toFixed(1) : "0.0"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="font-bold text-purple-600">24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[600px]">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={12}
          options={mapOptions}
          onLoad={() => console.log("Google Map loaded successfully")}
        >
          <Circle
            center={mapCenter}
            radius={radiusMiles * 1609.34}
            options={{
              fillColor: "#F5D238",
              fillOpacity: 0.12,
              strokeColor: "#1E1E17",
              strokeOpacity: 0.45,
              strokeWeight: 2,
            }}
          />

          {contractors
            .filter(
              (contractor) =>
                typeof contractor.lat === "number" &&
                typeof contractor.lng === "number" &&
                !isNaN(contractor.lat) &&
                !isNaN(contractor.lng)
            )
            .map((contractor) => (
              <Marker
                key={contractor.id}
                position={{ lat: contractor.lat, lng: contractor.lng }}
                onClick={() => setSelectedContractor(contractor)}
                options={{
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: contractor.elite ? 14 : 12,
                    fillColor: contractor.elite ? "#F5D238" : "#1E1E17",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 3,
                  },
                }}
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-semibold mb-3">
                    <ShieldCheck className="h-4 w-4" /> $250K Elite Guarantee
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
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{selectedContractor.distanceMiles} miles away</span>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md"
                  onClick={() => console.log("Get quote for:", selectedContractor.name)}
                >
                  Get Free Quote
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Regular Contractors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Elite $250K Guaranteed</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">Interactive Google Maps • Click pins for details • Zoom to explore</p>
        </div>
      </div>
    </div>
  );
}
