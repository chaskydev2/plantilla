import { NearbyContractorsSkeleton } from "./NearbyContractorsSkeleton";

export function ContractorProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5D238] overflow-x-hidden">
      <div className="mx-auto w-full max-w-screen-xl px-3 py-10 sm:px-4 lg:px-8">
        <div className="h-4 w-56 rounded-full bg-[#FFE48A]" />
        <div className="mt-6 overflow-hidden rounded-3xl border border-[#1E1E17]/10 bg-white/90 shadow-[0_24px_80px_rgba(30,30,23,0.25)] backdrop-blur">
          <div className="border-b border-[#1E1E17]/10 bg-[#F9E27D] px-4 py-8 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="h-5 w-40 rounded-full bg-[#FFE48A]" />
                <div className="h-10 w-64 rounded-lg bg-white/70" />
                <div className="h-4 w-72 rounded bg-white/60" />
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <div className="h-10 w-48 rounded-full bg-white" />
                <div className="h-3 w-28 rounded bg-white/70" />
              </div>
            </div>
            <div className="mt-6 h-10 w-36 rounded-full bg-white/80" />
          </div>

          <div className="grid gap-8 border-b border-[#1E1E17]/5 bg-white px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:px-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="h-24 w-24 rounded-full border-4 border-[#F5D238] bg-[#FFF3B0]" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 w-52 rounded bg-[#FFF3B0]" />
                  <div className="h-4 w-40 rounded bg-[#FFF3B0]" />
                  <div className="h-3 w-24 rounded bg-[#FFF3B0]" />
                  <div className="h-3 w-28 rounded bg-[#FFF3B0]" />
                </div>
              </div>

              <div className="h-4 w-48 rounded bg-[#FFF3B0]" />

              <div className="rounded-2xl border border-[#1E1E17]/10 bg-[#FFF8DB] p-5">
                <div className="h-5 w-40 rounded bg-[#FFE48A] mb-4" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-3 rounded bg-[#FFF3B0]" />
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, column) => (
                  <div key={column} className="rounded-2xl border border-[#1E1E17]/10 bg-white p-5 shadow-sm">
                    <div className="h-4 w-36 rounded bg-[#FFF3B0]" />
                    <div className="mt-4 space-y-3">
                      {Array.from({ length: 4 }).map((__, row) => (
                        <div key={row} className="h-3 rounded bg-[#FFF3B0]" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-2xl border border-[#1E1E17]/10 bg-white p-5 shadow-sm">
                    <div className="h-4 w-36 rounded bg-[#FFF3B0]" />
                    <div className="mt-3 space-y-2">
                      {Array.from({ length: 3 }).map((__, row) => (
                        <div key={row} className="h-3 rounded bg-[#FFF3B0]" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-2 text-xs text-[#1E1E17]/60">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-3 rounded bg-[#FFF3B0]" />
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-[#1E1E17]/10 bg-[#FFF8DB] p-5 shadow-sm">
              <div className="space-y-3">
                <div className="h-5 w-40 rounded bg-[#FFE48A]" />
                <div className="h-3 w-48 rounded bg-[#FFF3B0]" />
              </div>
              <div className="mt-4 h-80 rounded-2xl border border-white/40 bg-white/60" />
              <div className="mt-4 flex gap-3">
                <div className="h-12 flex-1 rounded-lg bg-[#FFF3B0]" />
                <div className="h-12 w-24 rounded-lg bg-[#FFF3B0]" />
              </div>
            </aside>
          </div>

          <div className="bg-[#FFF3B0] px-4 py-8 sm:px-6 lg:px-10">
            <div className="h-5 w-56 rounded bg-white/70" />
            <div className="mt-4">
              <NearbyContractorsSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
