import type { FormEvent, RefObject } from "react";

export type MapPickerSectionProps = {
  mapSearchQuery: string;
  onSearch: (e?: FormEvent<HTMLFormElement>) => void;
  onQueryChange: (value: string) => void;
  searchLoading: boolean;
  searchError: string | null;
  mapContainerRef: RefObject<HTMLDivElement | null>;
  locationFetching: boolean;
};

export function MapPickerSection({
  mapSearchQuery,
  onSearch,
  onQueryChange,
  searchLoading,
  searchError,
  mapContainerRef,
  locationFetching,
}: MapPickerSectionProps) {
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-gray-600 mb-1">Selecciona en el mapa</div>
      <form onSubmit={onSearch} className="flex gap-2 mb-2">
        <input
          type="text"
          value={mapSearchQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Busca una dirección o ciudad"
          className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1B16]"
        />
        <button
          type="submit"
          disabled={searchLoading}
          className="px-3 py-2 text-sm rounded-md bg-[#1A1B16] text-white hover:bg-[#2A2B26] disabled:bg-gray-400"
        >
          {searchLoading ? "Buscando…" : "Buscar"}
        </button>
      </form>
      {searchError && <div className="text-xs text-red-600 mb-2">{searchError}</div>}
      <div ref={mapContainerRef} className="w-full h-72 rounded-lg border border-gray-200 overflow-hidden"></div>
      <p className="text-xs text-gray-600 mt-2">Haz clic en el mapa para elegir tu ubicación.</p>
      {locationFetching && <div className="text-xs text-gray-600 mt-1">Guardando ubicación…</div>}
    </div>
  );
}
