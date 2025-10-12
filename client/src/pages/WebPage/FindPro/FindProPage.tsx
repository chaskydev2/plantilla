import { ShieldCheck } from "lucide-react";
import type { Contractor } from "./ContractorCard";
import type { Offer } from "./OffersCarousel";
import ContractorCard from "./ContractorCard";
import OffersCarousel from "./OffersCarousel";

const CONTRACTORS: Contractor[] = [
  {
    id: 1,
    name: "Icon Roofing and Construction",
    rating: 4.9,
    reviews: 140,
    elite: true,
    projectsRegistered: 3,
    services: ["Roofing", "Painting", "Gutters"],
    extraServicesCount: 6,
    distanceMiles: 17,
    locationLabel: "Oklahoma City, OK, 73131",
    quote: {
      author: "John Sowers",
      text: "I was at my wits end with roofing companies, but I'm glad I heard Dillon out when he knocked on my door. Dillon was prof...",
    },
  },
  {
    id: 2,
    name: "Luxor Roof & Home",
    rating: 5,
    reviews: 41,
    elite: true,
    projectsRegistered: 1,
    services: ["Roofing", "Handyman", "Gutters"],
    extraServicesCount: 1,
    distanceMiles: 4,
    locationLabel: "Oklahoma City, OK, 73131",
    quote: {
      author: "Elaine Hobson",
      text: "I was lucky enough to work with Jason twice! He put a hail-resistant roof and was amazing to work with...",
    },
  },
];

const OFFERS: Offer[] = [
  { id: 1, title: "10% off roof inspection" },
  { id: 2, title: "Seasonal gutter cleaning" },
  { id: 3, title: "Free skylight check" },
];

function MatchMeCard() {
  return (
    <div className=" rounded-xl border border-primary bg-white shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md border border-gray-200 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div className="font-semibold text-[#1A1B16]">Want us to match you with a contractor with $250K Guarantee?</div>
      </div>
      <p className="text-sm text-gray-600 mt-2">Provide your project details and we will find the best fit.</p>
      <button className="mt-3 w-full rounded-md bg-primary hover:bg-primary text-white font-semibold py-2">
        Find me a pro
      </button>
      <p className="mt-2 text-[11px] text-gray-500">
        * Full Coverage Guarantee is only provided by GU Elite contractors
      </p>
    </div>
  );
}

export default function FindProPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 my-12 lg:py-8">
      <h1 className="text-black text-2xl py-6 font-semibold">
        Showing 5 Results for roofing contractor in Oklahoma City, OK
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main list */}
        <div className="lg:col-span-8 space-y-4">
          {CONTRACTORS.map((c) => (
            <ContractorCard key={c.id} contractor={c} />
          ))}
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <MatchMeCard />
          <OffersCarousel items={OFFERS} />
        </div>
      </div>
    </div>
  );
}
