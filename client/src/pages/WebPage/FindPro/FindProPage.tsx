import { ShieldCheck, Search, Filter, MapPin, List, Star, DollarSign, Navigation, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';

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
  const [showFilters, setShowFilters] = useState(false); // Default to hiding filters (accordion closed)
  const [filters, setFilters] = useState({
    search: '',
    serviceType: '',
    location: '',
    profession: '',
    rating: '',
    distance: '',
    priceMin: '',
    priceMax: '',
    eliteOnly: false
  });
  
  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      serviceType: '',
      location: '',
      profession: '',
      rating: '',
      distance: '',
      priceMin: '',
      priceMax: '',
      eliteOnly: false
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Accordion Header - Always Visible */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Find Professional Contractors</h2>
              <p className="text-sm text-gray-600">Search and filter contractors in your area</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              showFilters 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {showFilters ? (
              <ChevronUp className="h-4 w-4 transition-transform duration-300" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Filter Content */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        showFilters ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search contractors, services, or locations..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleFilterChange('eliteOnly', !filters.eliteOnly)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.eliteOnly
                  ? 'bg-green-100 text-green-800 border border-green-300 shadow-md'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {filters.eliteOnly ? '✓ ' : ''}Elite Contractors Only
            </button>
            <button
              onClick={() => handleFilterChange('rating', filters.rating === '4.5' ? '' : '4.5')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.rating === '4.5'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-md'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {filters.rating === '4.5' ? '✓ ' : ''}4.5+ Rating
            </button>
            <button
              onClick={() => handleFilterChange('distance', filters.distance === '10' ? '' : '10')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.distance === '10'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-md'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {filters.distance === '10' ? '✓ ' : ''}Within 10 miles
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State or ZIP"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Profession/Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
              <select 
                value={filters.profession}
                onChange={(e) => handleFilterChange('profession', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Professions</option>
                <optgroup label="Construction & Building">
                  <option value="roofing">Roofing Contractors</option>
                  <option value="construction">General Construction</option>
                  <option value="remodeling">Home Remodeling</option>
                  <option value="handyman">Handyman Services</option>
                </optgroup>
                <optgroup label="Home Services">
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC & Heating</option>
                  <option value="painting">Painting</option>
                </optgroup>
                <optgroup label="Outdoor Services">
                  <option value="landscaping">Landscaping</option>
                  <option value="irrigation">Irrigation Systems</option>
                  <option value="tree-services">Tree Services</option>
                  <option value="lawn-care">Lawn Care</option>
                </optgroup>
                <optgroup label="Specialized Services">
                  <option value="gutters">Gutter Services</option>
                  <option value="water-heaters">Water Heaters</option>
                  <option value="drain-cleaning">Drain Cleaning</option>
                  <option value="flooring">Flooring</option>
                </optgroup>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select 
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Any Rating</option>
                <option value="4.8">4.8+ Stars (Excellent)</option>
                <option value="4.5">4.5+ Stars (Very Good)</option>
                <option value="4.0">4.0+ Stars (Good)</option>
                <option value="3.5">3.5+ Stars (Fair)</option>
                <option value="3.0">3.0+ Stars (Average)</option>
              </select>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <select 
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Any Distance</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="15">Within 15 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="100">Within 100 miles</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="w-32 pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <span className="text-gray-500 font-medium">to</span>
                <div className="flex items-center relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="w-32 pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Options</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.eliteOnly}
                    onChange={(e) => handleFilterChange('eliteOnly', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Elite contractors only ($250K guarantee)</span>
                </label>
              </div>
            </div>
          </div>

            {/* Filter Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium">
                Apply Filters ({CONTRACTORS.length} contractors)
              </button>
              <button 
                onClick={clearAllFilters}
                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Clear All Filters
              </button>
              <button className="flex-1 sm:flex-none px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium">
                Save Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const Breadcrumb: React.FC = () => (
  <div className="mb-8">
    {/* Header Section */}
  </div>
);

function MainMapView() {
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyContractors, setNearbyContractors] = useState<Contractor[]>([]);
  const [searchRadius, setSearchRadius] = useState(10); // miles
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationError(null);
          
          // Filter contractors by distance from user location
          const nearby = CONTRACTORS.filter(contractor => {
            const distance = calculateDistance(
              location.lat,
              location.lng,
              contractor.lat,
              contractor.lng
            );
            return distance <= searchRadius;
          }).sort((a, b) => {
            const distanceA = calculateDistance(location.lat, location.lng, a.lat, a.lng);
            const distanceB = calculateDistance(location.lat, location.lng, b.lat, b.lng);
            return distanceA - distanceB;
          });
          
          setNearbyContractors(nearby);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Showing default area.');
          // Default to Oklahoma City if location fails
          const defaultLocation = { lat: 35.4676, lng: -97.5164 };
          setUserLocation(defaultLocation);
          setNearbyContractors(CONTRACTORS);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
      const defaultLocation = { lat: 35.4676, lng: -97.5164 };
      setUserLocation(defaultLocation);
      setNearbyContractors(CONTRACTORS);
    }
  }, [searchRadius]);

  // Calculate distance between two points in miles
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const mapCenter = useMemo(() => 
    userLocation || { lat: 35.4676, lng: -97.5164 }
  , [userLocation]);

  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
      }
    ]
  }), []);

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Find Contractors Near You</h2>
                <p className="text-sm text-gray-600">Discovering professionals in your area</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[500px] bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <Navigation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Your Location</h3>
            <p className="text-gray-600">Finding contractors near you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
      {/* Map Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Navigation className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contractors Near You</h2>
              <p className="text-sm text-gray-600">
                {locationError ? locationError : `${nearbyContractors.length} contractors found within ${searchRadius} miles`}
              </p>
            </div>
          </div>
          
          {/* Search Radius Control */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Search radius:</label>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
              <div>
                <p className="text-xs text-gray-500">Nearby</p>
                <p className="font-bold text-blue-600">{nearbyContractors.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
              <div>
                <p className="text-xs text-gray-500">Elite</p>
                <p className="font-bold text-green-600">{nearbyContractors.filter(c => c.elite).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-yellow-100">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">Avg Rating</p>
                <p className="font-bold text-yellow-600">
                  {nearbyContractors.length > 0 
                    ? (nearbyContractors.reduce((acc, c) => acc + c.rating, 0) / nearbyContractors.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="font-bold text-purple-600">Now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative h-[500px]">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={userLocation ? 13 : 12}
          options={mapOptions}
          onLoad={() => {
            console.log('Main map loaded successfully');
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <>
              <Marker
                position={userLocation}
                options={{
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#EF4444',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 3,
                  },
                }}
                title="Your Location"
              />
              
              {/* Search radius circle */}
              <Circle
                center={userLocation}
                radius={searchRadius * 1609.34} // Convert miles to meters
                options={{
                  fillColor: '#3B82F6',
                  fillOpacity: 0.1,
                  strokeColor: '#3B82F6',
                  strokeOpacity: 0.3,
                  strokeWeight: 2,
                }}
              />
            </>
          )}

          {/* Contractor markers */}
          {nearbyContractors.map((contractor) => (
            <Marker
              key={contractor.id}
              position={{ lat: contractor.lat, lng: contractor.lng }}
              onClick={() => setSelectedContractor(contractor)}
              options={{
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: contractor.elite ? 12 : 10,
                  fillColor: contractor.elite ? '#10B981' : '#3B82F6',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                },
              }}
              title={contractor.name}
            />
          ))}

          {/* Info Window */}
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold mb-3">
                    <ShieldCheck className="h-4 w-4" /> Elite Contractor
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
                  }}
                >
                  Get Free Quote
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      
      {/* Map Footer */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Regular Contractors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Elite Contractors</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Interactive map showing contractors within your selected radius
          </p>
        </div>
      </div>
    </div>
  );
}


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
              Interactive Google Maps • Click pins for details • Zoom to explore
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
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb />
        
        <div className="mx-auto max-w-6xl">
          {/* Filter Bar with Accordion - Now at the top */}
          <FilterBar />

          {/* Main Map View - Shows filtered results */}
          <MainMapView />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">          
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
                Detailed Map
              </button>
            </div>
          </div>

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
