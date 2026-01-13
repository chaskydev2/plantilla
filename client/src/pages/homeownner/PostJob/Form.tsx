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
   GoogleMapPicker
========================= */
function GoogleMapPicker() {
  const { setValue, watch } = useFormContext();
  const lat = watch('lat');
  const lng = watch('lng');

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);

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
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const center = {
      lat: typeof lat === 'number' ? lat : 19.432608,
      lng: typeof lng === 'number' ? lng : -99.133209,
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
        setValue('lat', newLat);
        setValue('lng', newLng);
        fetchAddress(newLat, newLng);
      });

      mapInstance.current.addListener('click', (e: any) => {
        markerInstance.current.setPosition(e.latLng);
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setValue('lat', newLat);
        setValue('lng', newLng);
        fetchAddress(newLat, newLng);
      });
    } else {
      mapInstance.current.setCenter(center);
      markerInstance.current.setPosition(center);
    }
  }, [mapLoaded, lat, lng]);

  return (
    <div>
      <label className="block font-semibold mb-1">Location on map</label>
      <div ref={mapRef} className="w-full h-[300px] rounded border" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <InputField name="address_line1" label="Address Line 1" />
        <InputField name="address_line2" label="Address Line 2" />
        <InputField name="city" label="City" />
        <InputField name="state_code" label="State" />
        <InputField name="postal_code" label="Postal Code" />
        {/* Lat/Lng hidden, set by map only */}
        <input type="hidden" name="lat" />
        <input type="hidden" name="lng" />
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
    // Traer los servicios creados desde la API
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

      // Obtener homeowner_id desde localStorage user_data
      try {
        const userDataRaw = localStorage.getItem('user_data');
        if (userDataRaw) {
          const userData = JSON.parse(userDataRaw);
          if (userData?.id) {
            cleanData.homeowner_id = Number(userData.id);
            console.log('homeowner_id enviado:', cleanData.homeowner_id);
          }
        }
      } catch {}

      // Normalizar deadline: si está vacío, poner null; si tiene valor, asegurar formato YYYY-MM-DD
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

      // Valor por defecto para currency si está vacío o null
      if (!cleanData.currency || cleanData.currency === '') {
        cleanData.currency = 'MXN';
      }

      normalizeImage(cleanData, isEditing, initialData || undefined);
      // No enviar image si es undefined
      if (cleanData.image === undefined) {
        delete cleanData.image;
      }

      // --- Mejor manejo de imagen tipo File, igual que ServiceModal ---
      let payload: any = { ...cleanData };
      // Si la imagen es un File, se envía como tal (FormData)
      if (cleanData.image instanceof File) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        payload = formData;
      } else if (cleanData.image === '' || cleanData.image === null) {
        // Si la imagen es string vacía o null, enviar remove_image
        payload.image = null;
        payload.remove_image = true;
      } else if (typeof cleanData.image === 'string') {
        // Si la imagen es string (url previa), no enviar nada (mantener)
        delete payload.image;
      }

      let result;
      if (isEditing && initialData && initialData.id) {
        result = await updateJobPost(payload, initialData);
      } else {
        result = await createJobPost(payload, initialData);
      }
      console.log('API result:', result);
      if (result && result.message && result.data) {
        toast.success('Saved successfully!');
        load();
        onClose();
      } else {
        setBackendError(result?.message || 'Error saving the post');
      }
    } catch (err: any) {
      // axios error
      if (err.response && err.response.data && err.response.data.message) {
        console.log('Error response data:', err.response.data);
        setBackendError(err.response.data.message);
      } else {
        setBackendError(err?.message || 'Network error');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar publicación' : 'Nueva publicación'} size="lg">
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
          {/* Sección principal */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Información básica</h2>
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

          {/* Sección de ubicación */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Ubicación</h2>
            <GoogleMapPicker />
          </div>

          {/* Sección de imagen */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Imagen</h2>
            <InputFileField
              name="image"
              label="Imagen (opcional)"
              helperText="Formatos: JPG, PNG (máx 4MB). Deja vacío para mantener o quita para remover."
              accept="image/*"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default Form;
