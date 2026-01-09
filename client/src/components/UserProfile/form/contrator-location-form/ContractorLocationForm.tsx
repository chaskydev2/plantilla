import React, { useState, useEffect, useCallback } from "react";
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

const statusOptions = [
  { value: "pendiente", label: "Pendiente" },
  { value: "aprobado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "suspendido", label: "Suspendido" },
];


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
  const [error, setError] = useState<string | null>(null);
  const [fullInfo, setFullInfo] = useState<any>(null); // Store full API response for debug
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        setError('Error al obtener la información completa del contratista.');
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
          // Si falla, usar Cochabamba como fallback
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
          setError('No se pudo obtener la ubicación actual.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('La geolocalización no está soportada en este navegador.');
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
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });


  // Autocompletado manual usando la API REST de Google Places
  const [manualSearch, setManualSearch] = useState("");
  const [manualSuggestions, setManualSuggestions] = useState<any[]>([]);
  const [manualLoading, setManualLoading] = useState(false);

  const handleManualInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSearch(e.target.value);
    if (e.target.value.length < 3) {
      setManualSuggestions([]);
      return;
    }
    setManualLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          e.target.value
        )}&types=geocode&language=es&key=${apiKey}`
      );
      const data = await res.json();
      setManualSuggestions(data.predictions || []);
    } catch {
      setManualSuggestions([]);
    } finally {
      setManualLoading(false);
    }
  };

  const handleManualSelect = async (description: string, placeId: string) => {
    setManualSearch(description);
    setManualSuggestions([]);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}&language=es`
      );
      const data = await res.json();
      const location = data.result?.geometry?.location;
      const address_components = data.result?.address_components || [];
      // Extraer campos relevantes
      const getComponent = (type: string) => {
        const comp = address_components.find((c: any) => c.types.includes(type));
        return comp ? comp.long_name : "";
      };
      const getShortComponent = (type: string) => {
        const comp = address_components.find((c: any) => c.types.includes(type));
        return comp ? comp.short_name : "";
      };
      const address_line1 = getComponent("route")
        ? `${getComponent("street_number")} ${getComponent("route")}`.trim()
        : getComponent("route") || getComponent("street_address") || "";
      const city = getComponent("locality") || getComponent("sublocality") || getComponent("administrative_area_level_2") || "";
      const state_code = getShortComponent("administrative_area_level_1");
      const preferred_zip = getComponent("postal_code");
      const country_code = getShortComponent("country");

      if (location) {
        setMapPosition([location.lat, location.lng]);
        setForm((prev) => ({
          ...prev,
          lat: location.lat,
          lng: location.lng,
          address_line1,
          city,
          state_code,
          preferred_zip,
          country_code,
          address_components,
        }));
      }
    } catch {
      setError("No se pudo obtener la ubicación seleccionada.");
    }
  };

  // Map click handler
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMapPosition([lat, lng]);
      setForm((prev) => ({ ...prev, lat, lng }));
      fetchCountry(lat, lng).then((country_code) => setForm((prev) => ({ ...prev, country_code })));
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
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await updateAllFields(cleanedForm.user_id, cleanedForm);
      setSuccessMessage('¡Información guardada correctamente!');
      onSave(cleanedForm);
    } catch (err: any) {
      setError('Error al guardar los cambios.');
    } finally {
      setLoading(false);
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
    <Modal isOpen={open} onClose={onClose} title="Editar información de localización" size="lg">
      {loading && <div className="my-2 text-center text-gray-500">Cargando información...</div>}
      {error && <div className="alert alert-error my-2">{error}</div>}
      {successMessage && <div className="alert alert-success my-2">{successMessage}</div>}
      {/* Mostrar la info completa de la API para depuración */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
        <input type="hidden" name="user_id" value={form.user_id} />
        <label>
          Código Postal
          <input className="input input-bordered w-full" name="preferred_zip" value={form.preferred_zip || ""} onChange={handleChange} />
        </label>
        <label>
          Dirección 1
          <input className="input input-bordered w-full" name="address_line1" value={form.address_line1 || ""} onChange={handleChange} />
        </label>
        <label>
          Dirección 2
          <input className="input input-bordered w-full" name="address_line2" value={form.address_line2 || ""} onChange={handleChange} />
        </label>
        <label>
          Ciudad
          <input className="input input-bordered w-full" name="city" value={form.city || ""} onChange={handleChange} />
        </label>
        <label>
          Empresa
          <input className="input input-bordered w-full" name="company_name" value={form.company_name || ""} onChange={handleChange} />
        </label>
        <label>
          Licencia
          <input className="input input-bordered w-full" name="license_number" value={form.license_number || ""} onChange={handleChange} />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_insured" checked={!!form.is_insured} onChange={handleChange} />
          ¿Asegurado?
        </label>
        <label>
          Área de servicio
          <input className="input input-bordered w-full" name="service_area" value={form.service_area || ""} onChange={handleChange} />
        </label>
        <label>
          Rating promedio
          <input className="input input-bordered w-full" name="average_rating" type="number" step="0.01" value={form.average_rating ?? ""} onChange={handleChange} />
        </label>
        <label>
          Estado
          <input className="input input-bordered w-full" name="state_code" value={form.state_code || ""} onChange={handleChange} />
        </label>
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">Ubicación en el mapa</label>
          <button type="button" className="btn btn-sm btn-secondary mb-2" onClick={handleUseCurrentLocation}>
            Usar mi ubicación actual
          </button>

          {/* Buscador de direcciones alternativo */}
          <div className="mb-2" style={{ position: "relative" }}>
            <input
              className="input input-bordered w-full"
              placeholder="Buscar dirección o lugar..."
              value={manualSearch}
              onChange={handleManualInput}
            />
            {manualLoading && <div className="text-xs text-gray-400">Buscando...</div>}
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
              Error al cargar Google Maps. Verifica tu conexión o la API Key.
            </div>
          )}
          {!loadError && !isLoaded && (
            <div className="my-2 text-center text-gray-500">Cargando mapa...</div>
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
              Debes configurar la variable de entorno <b>VITE_GOOGLE_MAPS_API_KEY</b> para ver el mapa.
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
              <span className="font-medium">País:</span> {form.country_code ?? ""}
            </div>
          </div>
          <small className="text-gray-500 block mt-1">Haz click en el mapa o busca una dirección para seleccionar la ubicación.</small>
        </div>
        <label>
          Teléfono móvil
          <input className="input input-bordered w-full" name="mobile_number" value={form.mobile_number || ""} onChange={handleChange} />
        </label>
        <label>
          Teléfono fijo
          <input className="input input-bordered w-full" name="phone_number" value={form.phone_number || ""} onChange={handleChange} />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="has_driving_license" checked={!!form.has_driving_license} onChange={handleChange} />
          ¿Tiene licencia de conducir?
        </label>
        <label>
          Categoría de licencia
          <input className="input input-bordered w-full" name="driving_license_category" value={form.driving_license_category || ""} onChange={handleChange} />
        </label>
        <label>
          LinkedIn
          <input className="input input-bordered w-full" name="linkedin_url" value={form.linkedin_url || ""} onChange={handleChange} />
        </label>
        <label>
          Portafolio
          <input className="input input-bordered w-full" name="portfolio_url" value={form.portfolio_url || ""} onChange={handleChange} />
        </label>
        <label>
          Fecha de afiliación
          <input className="input input-bordered w-full" name="affiliation_date" type="date" value={form.affiliation_date || ""} onChange={handleChange} />
        </label>
        <label>
          Fecha de aprobación
          <input className="input input-bordered w-full" name="approval_date" type="date" value={form.approval_date || ""} onChange={handleChange} />
        </label>
        <label>
          Estado del contrato
          <select className="input input-bordered w-full" name="contract_status" value={form.contract_status || ""} onChange={handleChange}>
            <option value="">Seleccionar</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ContractorLocationForm;
