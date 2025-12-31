import { List, MapPin, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import ContractorCard from "./ContractorCard";
import OffersCarousel from "./OffersCarousel";
import FilterBar from "./FilterBar";
import MainMapView from "./MainMapView";
import MapView from "./MapView";
import MatchMeCard from "./MatchMeCard";
import { CONTRACTORS, OFFERS } from "./data";
import { ContractorService } from "@/core/services/contractor/contractor.service";
import type { Contractor } from "./ContractorCard";

const mapApiContractor = (item: any, fallbackId: number): Contractor | null => {
  // Si el dato viene con la estructura address/company_info/location/contact/contract/user
  const location = item.location || item;
  const company = item.company_info || item;
  const user = item.user || item;
  const contract = item.contract || item;
  const servicesRaw = company.services || item.professions || [];
  const services = Array.isArray(servicesRaw)
    ? servicesRaw
        .map((s: any) => {
          if (typeof s === "string") return s;
          if (s?.name) return s.name;
          if (s?.title) return s.title;
          return null;
        })
        .filter(Boolean) as string[]
    : [];

  // Usar location.lat/lng si existen, convertir a número
  const lat = location?.lat !== undefined ? Number(location.lat) : (typeof item?.lat === "number" ? item.lat : item?.latitude ? Number(item.latitude) : NaN);
  const lng = location?.lng !== undefined ? Number(location.lng) : (typeof item?.lng === "number" ? item.lng : item?.longitude ? Number(item.longitude) : NaN);
  console.log('Mapeando contractor:', { lat, lng, location, item });

  return {
    id: item?.user_id ?? item?.id ?? fallbackId,
    name: user?.name || item?.name || "Contractor",
    rating: company?.average_rating ? Number(company.average_rating) : (typeof item?.rating === "number" ? item.rating : typeof item?.avg_rating === "number" ? item.avg_rating : 4.5),
    reviews: item?.reviews_count ?? item?.reviews ?? 0,
    elite: Boolean(item?.elite ?? item?.is_elite ?? false),
    projectsRegistered: item?.projects_registered ?? 0,
    services: company?.service_area ? [company.service_area] : services,
    extraServicesCount: servicesRaw?.length && servicesRaw.length > services.length ? servicesRaw.length - services.length : undefined,
    distanceMiles: item?.distance_miles ?? item?.distance ?? 0,
    locationLabel: company?.service_area || item?.service_area || item?.address || item?.city || "",
    lat,
    lng,
    quote: item?.testimonial
      ? {
          author: item.testimonial.author || "Client",
          text: item.testimonial.text || item.testimonial.comment || "",
        }
      : undefined,
  };
};

const Breadcrumb: React.FC = () => <div className="mb-8"></div>;

export default function FindProPage() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [contractorsData, setContractorsData] = useState<Contractor[]>(CONTRACTORS);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [contractorsError, setContractorsError] = useState<string | null>(null);
  const fallbackCenter = { lat: 35.4676, lng: -97.5164 };

  const queryService = searchParams.get("service")?.trim() || "";
  const queryLocation = searchParams.get("location")?.trim() || "";
  const queryTags = searchParams.get("tags")?.trim() || "";
  const queryLat = Number(searchParams.get("lat"));
  const queryLng = Number(searchParams.get("lng"));
  const hasQueryCoords = !Number.isNaN(queryLat) && !Number.isNaN(queryLng);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(hasQueryCoords ? { lat: queryLat, lng: queryLng } : null);
  // Debug: show received lat/lng from URL
  console.log("FindProPage received lat/lng:", { queryLat, queryLng, hasQueryCoords });

  useEffect(() => {
    let isMounted = true;
    let abort = new AbortController();

    const fetchNear = async (lat: number, lng: number) => {
      try {
        setLoadingContractors(true);
        setContractorsError(null);
        const payload = {
          lat,
          lng,
          radius: 50,
          service_area: queryLocation || undefined,
        };
        console.log("🔧 Fetching contractors near:", payload);
        const res = await ContractorService.getNearLocation(payload, { signal: abort.signal });

        // Log everything to inspect full payload from backend
        console.log("🔧 near response raw:", res);
        console.log("🔧 near response data field:", (res as any)?.data);
        console.log("🔧 near response data.data field:", (res as any)?.data?.data);
        console.log("🔧 near success field:", (res as any)?.success);

        const itemsCandidate =
          (res as any)?.data?.data ??
          (res as any)?.data ??
          (Array.isArray(res) ? res : []) ??
          [];

        const items: any[] = Array.isArray(itemsCandidate) ? itemsCandidate : [];
        if (!isMounted) return;
        if (!items.length) {
          setContractorsData(CONTRACTORS);
          setMapCenter({ lat, lng });
          return;
        }
        const mapped = items
          .map((item, idx) => mapApiContractor(item, idx))
          .filter((c): c is Contractor => Boolean(c && !Number.isNaN(c.lat) && !Number.isNaN(c.lng)));
        setContractorsData(mapped.length ? mapped : CONTRACTORS);
        setMapCenter({ lat, lng });
      } catch (err: any) {
        if (!isMounted) return;
        if (err?.name === "CanceledError") return;
        console.error("❌ near error:", err);
        console.error("❌ near error response:", err?.response?.data);
        setContractorsError(err?.response?.data?.message || err?.message || "No se pudo cargar contratistas cercanos");
        setContractorsData(CONTRACTORS);
        setMapCenter({ lat, lng });
      } finally {
        if (isMounted) setLoadingContractors(false);
      }
    };

    if (hasQueryCoords) {
      fetchNear(queryLat, queryLng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchNear(pos.coords.latitude, pos.coords.longitude),
        () => fetchNear(fallbackCenter.lat, fallbackCenter.lng),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      fetchNear(fallbackCenter.lat, fallbackCenter.lng);
    }

    return () => {
      isMounted = false;
      abort.abort();
    };
  }, [fallbackCenter.lat, fallbackCenter.lng, hasQueryCoords, queryLat, queryLng, queryLocation]);

  const filteredContractors = useMemo(() => {
    const service = queryService.toLowerCase();
    const location = queryLocation.toLowerCase();
    const tags = queryTags.toLowerCase();

    if (!service && !location && !tags) return contractorsData;

    return contractorsData.filter((contractor) => {
      const name = contractor.name.toLowerCase();
      const servicesText = contractor.services.join(" ").toLowerCase();
      const locationLabel = contractor.locationLabel.toLowerCase();
      const extra = `${contractor.quote?.text ?? ""}`.toLowerCase();

      const matchesService = service ? name.includes(service) || servicesText.includes(service) : true;
      const matchesLocation = location ? locationLabel.includes(location) : true;
      const matchesTags = tags ? [name, servicesText, extra, locationLabel].some((text) => text.includes(tags)) : true;

      return matchesService && matchesLocation && matchesTags;
    });
  }, [contractorsData, queryService, queryLocation, queryTags]);

  return (
    <div className="min-h-screen pb-8 bg-gradient-to-br from-[#fffbe6] via-[#f5f5f5] to-[#f5d238]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb />

        <div className="mx-auto max-w-6xl rounded-3xl shadow-2xl bg-white/90 border border-[#F5D238]/30 p-6 md:p-10 mt-4">
          {contractorsError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
              {contractorsError}
            </div>
          )}

          {mapCenter && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E17] mb-4 bg-white border border-[#F5D238] rounded-lg px-4 py-2 shadow-lg drop-shadow-sm transition-all">
              <MapPin className="h-4 w-4 text-[#F5D238] mr-1" />
              <span className="text-[#1E1E17] tracking-wide">
                {queryLocation ? queryLocation : 'Ubicación desconocida'}
              </span>
            </div>
          )}

          <MainMapView contractors={contractorsData} initialCenter={mapCenter || undefined} />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 mt-6">
            <div className="flex items-center bg-[#F5D238]/10 rounded-xl p-2 shadow-inner border border-[#F5D238]/40 gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#F5D238] focus:ring-offset-2 ${
                  viewMode === "list"
                    ? "bg-[#F5D238] text-[#1E1E17] border-[#F5D238] shadow-md transform scale-105"
                    : "text-[#1E1E17] border-transparent hover:text-[#1E1E17] hover:bg-[#F5D238]/30 hover:border-[#F5D238]"
                }`}
              >
                <List className="h-4 w-4" />
                List View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#F5D238] focus:ring-offset-2 ${
                  viewMode === "map"
                    ? "bg-[#F5D238] text-[#1E1E17] border-[#F5D238] shadow-md transform scale-105"
                    : "text-[#1E1E17] border-transparent hover:text-[#1E1E17] hover:bg-[#F5D238]/30 hover:border-[#F5D238]"
                }`}
              >
                <MapPin className="h-4 w-4" />
                Detailed Map
              </button>
            </div>
          </div>

          <hr className="my-6 border-[#F5D238]/30" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {viewMode === "list" ? (
                <div className="space-y-6">
                  {filteredContractors.map((c) => (
                    <div className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 rounded-2xl bg-white/95 border border-[#F5D238]/10">
                      <ContractorCard key={c.id} contractor={c} />
                    </div>
                  ))}
                </div>
              ) : (
                <MapView contractors={filteredContractors} initialCenter={mapCenter || undefined} />
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <MatchMeCard />
              <OffersCarousel items={OFFERS} />

              {viewMode === "map" && (
                <div className="bg-white/95 rounded-2xl shadow-lg border border-[#F5D238]/20 p-6">
                  <h3 className="font-bold text-[#1A1B16] mb-4 text-lg tracking-wide">Contractors in Map</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {filteredContractors.map((contractor) => (
                      <div
                        key={contractor.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5D238]/10 cursor-pointer transition-all border border-transparent hover:border-[#F5D238]/50"
                      >
                        <div className="w-3 h-3 bg-[#F5D238] rounded-full shadow-sm border border-[#1E1E17]/10"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{contractor.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-[#F5D238] fill-current" />
                            <span className="text-xs text-[#1E1E17]">{contractor.rating} ({contractor.reviews})</span>
                            <span className="text-xs text-[#F5D238]">• {contractor.distanceMiles} mi</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
