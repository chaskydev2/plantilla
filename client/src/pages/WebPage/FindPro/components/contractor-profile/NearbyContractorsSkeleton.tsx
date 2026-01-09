export function NearbyContractorsSkeleton() {
  const initials = ["AA", "BB", "CC"];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-2xl border border-[#1E1E17]/12 bg-white p-4 shadow-[0_12px_28px_rgba(30,30,23,0.12)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#F5D238]/70 bg-[#1E1E17] text-sm font-bold uppercase text-white shadow-[0_6px_14px_rgba(30,30,23,0.2)]">
            {initials[index % initials.length]}
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-[#F5D238]/30" />
            <div className="h-3 w-24 rounded bg-[#1E1E17]/10" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((__, itemIndex) => (
                <div key={itemIndex} className="h-3 w-12 rounded bg-[#F5D238]/20" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
