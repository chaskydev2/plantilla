import { useState } from "react";
import { Search, Filter, MapPin, DollarSign, ChevronDown, ChevronUp } from "lucide-react";

interface FilterBarProps {
  contractorsCount: number;
}

const initialFilters = {
  search: "",
  serviceType: "",
  location: "",
  profession: "",
  rating: "",
  distance: "",
  priceMin: "",
  priceMax: "",
  eliteOnly: false,
};

export default function FilterBar({ contractorsCount }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
              showFilters ? "bg-blue-500 text-white shadow-md" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            {showFilters ? <ChevronUp className="h-4 w-4 transition-transform duration-300" /> : <ChevronDown className="h-4 w-4 transition-transform duration-300" />}
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showFilters ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search contractors, services, or locations..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
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

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleFilterChange("eliteOnly", !filters.eliteOnly)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.eliteOnly
                  ? "bg-green-100 text-green-800 border border-green-300 shadow-md"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {filters.eliteOnly ? "✓ " : ""}Elite Contractors Only
            </button>
            <button
              onClick={() => handleFilterChange("rating", filters.rating === "4.5" ? "" : "4.5")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.rating === "4.5"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-md"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {filters.rating === "4.5" ? "✓ " : ""}4.5+ Rating
            </button>
            <button
              onClick={() => handleFilterChange("distance", filters.distance === "10" ? "" : "10")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.distance === "10"
                  ? "bg-blue-100 text-blue-800 border border-blue-300 shadow-md"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {filters.distance === "10" ? "✓ " : ""}Within 10 miles
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, State or ZIP"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                <select
                  value={filters.profession}
                  onChange={(e) => handleFilterChange("profession", e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                <select
                  value={filters.distance}
                  onChange={(e) => handleFilterChange("distance", e.target.value)}
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
                      onChange={(e) => handleFilterChange("priceMin", e.target.value)}
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
                      onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      className="w-32 pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Options</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.eliteOnly}
                      onChange={(e) => handleFilterChange("eliteOnly", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Elite contractors only ($250K guarantee)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium">
                Apply Filters ({contractorsCount} contractors)
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
