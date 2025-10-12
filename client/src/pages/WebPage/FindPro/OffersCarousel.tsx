import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
export type Offer = {
  id: number;
  title: string;
};
export default function OffersCarousel({ items }: { items: Offer[] }) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const current = items[index % count];
  return (
    <div className="rounded-xl border bg-white shadow-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-[#1A1B16]">Offers</h3>
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="h-7 w-7 inline-flex items-center justify-center rounded-full border hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="h-7 w-7 inline-flex items-center justify-center rounded-full border hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="aspect-video w-full rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-600">
        {current.title}
      </div>
    </div>
  );
}
