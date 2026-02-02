import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { getFullInfo, updateAllFields } from '@/core/services/contractor/contractor.service';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// Para Autocomplete
import Modal from "@/components/modal/Modal";

// Puedes ajustar los tipos según tu backend
export interface ContractorLocationFormData {
  user_id: number;
  preferred_zip?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  company_name?: string;
  license_number?: string;
  is_insured?: boolean;
  service_area?: string;
  average_rating?: number;
  state_code?: string;
  country_code?: string;
  lat?: number;
  lng?: number;
  mobile_number?: string;
  phone_number?: string;
  has_driving_license?: boolean;
  driving_license_category?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  affiliation_date?: string;
  approval_date?: string;
  contract_status?: string;
  address_components?: any[];
}

interface ContractorLocationFormProps {
  open: boolean;
  onClose: () => void;
  initialData: ContractorLocationFormData;
  onSave: (data: ContractorLocationFormData) => void;
}

// Removed unused statusOptions variable to fix TS6133 error


// Helper to format ISO date to yyyy-mm-dd
const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

// Helper to normalize initial data for the form
const normalizeInitialData = (data: ContractorLocationFormData): ContractorLocationFormData => ({
  ...data,
  preferred_zip: data.preferred_zip ?? "",
  address_line1: data.address_line1 ?? "",
  address_line2: data.address_line2 ?? "",
  city: data.city ?? "",
  company_name: data.company_name ?? "",
  license_number: data.license_number ?? "",
  is_insured: !!data.is_insured,
  service_area: data.service_area ?? "",
  average_rating: typeof data.average_rating === "string" ? Number(data.average_rating) : (data.average_rating ?? 0),
  state_code: data.state_code ?? "",
  country_code: data.country_code ?? "",
  lat: data.lat ?? undefined,
  lng: data.lng ?? undefined,
  mobile_number: data.mobile_number ?? "",
  phone_number: data.phone_number ?? "",
  has_driving_license: !!data.has_driving_license,
  driving_license_category: data.driving_license_category ?? "",
  linkedin_url: data.linkedin_url ?? "",
  portfolio_url: data.portfolio_url ?? "",
  affiliation_date: formatDate(data.affiliation_date),
  approval_date: formatDate(data.approval_date),
  contract_status: data.contract_status ?? "",
  address_components: data.address_components ?? [],
});

const ContractorLocationForm: React.FC<ContractorLocationFormProps> = ({ open, onClose, initialData, onSave }) => {
  const [form, setForm] = useState<ContractorLocationFormData>(normalizeInitialData(initialData));
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    initialData.lat ?? 19.4326, // Default: CDMX
    initialData.lng ?? -99.1332
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // Nuevo estado para guardar
  const [error, setError] = useState<string | null>(null);
  const [fullInfo, setFullInfo] = useState<any>(null); // Store full API response for debug
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  // Limpia los campos autocompletados
  const handleClearAutoFilled = () => {
    setAutoFilledFields(new Set());
  };

  // Fetch full contractor info when modal opens
  useEffect(() => {
    const fetchFullInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        fullInfo;
        const res = await getFullInfo(initialData.user_id);
        console.log("Full contractor info:", res);
        if (res && res.data) {
          setFullInfo(res.data); // Save all info for debug
          setForm(normalizeInitialData(res.data));
          if (res.data.lat && res.data.lng) {
            setMapPosition([res.data.lat, res.data.lng]);
          }
        }
      } catch (err: any) {
        setError('Error fetching full contractor information.');
      } finally {
        setLoading(false);
      }
    };
    if (open && initialData.user_id) {
      fetchFullInfo();
    }
  }, [open, initialData.user_id]);

  // Siempre intenta obtener la ubicación exacta al abrir el modal
  useEffect(() => {
    if (open && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapPosition([latitude, longitude]);
          setForm((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        },
        () => {
          // If fails, use Cochabamba as fallback
          const cochabambaLat = -17.3895;
          const cochabambaLng = -66.1568;
          setMapPosition([cochabambaLat, cochabambaLng]);
          setForm((prev) => ({ ...prev, lat: cochabambaLat, lng: cochabambaLng }));
        },
        { enableHighAccuracy: true }
      );
    }
  }, [open]);

  // Botón para usar la ubicación actual manualmente
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapPosition([latitude, longitude]);
          setForm((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        },
        () => {
          setError('Could not get current location.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported in this browser.');
    }
  };

  // Helper to get country from lat/lng (Google Maps Geocoding API)
  // Fetch all address info from Google Maps Geocoding API
  const fetchCountry = async (lat: number, lng: number) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return "";
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
      const data = await res.json();
      const address_components = data.results?.[0]?.address_components || [];
      const countryComp = address_components.find((c: any) => c.types.includes("country"));
      setForm((prev) => ({ ...prev, address_components }));
      return countryComp?.short_name || "";
    } catch {
      setForm((prev) => ({ ...prev, address_components: [] }));
      return "";
    }
  };


  // Google Maps API key from Vite env
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
    language: 'en',
    region: 'US',
  });


  // Autocompletado usando Google Places Autocomplete Service
  const [manualSearch, setManualSearch] = useState("");
  const [manualSuggestions, setManualSuggestions] = useState<any[]>([]);
  const [manualLoading, setManualLoading] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  // Initialize Google Places services when maps is loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      setAutocompleteService(new google.maps.places.AutocompleteService());
      // Create a dummy div for PlacesService
      const dummyDiv = document.createElement('div');
      setPlacesService(new google.maps.places.PlacesService(dummyDiv));
    }
  }, [isLoaded]);

  const handleManualInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSearch(e.target.value);
    if (e.target.value.length < 3) {
      setManualSuggestions([]);
      return;
    }
    if (!autocompleteService) {
      return;
    }
    setManualLoading(true);
    try {
      autocompleteService.getPlacePredictions(
        {
          input: e.target.value,
          types: ['geocode', 'establishment'],
          language: 'en'
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setManualSuggestions(predictions);
          } else {
            setManualSuggestions([]);
          }
          setManualLoading(false);
        }
      );
    } catch {
      setManualSuggestions([]);
      setManualLoading(false);
    }
  };

  const handleManualSelect = async (description: string, placeId: string) => {
    setManualSearch(description);
    setManualSuggestions([]);
    
    if (!placesService) {
      setError("Places service not available");
      return;
    }

    try {
      placesService.getDetails(
        {
          placeId: placeId,
          fields: ['geometry', 'address_components', 'formatted_address']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const location = place.geometry?.location;
            const address_components = place.address_components || [];
            
            // Extraer campos relevantes
            const getComponent = (type: string) => {
              const comp = address_components.find((c: any) => c.types.includes(type));
              return comp ? comp.long_name : "";
            };
            const getShortComponent = (type: string) => {
              const comp = address_components.find((c: any) => c.types.includes(type));
              return comp ? comp.short_name : "";
            };
            
            const streetNumber = getComponent("street_number");
            const route = getComponent("route");
            const address_line1 = streetNumber && route 
              ? `${streetNumber} ${route}`.trim()
              : route || getComponent("street_address") || "";
            const city = getComponent("locality") || getComponent("sublocality") || getComponent("administrative_area_level_2") || "";
            const state_code = getShortComponent("administrative_area_level_1");
            const preferred_zip = getComponent("postal_code");
            const country_code = getShortComponent("country");

            if (location) {
              const lat = location.lat();
              const lng = location.lng();
              setMapPosition([lat, lng]);
              setForm((prev) => ({
                ...prev,
                lat,
                lng,
                address_line1,
                city,
                state_code,
                preferred_zip,
                country_code,
                address_components,
              }));
            }
          } else {
            setError("Could not get the selected location.");
          }
        }
      );
    } catch (err) {
      console.error("Error al obtener detalles del lugar:", err);
      setError("Could not get the selected location.");
    }
  };

  // Map click handler - actualiza todos los campos desde la geocodificación inversa
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMapPosition([lat, lng]);
      
      // Use Geocoder to get full address from coordinates
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address_components = results[0].address_components || [];
          
          const getComponent = (type: string) => {
            const comp = address_components.find((c: any) => c.types.includes(type));
            return comp ? comp.long_name : "";
          };
          const getShortComponent = (type: string) => {
            const comp = address_components.find((c: any) => c.types.includes(type));
            return comp ? comp.short_name : "";
          };
          
          const streetNumber = getComponent("street_number");
          const route = getComponent("route");
          const address_line1 = streetNumber && route 
            ? `${streetNumber} ${route}`.trim()
            : route || "";
          const city = getComponent("locality") || getComponent("sublocality") || getComponent("administrative_area_level_2") || "";
          const state_code = getShortComponent("administrative_area_level_1");
          const preferred_zip = getComponent("postal_code");
          const country_code = getShortComponent("country");
          
          setManualSearch(results[0].formatted_address);
          setForm((prev) => ({
            ...prev,
            lat,
            lng,
            address_line1,
            city,
            state_code,
            preferred_zip,
            country_code,
            address_components,
          }));
          
          // Mark address fields as auto-filled (read-only)
          const fieldsToLock = ['address_line1', 'city', 'state_code', 'preferred_zip', 'country_code'];
          setAutoFilledFields(new Set(fieldsToLock));
        } else {
          // If geocoding fails, just update coordinates
          setForm((prev) => ({ ...prev, lat, lng }));
          fetchCountry(lat, lng).then((country_code) => setForm((prev) => ({ ...prev, country_code })));
          setAutoFilledFields(new Set());
        }
      });
    }
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    }
    if (name === "average_rating") {
      setForm((prev) => ({ ...prev, [name]: value === "" ? undefined : Number(value) }));
    } else if (name === "affiliation_date" || name === "approval_date") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: newValue }));
    }
    // Remove from auto-filled set when user manually edits
    if (autoFilledFields.has(name)) {
      setAutoFilledFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(name);
        return newSet;
      });
    }
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    // Clean up form before save: convert empty strings to undefined for optional fields
    const cleanedForm = { ...form };
    Object.keys(cleanedForm).forEach((key) => {
      if ((cleanedForm as any)[key] === "") {
        (cleanedForm as any)[key] = undefined;
      }
      // Ensure average_rating is a number or undefined
      if (key === "average_rating" && typeof cleanedForm[key] !== "number") {
        cleanedForm[key] = cleanedForm[key] === undefined ? undefined : Number(cleanedForm[key]);
      }
    });
    try {
      await updateAllFields(form.user_id, cleanedForm);
      setSuccessMessage('Information saved successfully!');
      onSave(cleanedForm);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Error al guardar:", err);
      setError(err.response?.data?.message || 'Error saving changes.');
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };
  // Update form state if initialData changes
  useEffect(() => {
    setForm(normalizeInitialData(initialData));
    setMapPosition([
      initialData.lat ?? 19.4326,
      initialData.lng ?? -99.1332
    ]);
  }, [initialData]);

  // Ensure map always receives valid numbers
  const safeLat = typeof mapPosition[0] === 'number' && !isNaN(mapPosition[0]) ? mapPosition[0] : 19.4326;
  const safeLng = typeof mapPosition[1] === 'number' && !isNaN(mapPosition[1]) ? mapPosition[1] : -99.1332;

  return (
    <Modal isOpen={open} onClose={onClose} title="Edit Location Information" size="lg">
      {loading && !saving && <div className="my-2 text-center text-gray-500">Loading information...</div>}
      {/* Mensaje modal centrado al guardar */}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col items-center">
            <span className="text-blue-600 text-lg font-semibold mb-2 animate-pulse">Saving information...</span>
            <span className="text-gray-500 text-sm">Please wait while your data is being saved.</span>
          </div>
        </div>
      )}
      {error && <div className="alert alert-error my-2">{error}</div>}
      {successMessage && <div className="alert alert-success my-2">{successMessage}</div>}
      {/* Show full API info for debugging */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
        <input type="hidden" name="user_id" value={form.user_id} />
        {/* Mejoras visuales para campos autocompletados */}
        <label className="relative">
          Zip Code
          <div className="relative">
            <input
              className={`input input-bordered w-full ${autoFilledFields.has('preferred_zip') ? 'bg-blue-50 border-blue-400 pr-8' : ''}`}
              name="preferred_zip"
              value={form.preferred_zip || ""}
              onChange={handleChange}
              disabled={autoFilledFields.has('preferred_zip')}
              title={autoFilledFields.has('preferred_zip') ? 'Auto-filled from map. Click the map again to change.' : ''}
            />
            {autoFilledFields.has('preferred_zip') && (
              <span className="absolute right-2 top-2 text-blue-500" title="Autocompletado desde el mapa">
                <AiOutlineInfoCircle />
              </span>
            )}
          </div>
        </label>
        <label className="relative">
          Address 1
          <div className="relative">
            <input
              className={`input input-bordered w-full ${autoFilledFields.has('address_line1') ? 'bg-blue-50 border-blue-400 pr-8' : ''}`}
              name="address_line1"
              value={form.address_line1 || ""}
              onChange={handleChange}
              disabled={autoFilledFields.has('address_line1')}
              title={autoFilledFields.has('address_line1') ? 'Auto-filled from map. Click the map again to change.' : ''}
            />
            {autoFilledFields.has('address_line1') && (
              <span className="absolute right-2 top-2 text-blue-500" title="Autocompletado desde el mapa">
                <AiOutlineInfoCircle />
              </span>
            )}
          </div>
        </label>
        <label>
          Address 2
          <input className="input input-bordered w-full" name="address_line2" value={form.address_line2 || ""} onChange={handleChange} />
        </label>
        <label className="relative">
          City
          <div className="relative">
            <input
              className={`input input-bordered w-full ${autoFilledFields.has('city') ? 'bg-blue-50 border-blue-400 pr-8' : ''}`}
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              disabled={autoFilledFields.has('city')}
              title={autoFilledFields.has('city') ? 'Auto-filled from map. Click the map again to change.' : ''}
            />
            {autoFilledFields.has('city') && (
              <span className="absolute right-2 top-2 text-blue-500" title="Autocompletado desde el mapa">
                <AiOutlineInfoCircle />
              </span>
            )}
          </div>
        </label>
        <label>
          Company
          <input className="input input-bordered w-full" name="company_name" value={form.company_name || ""} onChange={handleChange} />
        </label>
        <label>
          License
          <input className="input input-bordered w-full" name="license_number" value={form.license_number || ""} onChange={handleChange} />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_insured" checked={!!form.is_insured} onChange={handleChange} />
          Insured?
        </label>
        <label>
          Service Area
          <input className="input input-bordered w-full" name="service_area" value={form.service_area || ""} onChange={handleChange} />
        </label>
        <label>
          Average Rating
          <input className="input input-bordered w-full" name="average_rating" type="number" step="0.01" value={form.average_rating ?? ""} onChange={handleChange} />
        </label>
        <label className="relative">
          State
          <div className="relative">
            <input
              className={`input input-bordered w-full ${autoFilledFields.has('state_code') ? 'bg-blue-50 border-blue-400 pr-8' : ''}`}
              name="state_code"
              value={form.state_code || ""}
              onChange={handleChange}
              disabled={autoFilledFields.has('state_code')}
              title={autoFilledFields.has('state_code') ? 'Auto-filled from map. Click the map again to change.' : ''}
            />
            {autoFilledFields.has('state_code') && (
              <span className="absolute right-2 top-2 text-blue-500" title="Autocompletado desde el mapa">
                <AiOutlineInfoCircle />
              </span>
            )}
          </div>
        </label>
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">Location on map</label>
          <button type="button" className="btn btn-sm btn-secondary mb-2" onClick={handleUseCurrentLocation}>
            Use my current location
          </button>

          {/* Alternative address search */}
          <div className="mb-2" style={{ position: "relative" }}>
            <input
              className="input input-bordered w-full"
              placeholder="Search address or place..."
              value={manualSearch}
              onChange={handleManualInput}
            />
            {manualLoading && <div className="text-xs text-gray-400">Searching...</div>}
            {manualSuggestions.length > 0 && (
              <ul className="bg-white border rounded shadow max-h-48 overflow-y-auto absolute z-50 w-full">
                {manualSuggestions.map((sug) => (
                  <li
                    key={sug.place_id}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleManualSelect(sug.description, sug.place_id)}
                  >
                    {sug.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {loadError && (
            <div className="alert alert-error my-2">
              Error loading Google Maps. Check your connection or API Key.
            </div>
          )}
          {!loadError && !isLoaded && (
            <div className="my-2 text-center text-gray-500">Loading map...</div>
          )}
          {GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "TU_API_KEY_AQUI" && isLoaded && !loadError && (
            <GoogleMap
              center={{ lat: safeLat, lng: safeLng }}
              zoom={13}
              mapContainerStyle={{ height: 300, width: "100%" }}
              onClick={handleMapClick}
            >
              <Marker position={{ lat: safeLat, lng: safeLng }} />
            </GoogleMap>
          )}
          {(!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "TU_API_KEY_AQUI") && (
            <div className="alert alert-warning my-2">
              You must set the <b>VITE_GOOGLE_MAPS_API_KEY</b> environment variable to view the map.
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-4">
            <div>
              <span className="font-medium">Lat:</span> {form.lat ?? ""}
            </div>
            <div>
              <span className="font-medium">Lng:</span> {form.lng ?? ""}
            </div>
            <div>
              <span className="font-medium">Country:</span> {form.country_code ?? ""}
            </div>
          </div>
          {autoFilledFields.size > 0 && (
            <div className="alert alert-info my-2 flex items-center gap-2">
              <span>Address fields were auto-filled from the map and cannot be edited. Click the map again to actualizar o </span>
              <button
                type="button"
                className="btn btn-xs btn-outline btn-info ml-2"
                onClick={handleClearAutoFilled}
                title="Desbloquear campos autocompletados"
              >
                Limpiar autocompletado
              </button>
            </div>
          )}
          <small className="text-gray-500 block mt-1">Click on the map or search for an address to select the location.</small>
        </div>
        {/* Removed section: mobile phone, landline phone, driving license, license category, LinkedIn, portfolio, affiliation date, approval date, contract status */}
        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default ContractorLocationForm;
