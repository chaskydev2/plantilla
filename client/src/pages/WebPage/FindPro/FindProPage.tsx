import { ShieldCheck, Search, Filter, MapPin, List, Star, DollarSign } from "lucide-react";
import { useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

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
    // Coordenadas reales para Oklahoma City
    lat: 35.4676,
    lng: -97.5164,
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
    // Coordenadas ligeramente diferentes para mostrar múltiples puntos
    lat: 35.4826,
    lng: -97.5345,
    quote: {
      author: "Elaine Hobson",
      text: "I was lucky enough to work with Jason twice! He put a hail-resistant roof and was amazing to work with...",
    },
  },
  {
    id: 3,
    name: "Oklahoma Home Builders",
    rating: 4.7,
    reviews: 89,
    elite: false,
    projectsRegistered: 5,
    services: ["Construction", "Remodeling", "Electrical"],
    extraServicesCount: 3,
    distanceMiles: 8,
    locationLabel: "Edmond, OK, 73013",
    lat: 35.6528,
    lng: -97.4781,
    quote: {
      author: "Sarah Johnson",
      text: "Professional service and quality work. Highly recommend for home renovation projects...",
    },
  },
  {
    id: 4,
    name: "Premier Plumbing Solutions",
    rating: 4.8,
    reviews: 67,
    elite: true,
    projectsRegistered: 2,
    services: ["Plumbing", "Water Heaters", "Drain Cleaning"],
    extraServicesCount: 4,
    distanceMiles: 12,
    locationLabel: "Norman, OK, 73019",
    lat: 35.2226,
    lng: -97.4395,
    quote: {
      author: "Mike Davis",
      text: "Quick response time and fair pricing. Fixed our plumbing emergency same day...",
    },
  },
  {
    id: 5,
    name: "Elite Landscaping & Irrigation",
    rating: 4.6,
    reviews: 124,
    elite: false,
    projectsRegistered: 7,
    services: ["Landscaping", "Irrigation", "Tree Services"],
    extraServicesCount: 2,
    distanceMiles: 6,
    locationLabel: "Moore, OK, 73160",
    lat: 35.3395,
    lng: -97.4867,
    quote: {
      author: "Lisa Thompson",
      text: "Transformed our backyard into a beautiful outdoor space. Excellent attention to detail...",
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search contractors, services, or locations..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5D238] focus:border-transparent transition-all duration-200"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            showFilters 
              ? 'bg-[#F5D238] text-[#1A1B16] shadow-md' 
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5D238] focus:border-transparent transition-all duration-200">
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
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5D238] focus:border-transparent transition-all duration-200">
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
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5D238] focus:border-transparent transition-all duration-200">
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
              <div className="flex items-center relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="Min"
                  className="w-32 pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5D238] focus:border-transparent transition-all duration-200"
                />
              </div>
              <span className="text-gray-500 font-medium">to</span>
              <div className="flex items-center relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-32 pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5D238] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-6 flex gap-3">
            <button className="px-6 py-3 bg-[#1A1B16] text-white rounded-lg hover:bg-black transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium">
              Apply Filters
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


const Breadcrumb: React.FC = () => (
  <div className="mb-8">
    {/* Header Section */}
  </div>
);


function MapView() {
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const mapCenter = useMemo(() => ({
    lat: 35.4676, // Centro de Oklahoma City
    lng: -97.5164
  }), []);

  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  }), []);

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Enhanced Map Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-yellow-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Interactive Contractor Map</h3>
                <p className="text-sm text-gray-600">Discover professionals in Oklahoma City area</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                <div>
                  <p className="text-xs text-gray-500">Available</p>
                  <p className="font-bold text-blue-600">{CONTRACTORS.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm border border-yellow-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                <div>
                  <p className="text-xs text-gray-500">Elite $250K</p>
                  <p className="font-bold text-yellow-600">{CONTRACTORS.filter(c => c.elite).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                  <p className="font-bold text-green-600">{(CONTRACTORS.reduce((acc, c) => acc + c.rating, 0) / CONTRACTORS.length).toFixed(1)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="font-bold text-purple-600">24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Loading State */}
        <div className="h-[600px] bg-gradient-to-br from-blue-50 via-gray-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <MapPin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Interactive Map</h3>
            <p className="text-gray-600">Preparing contractor locations...</p>
          </div>
        </div>
        
        {/* Enhanced Map Footer */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Regular Contractors</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Elite $250K Guaranteed</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Interactive Google Maps • 📍 Click pins for details • 🔍 Zoom to explore
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Enhanced Map Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-yellow-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Interactive Contractor Map</h3>
              <p className="text-sm text-gray-600">Discover professionals in Oklahoma City area</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="font-bold text-blue-600">{CONTRACTORS.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-yellow-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
              <div>
                <p className="text-xs text-gray-500">Elite $250K</p>
                <p className="font-bold text-yellow-600">{CONTRACTORS.filter(c => c.elite).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Avg Rating</p>
                <p className="font-bold text-green-600">{(CONTRACTORS.reduce((acc, c) => acc + c.rating, 0) / CONTRACTORS.length).toFixed(1)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="font-bold text-purple-600">24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Google Map Container */}
      <div className="relative h-[600px]">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={12}
          options={mapOptions}
          onLoad={() => {
            console.log('Google Map loaded successfully');
          }}
        >
          {CONTRACTORS.map((contractor) => (
            <Marker
              key={contractor.id}
              position={{ lat: contractor.lat, lng: contractor.lng }}
              onClick={() => setSelectedContractor(contractor)}
              options={{
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: contractor.elite ? 14 : 12,
                  fillColor: contractor.elite ? '#F59E0B' : '#3B82F6', // Amarillo para elite, azul para regular
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 3,
                },
              }}
            />
          ))}

          {selectedContractor && (
            <InfoWindow
              position={{ lat: selectedContractor.lat, lng: selectedContractor.lng }}
              onCloseClick={() => setSelectedContractor(null)}
              options={{
                pixelOffset: new google.maps.Size(0, -10),
              }}
            >
              <div className="p-4 max-w-sm">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {selectedContractor.name}
                </h3>
                {selectedContractor.elite && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-semibold mb-3">
                    <ShieldCheck className="h-4 w-4" /> $250K Elite Guarantee
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(selectedContractor.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedContractor.rating.toFixed(1)} ({selectedContractor.reviews} reviews)
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">Services:</p>
                  <p className="text-sm text-gray-600">
                    {selectedContractor.services.join(", ")}
                    {selectedContractor.extraServicesCount && 
                      ` and ${selectedContractor.extraServicesCount} more`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{selectedContractor.distanceMiles} miles away</span>
                </div>
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md"
                  onClick={() => {
                    console.log('Get quote for:', selectedContractor.name);
                    // Aquí puedes agregar la lógica para obtener una cotización
                  }}
                >
                  Get Free Quote
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      
      {/* Enhanced Map Footer */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Regular Contractors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Elite $250K Guaranteed</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            🗺️ Interactive Google Maps • 📍 Click pins for details • 🔍 Zoom to explore
          </p>
        </div>
      </div>
    </div>
  );
}

function MatchMeCard() {
  return (
    <div className="rounded-lg border border-[#F5D238] bg-white shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-lg bg-[#F5D238]/10 border border-[#F5D238]/20 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-[#F5D238]" />
        </div>
        <div className="font-bold text-[#1A1B16] text-lg leading-tight">Want us to match you with a contractor with $250K Guarantee?</div>
      </div>
      <p className="text-sm text-gray-600 mb-4">Provide your project details and we will find the best fit for your needs.</p>
      <button className="w-full rounded-lg bg-[#1A1B16] hover:bg-black text-white font-semibold py-3 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
        Find me a pro
      </button>
      <p className="mt-3 text-xs text-gray-500 text-center">
        * Full Coverage Guarantee is only provided by GU Elite contractors
      </p>
    </div>
  );
}

export default function FindProPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb />
        
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">          
            {/* View Toggle */}
            <div className="flex items-center bg-gray-50 rounded-lg p-1 shadow-inner">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-[#1A1B16] shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-[#1A1B16] hover:bg-white/50'
                }`}
              >
                <List className="h-4 w-4" />
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'map'
                    ? 'bg-white text-[#1A1B16] shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-[#1A1B16] hover:bg-white/50'
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-[#1A1B16] mb-4 text-lg">Contractors in Map</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {CONTRACTORS.map((contractor) => (
                      <div key={contractor.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-[#F5D238]/30">
                        <div className="w-3 h-3 bg-[#F5D238] rounded-full shadow-sm"></div>
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
      </div>
    </div>
  );
}
