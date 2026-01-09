import { MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import OffersCarousel from "./OffersCarousel";
import MainMapView from "./MainMapView";
import MatchMeCard from "./MatchMeCard";
import { CONTRACTORS, OFFERS } from "./data";
import { ContractorService } from "@/core/services/contractor/contractor.service";
import type { Contractor } from "./ContractorCard";

const mapApiContractor = (item: any, fallbackId: number): Contractor | null => {
  // Si el dato viene con la estructura address/company_info/location/contact/contract/user
  const location = item.location || item;
  const company = item.company_info || item;
  const user = item.user || item;
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
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [contractorsData, setContractorsData] = useState<Contractor[]>(CONTRACTORS);
  const [visibleContractors, setVisibleContractors] = useState<Contractor[]>(CONTRACTORS);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [contractorsError, setContractorsError] = useState<string | null>(null);
  const fallbackCenter = { lat: 35.4676, lng: -97.5164 };

  const queryLocation = searchParams.get("location")?.trim() || "";
  const queryLat = Number(searchParams.get("lat"));
  const queryLng = Number(searchParams.get("lng"));
  const hasQueryCoords = !Number.isNaN(queryLat) && !Number.isNaN(queryLng);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(hasQueryCoords ? { lat: queryLat, lng: queryLng } : null);
  // Debug: show received lat/lng from URL
  console.log("FindProPage received lat/lng:", { queryLat, queryLng, hasQueryCoords });

  useEffect(() => {
    let isMounted = true;
    let abort = new AbortController();
    loadingContractors
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

  return (
    <div className="min-h-screen pb-8 bg-[#F5D238]">
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

          <MainMapView
            contractors={contractorsData}
            initialCenter={mapCenter || undefined}
            onVisibleChange={setVisibleContractors}
          />

          <hr className="my-6 border-[#F5D238]/30" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between bg-[#1E1E17] text-white rounded-2xl px-6 py-4 shadow-lg border border-[#F5D238]">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#F5D238]/80">Professionals Nearby</p>
                  <h3 className="text-2xl font-extrabold mt-1">{visibleContractors.length} contractors ready to help</h3>
                </div>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs uppercase tracking-wide text-[#F5D238]/70">Filters applied</span>
                  <span className="text-sm font-semibold">{queryLocation || "All areas"}</span>
                </div>
              </div>

              {loadingContractors && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-48 rounded-2xl border border-[#F5D238]/20 bg-white/70 animate-pulse" />
                  ))}
                </div>
              )}

              {!loadingContractors && visibleContractors.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {visibleContractors.map((contractor) => (
                    <div key={contractor.id} className="relative overflow-hidden rounded-2xl border border-[#F5D238]/30 bg-white shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F5D238] via-[#F5D238]/60 to-transparent" />
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="h-14 w-14 rounded-xl border border-[#F5D238]/40 bg-[#FFF7C2] flex items-center justify-center text-sm font-bold text-[#1E1E17]">
                            {contractor.name
                              .split(" ")
                              .slice(0, 2)
                              .map((segment) => segment.charAt(0))
                              .join("") || "PRO"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-lg font-bold text-[#1E1E17] truncate">{contractor.name}</h4>
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#F5D238]/20 px-3 py-1 text-xs font-semibold text-[#1E1E17]">
                                <Star className="h-3.5 w-3.5 text-[#F5D238]" />
                                {contractor.rating.toFixed(1)}
                                <span className="text-[#1E1E17]/60">({contractor.reviews})</span>
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#1E1E17]/70 uppercase tracking-wider">
                              {contractor.locationLabel || "Location unavailable"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-[#1E1E17]/80">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#1E1E17]">Services:</span>
                            <span className="truncate">{contractor.services.slice(0, 3).join(", ") || "No services listed"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#1E1E17]">Projects:</span>
                            <span>{contractor.projectsRegistered} completed via GU</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#1E1E17]">Distance:</span>
                            <span>{contractor.distanceMiles} miles away</span>
                          </div>
                        </div>

                        {contractor.quote && (
                          <div className="mt-4 rounded-xl border border-[#F5D238]/30 bg-[#FFF7C2]/50 p-3 text-xs text-[#1E1E17]/80">
                            <p className="font-semibold text-[#1E1E17]">Client feedback</p>
                            <p className="mt-1 line-clamp-2 italic">“{contractor.quote.text}”</p>
                            <p className="mt-1 text-[10px] uppercase tracking-wide text-[#1E1E17]/60">— {contractor.quote.author}</p>
                          </div>
                        )}

                        <div className="mt-5 flex items-center justify-between">
                          {contractor.elite ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-[#F5D238]/25 px-3 py-1 text-xs font-semibold text-[#1E1E17]">
                              Elite Contractor
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-[#1E1E17]/60">Verified profile</span>
                          )}
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-[#F5D238] px-4 py-2 text-sm font-bold text-[#1E1E17] transition-transform hover:-translate-y-0.5"
                            onClick={() =>
                              navigate(`/findpro/contractor/${contractor.id}`, {
                                state: {
                                  from: {
                                    pathname: routeLocation.pathname,
                                    search: routeLocation.search,
                                  },
                                },
                              })
                            }
                          >
                            Request Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingContractors && !visibleContractors.length && (
                <div className="rounded-2xl border border-dashed border-[#F5D238]/50 bg-white/80 p-10 text-center text-sm text-[#1E1E17]/60">
                  No contractors match the current filters.
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <MatchMeCard />
              <OffersCarousel items={OFFERS} />

              <div className="bg-white/95 rounded-2xl shadow-lg border border-[#F5D238]/20 p-6">
                <h3 className="font-bold text-[#1A1B16] mb-2 text-lg tracking-wide">Top Rated Nearby</h3>
                <p className="text-xs text-[#1E1E17]/70 mb-4">Handpicked from the current map view based on rating and activity.</p>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {visibleContractors
                    .slice()
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 6)
                    .map((contractor) => (
                      <div
                        key={contractor.id}
                        className="flex items-start gap-3 rounded-xl border border-[#F5D238]/20 bg-white/90 p-3 hover:border-[#F5D238]/60 hover:shadow-md transition-all"
                      >
                        <div className="h-8 w-8 rounded-full bg-[#F5D238]/20 flex items-center justify-center text-[11px] font-bold text-[#1E1E17]">
                          {contractor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-[#1E1E17] truncate">{contractor.name}</p>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F5D238]">
                              <Star className="h-3 w-3 text-[#F5D238] fill-current" />
                              {contractor.rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-[#1E1E17]/60 truncate">{contractor.services.slice(0, 2).join(", ") || "Services unavailable"}</p>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-[#1E1E17]/60">
                            <span>{contractor.distanceMiles} mi away</span>
                            <span>{contractor.reviews} reviews</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {!visibleContractors.length && (
                    <div className="rounded-xl border border-dashed border-[#F5D238]/40 p-6 text-center text-sm text-[#1E1E17]/60">
                      No featured contractors available with the current filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
