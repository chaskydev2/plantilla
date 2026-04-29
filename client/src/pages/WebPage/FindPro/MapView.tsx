import { useEffect, useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import { MapPin, Star, Navigation2, ExternalLink, Search, Filter, Crosshair, Loader2, X } from "lucide-react";
import type { Contractor } from "./ContractorCard";

interface MapViewProps {
  contractors: Contractor[];
  initialCenter?: { lat: number; lng: number };
  radiusMiles?: number;
}

// Estilo Silver para que el mapa no compita con los colores de la UI
const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];

const categories = [
  { label: "Todos", value: "all", keywords: [] },
  { label: "Plomería", value: "plumbing", keywords: ["plumb", "water", "drain"] },
  { label: "Electricidad", value: "electric", keywords: ["electric", "lighting", "wiring"] },
  { label: "Techos", value: "roof", keywords: ["roof", "gutter", "shingle"] },
  { label: "Pintura", value: "paint", keywords: ["paint", "finish", "coating"] }
];

export default function MapView({ contractors, initialCenter, radiusMiles = 10 }: MapViewProps) {
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [activeFilter, setActiveFilter] = useState(categories[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
    language: "en",
    region: "US",
  });

  const mapCenter = useMemo(() => initialCenter || { lat: 35.4676, lng: -97.5164 }, [initialCenter]);
  const activeCategory = useMemo(() => categories.find((item) => item.value === activeFilter) ?? categories[0], [activeFilter]);

  const filteredContractors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return contractors.filter((contractor) => {
      const matchesSearch = normalizedSearch
        ? [contractor.name, ...(contractor.services ?? [])].some((field) => field.toLowerCase().includes(normalizedSearch))
        : true;

      if (activeFilter === "all") {
        return matchesSearch;
      }

      const keywords = activeCategory.keywords;
      const matchesCategory = (contractor.services ?? []).some((service) =>
        keywords.some((keyword) => service.toLowerCase().includes(keyword))
      );

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, activeFilter, contractors, searchTerm]);

  const stats = useMemo(() => {
    if (!filteredContractors.length) {
      return { averageRating: 0, eliteTotal: 0 };
    }

    const eliteTotal = filteredContractors.filter((contractor) => contractor.elite).length;
    const ratingSum = filteredContractors.reduce((total, contractor) => total + (contractor.rating ?? 0), 0);

    return {
      averageRating: Math.round((ratingSum / filteredContractors.length) * 10) / 10,
      eliteTotal,
    };
  }, [filteredContractors]);

  const topContractors = useMemo(() => filteredContractors.slice(0, 4), [filteredContractors]);

  const handleResetPosition = () => {
    if (!mapInstance) return;

    mapInstance.panTo(mapCenter);
    mapInstance.setZoom(12);
    setSelectedContractor(null);
  };

  useEffect(() => {
    if (!mapInstance || !selectedContractor) return;

    mapInstance.panTo({ lat: selectedContractor.lat, lng: selectedContractor.lng });
  }, [mapInstance, selectedContractor]);

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
      
      {/* 1. Header Dinámico con Búsqueda */}
      <div className="p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-200 rotate-3">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Red de Expertos</h3>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                <Navigation2 className="h-3 w-3 fill-current" /> Oklahoma City, OK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="search" 
                placeholder="Buscar por servicio..." 
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="bg-transparent border-none text-sm w-full pl-9 pr-8 focus:ring-0 placeholder:text-slate-400 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button type="button" className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors border border-slate-200">
              <Filter className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-semibold text-slate-500">{activeCategory.label}</span>
            </button>
          </div>
        </div>

        {/* Chips de Categorías Rápidas */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveFilter(category.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                activeFilter === category.value 
                ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
          <span className="uppercase tracking-widest">{filteredContractors.length} resultados</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>
            Promedio {stats.averageRating ? stats.averageRating.toFixed(1) : "-"} ★
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{stats.eliteTotal} con garantía elite</span>
        </div>
      </div>

      {/* 2. Contenedor del Mapa con Botones Flotantes */}
      <div className="relative h-[650px] group">
        
        {/* Botón de centrado flotante */}
        <button
          type="button"
          onClick={handleResetPosition}
          className="absolute right-4 top-4 z-20 bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 hover:scale-110 active:scale-95 transition-all text-slate-700 group/btn"
          disabled={!isLoaded}
        >
          <Crosshair className="h-5 w-5 group-hover/btn:text-blue-600" />
        </button>

        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-100/80 backdrop-blur-sm">
            <Loader2 className="h-7 w-7 animate-spin text-slate-500" />
            <p className="text-sm font-semibold text-slate-500">Cargando mapa inteligente…</p>
          </div>
        )}

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={12}
            onLoad={setMapInstance}
            onUnmount={() => setMapInstance(null)}
            options={{
              styles: mapStyle,
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {/* Círculo de cobertura con degradado visual */}
            <Circle
              center={mapCenter}
              radius={radiusMiles * 1609.34}
              options={{
                fillColor: "#3b82f6",
                fillOpacity: 0.05,
                strokeColor: "#3b82f6",
                strokeOpacity: 0.2,
                strokeWeight: 1,
              }}
            />

            {filteredContractors.map((contractor: Contractor) => (
              <Marker
                key={contractor.id}
                position={{ lat: contractor.lat, lng: contractor.lng }}
                onClick={() => setSelectedContractor(contractor)}
                options={{
                  icon: {
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: contractor.elite ? "#f59e0b" : "#2563eb",
                    fillOpacity: 1,
                    strokeWeight: selectedContractor?.id === contractor.id ? 3 : 2,
                    strokeColor: contractor.elite ? "#fcd34d" : "#ffffff",
                    scale: selectedContractor?.id === contractor.id ? 1.7 : 1.5,
                    anchor: new google.maps.Point(12, 24),
                  },
                }}
              />
            ))}

            {selectedContractor && (
              <InfoWindow
                position={{ lat: selectedContractor.lat, lng: selectedContractor.lng }}
                onCloseClick={() => setSelectedContractor(null)}
                options={{ pixelOffset: new google.maps.Size(0, -35) }}
              >
                <div className="p-0.5 min-w-[260px] animate-in fade-in zoom-in duration-200">
                  <div className="relative h-24 mb-3 rounded-xl overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <div className="absolute bottom-2 left-3 z-20">
                       <h4 className="font-bold text-white text-base">{selectedContractor.name}</h4>
                       <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">
                         {selectedContractor.services?.[0] ?? "Servicio destacado"}
                       </p>
                    </div>
                  </div>

                  <div className="px-1 pb-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                        <Star className="h-3 w-3 text-amber-500 fill-current" />
                        <span className="text-xs font-black text-amber-700">{selectedContractor.rating?.toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {selectedContractor.distanceMiles} millas de ti
                      </span>
                    </div>

                    <button
                      type="button"
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                      onClick={() => console.log("Action")}
                    >
                      SOLICITAR COTIZACIÓN
                      <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}

        {!!topContractors.length && (
          <div className="absolute left-4 bottom-4 z-20 w-72 max-h-[75%] overflow-y-auto bg-white/90 backdrop-blur rounded-[1.75rem] border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-[0.2em]">Resultados</p>
                <p className="text-lg font-black text-slate-900">Destacados cerca de ti</p>
              </div>
              <span className="text-sm font-bold text-slate-500">{filteredContractors.length}</span>
            </div>

            <div className="space-y-3">
              {topContractors.map((contractor) => (
                <button
                  key={contractor.id}
                  type="button"
                  onClick={() => setSelectedContractor(contractor)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedContractor?.id === contractor.id
                      ? "border-blue-500 bg-blue-50/70 shadow-sm"
                      : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-900">{contractor.name}</p>
                      <p className="text-[11px] font-semibold text-slate-500">
                        {contractor.services.slice(0, 2).join(" • ")}
                      </p>
                    </div>
                    {contractor.elite && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full uppercase tracking-widest">
                        Elite
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-current" />
                      {contractor.rating?.toFixed(1) ?? "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {contractor.distanceMiles} mi
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer con Estadísticas */}
      <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-slate-600 uppercase">En línea</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <span className="text-[11px] font-bold text-slate-600 uppercase">Garantía Elite</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
          <span>Promedio actualizado en tiempo real</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>© 2024 Contractor Network • Google Maps Premium Partner</span>
        </div>
      </div>
    </div>
  );
}