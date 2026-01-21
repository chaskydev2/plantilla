import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormContext } from 'react-hook-form';

import { InputField, InputFileField, SelectField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { JobPost } from './Main';
import { createJobPost, updateJobPost } from '@/core/services/jobPost.service';
// Toast styles (if not already imported elsewhere)
import 'react-toastify/dist/ReactToastify.css';

/* =========================
   Yup Schema
========================= */
const jobPostSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().min(0).required('Price is required'),
  service_id: Yup.number().nullable(),
  deadline: Yup.string().nullable(),
  currency: Yup.string().nullable(),
  status: Yup.string().oneOf(['open', 'closed']).required('Status is required'),
  address_line1: Yup.string().nullable(),
  address_line2: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state_code: Yup.string().nullable(),
  postal_code: Yup.string().nullable(),
  lat: Yup.number().nullable(),
  lng: Yup.number().nullable(),
  image: Yup.mixed().nullable(),
});



/* =========================
   GoogleMapPicker con búsqueda en tiempo real
========================= */
function GoogleMapPicker() {
  const { setValue, watch } = useFormContext();
  const lat = watch('lat');
  const lng = watch('lng');

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const debounceTimer = useRef<any>(null);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();

      if (data.status === 'OK') {
        const result = data.results[0];

        let address_line1 = '';
        let address_line2 = '';
        let city = '';
        let state_code = '';
        let postal_code = '';

        result.address_components.forEach((comp: any) => {
          if (comp.types.includes('street_number')) address_line1 = comp.long_name + ' ';
          if (comp.types.includes('route')) address_line1 += comp.long_name;
          if (comp.types.includes('sublocality')) address_line2 = comp.long_name;
          if (comp.types.includes('locality')) city = comp.long_name;
          if (comp.types.includes('administrative_area_level_1')) state_code = comp.short_name;
          if (comp.types.includes('postal_code')) postal_code = comp.long_name;
        });

        setValue('address_line1', address_line1);
        setValue('address_line2', address_line2);
        setValue('city', city);
        setValue('state_code', state_code);
        setValue('postal_code', postal_code);
      }
    } catch {}
  };

  const searchLocationByQuery = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();

      if (data.status === 'OK' && data.results.length > 0) {
        setSearchResults(data.results);
        setShowResults(true);
      } else if (data.status === 'ZERO_RESULTS') {
        setSearchResults([]);
        setShowResults(false);
        toast.info('No results found for that search');
      } else {
        console.error('Geocoding error:', data.status);
        setSearchResults([]);
        setShowResults(false);
        toast.error('Error searching for location');
      }
    } catch (err) {
      console.error('Search location error:', err);
      setSearchResults([]);
      setShowResults(false);
      toast.error('Error searching for location');
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // Limpiar debounce anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Nuevo debounce
    debounceTimer.current = setTimeout(() => {
      searchLocationByQuery(value);
    }, 500);
  };

  const handleSelectLocation = (result: any) => {
    console.log('handleSelectLocation called with result:', result);
    
    const loc = result?.geometry?.location;
    // Google Geocoding API returns lat/lng as numbers
    const coords = loc
      ? typeof loc.lat === 'function'
        ? { lat: loc.lat(), lng: loc.lng() }
        : { lat: Number(loc.lat), lng: Number(loc.lng) }
      : null;

    console.log('Extracted coords:', coords);

    if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number' || isNaN(coords.lat) || isNaN(coords.lng)) {
      toast.error('Could not get the selected location');
      console.error('Invalid coordinates:', coords);
      return;
    }

    // Update map and marker first, before updating form values
    if (mapInstance.current && window.google?.maps) {
      try {
        const position = new window.google.maps.LatLng(coords.lat, coords.lng);
        mapInstance.current.setCenter(position);
        mapInstance.current.setZoom(17);
        
        if (markerInstance.current) {
          markerInstance.current.setPosition(position);
        }
      } catch (err) {
        console.error('Error updating map:', err);
      }
    }

    // Update form values after map is centered
    setValue('lat', coords.lat, { shouldValidate: false });
    setValue('lng', coords.lng, { shouldValidate: false });

    // Get address details from reverse geocoding
    fetchAddress(coords.lat, coords.lng);
    setSearchInput(result.formatted_address || '');
    setShowResults(false);
    setSearchResults([]);
    
    toast.success('✓ Location selected');
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Update map and marker
        if (mapInstance.current && window.google?.maps) {
          try {
            const pos = new window.google.maps.LatLng(lat, lng);
            mapInstance.current.setCenter(pos);
            mapInstance.current.setZoom(17);
            
            if (markerInstance.current) {
              markerInstance.current.setPosition(pos);
            }
          } catch (err) {
            console.error('Error updating map:', err);
          }
        }

        // Update form values
        setValue('lat', lat, { shouldValidate: false });
        setValue('lng', lng, { shouldValidate: false });

        // Get address details
        fetchAddress(lat, lng);
        setGettingLocation(false);
        toast.success('✓ Current location set');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setGettingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('An error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    if (document.getElementById('google-maps')) return;

    const script = document.createElement('script');
    script.id = 'google-maps';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => {
      console.error('Error loading Google Maps script');
      toast.error('Error loading Google Maps');
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const latNum = typeof lat === 'number' ? lat : (typeof lat === 'string' && lat !== '' ? parseFloat(lat) : null);
    const lngNum = typeof lng === 'number' ? lng : (typeof lng === 'string' && lng !== '' ? parseFloat(lng) : null);

    const center = {
      lat: (latNum !== null && !isNaN(latNum)) ? latNum : 19.432608,
      lng: (lngNum !== null && !isNaN(lngNum)) ? lngNum : -99.133209,
    };

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
      });

      markerInstance.current = new window.google.maps.Marker({
        map: mapInstance.current,
        position: center,
        draggable: true,
      });

      markerInstance.current.addListener('dragend', (e: any) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setValue('lat', newLat, { shouldValidate: false });
        setValue('lng', newLng, { shouldValidate: false });
        fetchAddress(newLat, newLng);
      });

      mapInstance.current.addListener('click', (e: any) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        markerInstance.current.setPosition(e.latLng);
        setValue('lat', newLat, { shouldValidate: false });
        setValue('lng', newLng, { shouldValidate: false });
        fetchAddress(newLat, newLng);
      });
    } else {
      // Only update if values are valid numbers
      if (latNum !== null && lngNum !== null && !isNaN(latNum) && !isNaN(lngNum)) {
        mapInstance.current.setCenter(center);
        markerInstance.current.setPosition(center);
      }
    }
  }, [mapLoaded, lat, lng]);

  return (
    <div>
      <label className="block font-semibold mb-3">Location on Map</label>
      
      {/* Location search with autocomplete */}
      <div className="relative mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Search address, city, postal code..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={gettingLocation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {gettingLocation ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                My Location
              </>
            )}
          </button>
        </div>
        
        {/* Results dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectLocation(result)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {result.formatted_address}
                </p>
              </button>
            ))}
          </div>
        )}

        {searching && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Searching...</p>
          </div>
        )}
      </div>

      <div ref={mapRef} className="w-full h-[300px] rounded border dark:border-gray-600" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <InputField name="address_line1" label="Street" />
        <InputField name="address_line2" label="Neighborhood/Locality" />
        <InputField name="city" label="City" />
        <InputField name="state_code" label="State/Region" />
        <InputField name="postal_code" label="Postal Code" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <InputField name="lat" label="Latitude" type="number" step="any" />
        <InputField name="lng" label="Longitude" type="number" step="any" />
      </div>
    </div>
  );
}

/* =========================
   Imagen logic (FIXED)
========================= */
const normalizeImage = (
  cleanData: any,
  isEditing: boolean,
  initialData?: JobPost
) => {
  // Si la imagen es un string (base64 o url), no la envíes
  if (typeof cleanData.image === 'string' && !cleanData.image.startsWith('data:')) {
    cleanData.image = undefined;
  }
  // Si la imagen fue eliminada
  if (isEditing && !cleanData.image && initialData?.image_path) {
    cleanData.remove_image = true;
  }
};

// Componente principal del formulario
interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: JobPost | null;
  load: () => void;
}

const Form: React.FC<FormProps> = ({ isOpen, onClose, initialData, load }) => {
  const isEditing = !!initialData;
  const [serviceOptions, setServiceOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // Fetch services from API
    import('@/core/services/service/service.service').then(({ ServiceService }) => {
      ServiceService.getAllServices().then((res: any) => {

        if (res?.data) {
          setServiceOptions(res.data);
        }
      });
    });
  }, []);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const defaultValues = initialData
    ? {
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        service_id: initialData.service_id || '',
        deadline: initialData.deadline ? initialData.deadline.substring(0, 10) : todayStr,
        currency: initialData.currency || '',
        status: initialData.status || 'open',
        address_line1: initialData.address_line1 || '',
        address_line2: initialData.address_line2 || '',
        city: initialData.city || '',
        state_code: initialData.state_code || '',
        postal_code: initialData.postal_code || '',
        lat: initialData.lat || '',
        lng: initialData.lng || '',
        image: initialData.image_path || '',
      }
    : {
        title: '',
        description: '',
        price: '',
        service_id: '',
        deadline: todayStr,
        currency: '',
        status: 'open',
        address_line1: '',
        address_line2: '',
        city: '',
        state_code: '',
        postal_code: '',
        lat: '',
        lng: '',
        image: '',
      };

  const [backendError, setBackendError] = useState<string | null>(null);
  const handleSubmit = async (data: any) => {
    setBackendError(null);
    try {
      // No filtrar status, solo filtrar undefined
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      // Convertir price y service_id a número si es posible
      if (cleanData.price !== undefined && cleanData.price !== null && cleanData.price !== '') {
        cleanData.price = Number(cleanData.price);
      }
      if (cleanData.service_id !== undefined && cleanData.service_id !== null && cleanData.service_id !== '') {
        cleanData.service_id = Number(cleanData.service_id);
      }

      // Get homeowner_id from localStorage user_data
      try {
        const userDataRaw = localStorage.getItem('user_data');
        if (userDataRaw) {
          const userData = JSON.parse(userDataRaw);
          if (userData?.id) {
            cleanData.homeowner_id = Number(userData.id);
            console.log('homeowner_id sent:', cleanData.homeowner_id);
          }
        }
      } catch {}

      // Normalize deadline: if empty set null; if value ensure YYYY-MM-DD format
      if (!cleanData.deadline || cleanData.deadline === '') {
        cleanData.deadline = null;
      } else if (typeof cleanData.deadline === 'string') {
        const date = new Date(cleanData.deadline);
        if (!isNaN(date.getTime())) {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          cleanData.deadline = `${yyyy}-${mm}-${dd}`;
        }
      } else {
        cleanData.deadline = null;
      }

      // Default value for currency if empty or null
      if (!cleanData.currency || cleanData.currency === '') {
        cleanData.currency = 'MXN';
      }

      normalizeImage(cleanData, isEditing, initialData || undefined);
      // No enviar image si es undefined
      if (cleanData.image === undefined) {
        delete cleanData.image;
      }

      const payload: any = { ...cleanData };

      let result;
      if (isEditing && initialData && initialData.id) {
        console.log(payload);
        result = await updateJobPost(payload, initialData);
      } else {
            console.log(payload);
        result = await createJobPost(payload, initialData);
      }
      console.log('API result:', result);
      if (result && result.message && result.data) {
        toast.success('Saved successfully!');
        load();
        onClose();
      } else {
        console.log(result);
        setBackendError(result?.message || 'Error saving the post');
      }
    } catch (err: any) {
      // axios error
      if (err.response && err.response.data && err.response.data.message) {
        console.log('Error response data:', err);
        setBackendError(err.response.data.message);
      } else {
        console.log(err);
        setBackendError(err?.message || 'Network error');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Post' : 'New Post'} size="lg">
      {/* ToastContainer should be rendered once in your app, ideally in App.tsx. If not, you can add it here for local usage: */}
      {/* <ToastContainer /> */}
      <FormProviderWrapper
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        validationSchema={jobPostSchema}
        className="w-full"
      >
        {backendError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{backendError}</div>
        )}
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="title" label="Title" />
              <InputField name="price" label="Price" />
              <SelectField
                name="service_id"
                label="Service"
                options={serviceOptions}
                valueKey="id"
                labelKey="name"
                placeholder="Select a service"
              />
              <InputField name="deadline" label="Deadline" type="date" />
              <InputField name="currency" label="Currency" />
              <SelectField
                name="status"
                label="Status"
                options={[
                  { id: 'open', name: 'Open' },
                  { id: 'closed', name: 'Closed' },
                ]}
                valueKey="id"
                labelKey="name"
                placeholder="Select status"
              />
            </div>
            <div className="mt-6">
              <InputField name="description" label="Description" />
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <GoogleMapPicker />
          </div>

          {/* Image Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Image</h2>
            <InputFileField
              name="image"
              label="Image (optional)"
              helperText="Formats: JPG, PNG (max 4MB). Leave empty to keep or remove to delete."
              accept="image/*"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default Form;
