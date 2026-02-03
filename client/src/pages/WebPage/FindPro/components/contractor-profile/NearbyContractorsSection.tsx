import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Compass, Star } from "lucide-react";
import type { NearbyContractorCard } from "@/types/contractor";
import { getAvatarInitials } from "@/pages/WebPage/FindPro/utils/contractorProfile";
import { NearbyContractorsSkeleton } from "./NearbyContractorsSkeleton";

interface NearbyContractorsSectionProps {
  loading: boolean;
  error: string | null;
  contractors: NearbyContractorCard[];
}

export function NearbyContractorsSection({ loading, error, contractors }: NearbyContractorsSectionProps) {
  const hasContractors = contractors.length > 0;
  const location = useLocation();
  const originState = location.state as { from?: { pathname: string; search?: string } } | null;
  const sharedState = originState?.from ? { from: originState.from } : undefined;

  return (
    <div className="border-t border-white/5 bg-[#0B0B0B] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Compass className="h-5 w-5 text-white" /> Contractors near this pro
        </h2>
        <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Based on a 30 km radius around the selected location.
        </span>
      </div>

      {loading && (
        <div className="mt-5">
          <NearbyContractorsSkeleton />
        </div>
      )}

      {error && !loading && (
        <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && !hasContractors && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 shadow-sm">
          We could not find contractors near this pro.
        </div>
      )}

      {!loading && !error && hasContractors && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contractors.map((item) => (
            <Link
              key={item.id}
              to={`/findpro/contractor/${item.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-white/12 bg-white p-4 text-[#1E1E17] shadow-[0_14px_32px_rgba(30,30,23,0.12)] transition hover:border-[#ffed00]/40 hover:shadow-[0_18px_40px_rgba(30,30,23,0.18)]"
              state={sharedState}
            >
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#ffed00] bg-[#1E1E17] text-sm font-bold uppercase text-white shadow-[0_8px_18px_rgba(30,30,23,0.24)]">
                {getAvatarInitials(item.name)}
                {item.rating && (
                  <span className="absolute -right-1 -bottom-1 flex items-center justify-center rounded-full border border-white/70 bg-[#ffed00] px-1 text-[9px] font-semibold text-[#1E1E17]">
                    {item.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold tracking-tight group-hover:text-[#1E1E17]">{item.name}</p>
                  <ArrowRight className="h-4 w-4 text-[#1E1E17]/35 transition group-hover:text-[#1E1E17]" />
                </div>
                {item.professions && item.professions.length > 0 && (
                  <p className="mt-1 text-xs text-[#1E1E17]/55">
                    {item.professions.slice(0, 2).join(", ")}
                    {item.professions.length > 2 && " · more"}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#1E1E17]/70">
                  {item.rating && (
                    <span className="inline-flex items-center gap-1 text-[#ffed00]">
                      <Star className="h-3 w-3" /> {item.rating.toFixed(1)}
                    </span>
                  )}
                  {item.serviceArea && <span>{item.serviceArea}</span>}
                  {item.distanceKm !== undefined && <span>{item.distanceKm.toFixed(1)} km</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
