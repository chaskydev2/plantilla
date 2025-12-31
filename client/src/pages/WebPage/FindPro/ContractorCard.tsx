import { useMemo } from "react";
import { Star, CheckCircle2, Hammer, MapPin, Quote, ShieldCheck } from "lucide-react";
export type Contractor = {
  id: number;
  name: string;
  rating: number; // 0-5
  reviews: number;
  tags?: string[];
  elite: boolean;
  projectsRegistered: number;
  services: string[];
  extraServicesCount?: number;
  distanceMiles: number;
  locationLabel: string; // e.g., "Oklahoma City, OK, 73131"
  lat: number; // Latitud para Google Maps
  lng: number; // Longitud para Google Maps
  logoUrl?: string;
  quote?: { author: string; text: string };
};
export default function ContractorCard({ contractor }: { contractor: Contractor }) {
  const servicesLabel = useMemo(() => {
    const base = contractor.services.join(", ");
    if (contractor.extraServicesCount) return `${base} and ${contractor.extraServicesCount} more`;
    return base;
  }, [contractor.services, contractor.extraServicesCount]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 relative">
      <button className="absolute right-4 top-4 rounded-md bg-primary hover:bg-primary/10 text-white text-sm font-semibold px-3 py-1.5">
        Get a Quote
      </button>

      <div className="flex gap-4">
        <div className="h-16 w-16 rounded-md border border-gray-200 flex items-center justify-center bg-white overflow-hidden">
          <span className="text-xs font-semibold text-gray-700 text-center">LOGO</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#1A1B16] truncate">{contractor.name}</h3>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-700">
            <RatingStars value={contractor.rating} />
            <span className="font-medium">{contractor.rating.toFixed(1)}</span>
            <span className="text-gray-400">•</span>
            <span>{contractor.reviews} reviews</span>
            {contractor.elite && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> $250K Elite
              </span>
            )}
          </div>

          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-gray-500" />
              <span>
                {contractor.projectsRegistered} Project{contractor.projectsRegistered === 1 ? "" : "s"} Registered With
                GU
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Hammer className="h-4 w-4 text-gray-500" />
              <span className="truncate">{servicesLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>
                {contractor.distanceMiles} miles from {contractor.locationLabel}
              </span>
            </div>
          </div>

          {contractor.quote && (
            <div className="mt-3 border border-gray-200 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <Quote className="h-4 w-4 text-gray-500 mt-0.5" />
                <div className="leading-snug">
                  <span className="text-gray-500">{contractor.quote.author} says:</span> {contractor.quote.text}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function RatingStars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < full || (i === full && half);
    return (
      <Star
        key={i}
        className={`h-4 w-4 ${filled ? "text-yellow-500" : "text-gray-300"}`}
        fill={filled ? "currentColor" : "none"}
      />
    );
  });
  return <div className="flex items-center gap-1">{stars}</div>;
}
