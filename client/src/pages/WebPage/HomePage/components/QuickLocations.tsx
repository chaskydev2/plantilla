type QuickLocationsProps = {
  locations: string[];
  onPick: (location: string) => void;
};

export function QuickLocations({ locations, onPick }: QuickLocationsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {locations.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => onPick(loc)}
          className="px-3 py-1 rounded-full border border-gray-200 text-sm text-[#1A1B16] hover:border-gray-400"
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
