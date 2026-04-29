import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';
import { JobCreatorService } from '@/core/services/job/jobCreator.service';
import { ServiceService } from '@/core/services/service/service.service';
import { toastify } from '@/core/utils/toastify';
import type { IJob, IJobCreateRequest } from '@/core/types/IJob';
import type { IService } from '@/core/types/IService';

interface CreateJobFormProps {
  creatorId: number | null;
  onCreated: () => void;
  jobToEdit?: IJob | null;
  onEditClosed?: () => void;
}

type LatLngLiteral = { lat: number; lng: number };

const DEFAULT_MAP_CENTER: LatLngLiteral = { lat: 19.432608, lng: -99.133209 };
const getServiceOptionValue = (service: IService) => service.slug || service.name || String(service.id);

const CreateJobForm: React.FC<CreateJobFormProps> = ({ creatorId, onCreated, jobToEdit, onEditClosed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [jobDate, setJobDate] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
  function getJobImageUrl(image?: string | null): string {
    if (!image) return '/images/default-service.jpg';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    // Quitar cualquier /api o api al inicio
    return `${API_BASE}/${image.replace(/^\/?api(\/|$)/, '')}`;
  }
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [services, setServices] = useState<IService[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const libraries = useMemo<Libraries>(() => ['places'], []);
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
    language: 'en',
    region: 'US',
  });
  const mapReady = isLoaded && !loadError;
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(DEFAULT_MAP_CENTER);
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(null);
  const searchBoxRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const ensureGeocoder = useCallback(() => {
    if (geocoderRef.current) return geocoderRef.current;
    const googleApi = (window as any).google;
    if (!googleApi?.maps?.Geocoder) return null;
    geocoderRef.current = new googleApi.maps.Geocoder();
    return geocoderRef.current;
  }, []);

  const closeMapModal = useCallback(() => {
    setIsMapModalOpen(false);
    searchBoxRef.current = null;
  }, []);

  // Reverse geocode coordinates to keep the address input synchronized with the marker.
  const updateAddressFromCoords = useCallback(
    (coords: LatLngLiteral) => {
      const geocoder = ensureGeocoder();
      if (!geocoder) return;
      geocoder.geocode({ location: coords }, (results: any, status: string) => {
        if (status === 'OK' && results?.[0]) {
          setLocation(results[0].formatted_address);
        } else {
          setLocation(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
        }
      });
    },
    [ensureGeocoder]
  );

  const geocodeAddress = useCallback(
    (address: string) => {
      const geocoder = ensureGeocoder();
      if (!geocoder || !address.trim()) return;

      geocoder.geocode({ address }, (results: any, status: string) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          const coords: LatLngLiteral = { lat, lng };
          setMarkerPosition(coords);
          setMapCenter(coords);
        } else {
          toastify.error('Unable to locate that address on the map.');
        }
      });
    },
    [ensureGeocoder]
  );

  const handlePlacesChanged = useCallback(() => {
    const box = searchBoxRef.current;
    const places = box?.getPlaces?.();
    if (!places || !places.length) return;

    const place = places[0];
    const nextLocation = place.formatted_address || place.name || '';
    const lat = place.geometry?.location?.lat?.();
    const lng = place.geometry?.location?.lng?.();

    if (typeof lat === 'number' && typeof lng === 'number') {
      const coords: LatLngLiteral = { lat, lng };
      setMapCenter(coords);
      setMarkerPosition(coords);
    }

    setLocation(nextLocation);
  }, []);

  const handleMapClick = useCallback(
    (event: any) => {
      const lat = event?.latLng?.lat?.();
      const lng = event?.latLng?.lng?.();
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      const coords: LatLngLiteral = { lat, lng };
      setMarkerPosition(coords);
      setMapCenter(coords);
      updateAddressFromCoords(coords);
    },
    [updateAddressFromCoords]
  );

  const handleMarkerDragEnd = useCallback(
    (event: any) => {
      const lat = event?.latLng?.lat?.();
      const lng = event?.latLng?.lng?.();
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      const coords: LatLngLiteral = { lat, lng };
      setMarkerPosition(coords);
      setMapCenter(coords);
      updateAddressFromCoords(coords);
    },
    [updateAddressFromCoords]
  );

  const isEdit = !!jobToEdit;

  React.useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      
      try {
        const response = await ServiceService.getAllServices();
        if (!isMounted) return;

        const directData = Array.isArray(response?.data) ? response.data : null;
        const nestedData = Array.isArray((response as any)?.data?.data)
          ? (response as any).data.data
          : null;
        const list = directData ?? nestedData ?? [];

        if (response?.success === false && !list.length) {
          throw new Error(response?.message || 'Failed to load services.');
        }

        setServices(list);
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to load services:', error);
        setServices([]);
      
        toastify.error('Unable to load services. Enter the service manually.');
      } finally {
        if (isMounted) {
          
        }
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (jobToEdit) {
      setIsOpen(true);
      setTitle(jobToEdit.title || '');
      setDescription(jobToEdit.description || '');
      setLocation(jobToEdit.location || '');
      setServiceType(jobToEdit.service_type || '');
      setAmountPaid(jobToEdit.amount_paid != null ? String(jobToEdit.amount_paid) : '');
      setJobDate(jobToEdit.job_date || '');
      setUrl(jobToEdit.url || '');
      setFile(null);
      setIsActive(jobToEdit.is_active ?? false);
    }
  }, [jobToEdit]);

  // Cambiar estado activo
  const handleActiveToggle = async () => {
    if (!jobToEdit || !jobToEdit.id) {
      setIsActive((prev) => !prev);
      return;
    }
    setUpdatingStatus(true);
    try {
      const res = await JobCreatorService.updateStatus(jobToEdit.id, { is_active: !isActive });
      if (res?.success) {
        setIsActive(res.data.is_active);
        toastify.success('Status updated');
      } else {
        toastify.error(res?.message || 'Failed to update status');
      }
    } catch (err) {
      toastify.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  React.useEffect(() => {
    if (!services.length || !serviceType) return;

    const matchedService = services.find(service => {
      const optionValue = getServiceOptionValue(service);
      return optionValue === serviceType || service.name === serviceType;
    });

    if (!matchedService) return;

    const normalizedValue = getServiceOptionValue(matchedService);
    if (normalizedValue !== serviceType) {
      setServiceType(normalizedValue);
    }
  }, [serviceType, services]);

  React.useEffect(() => {
    if (!isOpen) {
      setIsMapModalOpen(false);
      searchBoxRef.current = null;
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (loadError) {
      console.error('Failed to load Google Maps script:', loadError);
    }
  }, [loadError]);

  React.useEffect(() => {
    if (!mapReady) return;
    ensureGeocoder();
  }, [ensureGeocoder, mapReady]);

  React.useEffect(() => {
    if (!isLoaded || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      position => {
        const coords: LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(coords);
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [isLoaded]);

  React.useEffect(() => {
    if (!mapReady) return;

    if (jobToEdit?.location) {
      geocodeAddress(jobToEdit.location);
    } else if (!jobToEdit) {
      setMarkerPosition(null);
    }
  }, [geocodeAddress, jobToEdit, mapReady]);

  const reset = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setServiceType('');
    setAmountPaid('');
    setJobDate('');
    setUrl('');
    setFile(null);
    setIsActive(false);
    setMarkerPosition(null);
    setMapCenter(DEFAULT_MAP_CENTER);
    closeMapModal();
    if (onEditClosed) onEditClosed();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorId) {
      toastify.error('Authenticated user not found.');
      return;
    }
    if (!title || !location || !serviceType) {
      toastify.error('Title, location, and service type are required.');
      return;
    }

    try {
      const normalizedUrl = url.trim() ? url.trim() : undefined;
      const payload: IJobCreateRequest = {
        id_creator: creatorId,
        title,
        description: description || undefined,
        location,
        service_type: serviceType,
        url: normalizedUrl,
        amount_paid: amountPaid ? Number(amountPaid) : undefined,
        job_date: jobDate || undefined,
        is_active: isActive,
      };
      const res = isEdit && jobToEdit?.id
        ? await JobCreatorService.update(jobToEdit.id, payload)
        : await JobCreatorService.createWithFile(payload, file || undefined);
      console.log('Job service response:', res);
      if (res?.success) {
        toastify.success(isEdit ? 'Job updated successfully' : 'Job created successfully');
        reset();
        setIsOpen(false);
        onCreated();
      } else {
        toastify.error(res?.message || 'Failed to create the job entry');
      }
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || err?.message || 'Failed to create the job entry');
    } finally {
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-2">{isEdit ? 'Edit job' : 'Create completed job'}</h3>
            {isEdit && <p className="text-sm text-gray-500 mb-2">Editing #{jobToEdit?.id}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Title *</label>
                  <div className="input input-bordered w-full bg-gray-100 dark:bg-gray-800 flex items-center min-h-[2.5rem]">{title || <span className="text-gray-400">No title</span>}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Service type *</label>
                  <div className="input input-bordered w-full bg-gray-100 dark:bg-gray-800 flex items-center min-h-[2.5rem]">{serviceType || <span className="text-gray-400">No service</span>}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Location *</label>
                  <div className="input input-bordered w-full bg-gray-100 dark:bg-gray-800 flex items-center min-h-[2.5rem]">{location || <span className="text-gray-400">No location</span>}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Date</label>
                  <div className="input input-bordered w-full bg-gray-100 dark:bg-gray-800 flex items-center min-h-[2.5rem]">{jobDate || <span className="text-gray-400">No date</span>}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Amount paid</label>
                  <div className="input input-bordered w-full bg-gray-100 dark:bg-gray-800 flex items-center min-h-[2.5rem]">{amountPaid || <span className="text-gray-400">N/D</span>}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold">URL (optional)</label>
                  <div className="input input-bordered w-full bg-gray-100 dark:bg-gray-800 flex items-center min-h-[2.5rem]">{url || <span className="text-gray-400">No URL</span>}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Description</label>
                  <div className="textarea textarea-bordered w-full bg-gray-100 dark:bg-gray-800 min-h-[3rem]">{description || <span className="text-gray-400">No description</span>}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Image (jpg, png, gif, webp, max 5MB)</label>
                  {file ? (
                    <div className="flex items-center gap-2">
                      <span>{file.name}</span>
                    </div>
                  ) : jobToEdit && jobToEdit.image_url ? (
                    <div className="flex items-center gap-4 justify-center">
                      <img
                        src={getJobImageUrl(jobToEdit.image_url)}
                        alt="Job"
                        className="rounded-2xl border-4 border-primary shadow-xl transition-transform duration-300 hover:scale-105"
                        style={{ maxWidth: '350px', maxHeight: '260px', objectFit: 'cover', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400">No image selected</span>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold">Status</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Inactive</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={isActive}
                      onChange={handleActiveToggle}
                      disabled={updatingStatus}
                    />
                    <span className="text-xs">Active</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMapModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
              onClick={closeMapModal}
              aria-label="Close map"
            >
              ✕
            </button>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Select location on map</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Search an address or pick a spot directly on the map to update the job location.
            </p>

            {mapReady ? (
              <>
                <StandaloneSearchBox
                  onLoad={ref => {
                    searchBoxRef.current = ref;
                  }}
                  onPlacesChanged={handlePlacesChanged}
                >
                  <input
                    className="input input-bordered w-full"
                    placeholder="Search city, address, or place"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </StandaloneSearchBox>

                <div className="mt-4 h-[60vh] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <GoogleMap
                    center={markerPosition ?? mapCenter}
                    zoom={markerPosition ? 15 : 11}
                    mapContainerClassName="w-full h-full"
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                    onClick={handleMapClick}
                  >
                    {markerPosition && (
                      <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} />
                    )}
                  </GoogleMap>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" className="btn btn-ghost" onClick={closeMapModal}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (!location.trim()) {
                        toastify.error('Enter or select a location before continuing.');
                        return;
                      }
                      if (!markerPosition) {
                        geocodeAddress(location);
                      }
                      closeMapModal();
                    }}
                  >
                    Use this location
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Map search is unavailable right now. Try again later or enter the address manually.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateJobForm;
