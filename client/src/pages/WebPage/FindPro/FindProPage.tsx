import { ShieldCheck, Search, Filter, MapPin, List, Star, DollarSign } from "lucide-react";
import { useState } from "react";
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

function FilterBar() {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search contractors, services, or locations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">All Services</option>
                <option value="roofing">Roofing</option>
                <option value="painting">Painting</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="handyman">Handyman</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Any Distance</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="Min"
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              Apply Filters
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MapView() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-96">
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
          <p className="text-gray-500">Interactive map will be displayed here</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Available Contractors</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Elite Contractors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchMeCard() {
  return (
    <div className="rounded-xl border border-primary bg-white shadow-sm p-4">
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
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <div className="mx-auto max-w-6xl px-4 my-12 lg:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
        <h1 className="text-black text-2xl font-semibold mb-4 sm:mb-0">
          Showing 5 Results for roofing contractor in Oklahoma City, OK
        </h1>
        
        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Map View
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main content */}
        <div className="lg:col-span-8">
          {viewMode === 'list' ? (
            /* List View */
            <div className="space-y-4">
              {CONTRACTORS.map((c) => (
                <ContractorCard key={c.id} contractor={c} />
              ))}
            </div>
          ) : (
            /* Map View */
            <MapView />
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <MatchMeCard />
          <OffersCarousel items={OFFERS} />
          
          {/* Results Summary (only in map view) */}
          {viewMode === 'map' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Contractors in Map</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {CONTRACTORS.map((contractor) => (
                  <div key={contractor.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{contractor.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{contractor.rating} ({contractor.reviews})</span>
                        <span className="text-xs text-gray-400">• {contractor.distanceMiles} mi</span>
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
  );
}
