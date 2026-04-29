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
  const [loading, setLoading] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [services, setServices] = useState<IService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

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
  const serviceTypeHasMatch = useMemo(
    () =>
      !!serviceType &&
      services.some(service => {
        const optionValue = getServiceOptionValue(service);
        return optionValue === serviceType || service.name === serviceType;
      }),
    [serviceType, services]
  );

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
      setServicesLoading(true);
      setServicesError(null);
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
        setServicesError('Unable to load services. Enter the service manually.');
        toastify.error('Unable to load services. Enter the service manually.');
      } finally {
        if (isMounted) {
          setServicesLoading(false);
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
    }
  }, [jobToEdit]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSizeBytes = 5 * 1024 * 1024;

    if (!allowedTypes.includes(selected.type)) {
      toastify.error('Unsupported image format. Use jpg, png, gif, or webp.');
      e.target.value = '';
      return;
    }

    if (selected.size > maxSizeBytes) {
      toastify.error('Image must be smaller than 5MB.');
      e.target.value = '';
      return;
    }

    setFile(selected);
  };

  const reset = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setServiceType('');
    setAmountPaid('');
    setJobDate('');
    setUrl('');
    setFile(null);
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

    setLoading(true);
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
        is_active: false,
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
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-primary mb-4" onClick={() => setIsOpen(true)}>
        New job
      </button>

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
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g. Pipe repair"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Service type *</label>
                  {services.length ? (
                    <select
                      className="select select-bordered w-full"
                      value={serviceType}
                      onChange={e => setServiceType(e.target.value)}
                      required
                      disabled={servicesLoading}
                    >
                      <option value="">
                        {servicesLoading ? 'Loading services...' : 'Select a service'}
                      </option>
                      {services.map(service => {
                        const optionValue = getServiceOptionValue(service);
                        return (
                          <option key={service.id} value={optionValue}>
                            {service.name}
                          </option>
                        );
                      })}
                      {serviceType && !serviceTypeHasMatch && (
                        <option value={serviceType}>Current: {serviceType}</option>
                      )}
                    </select>
                  ) : (
                    <>
                      <input
                        className="input input-bordered w-full"
                        placeholder="Plumbing, electrical, etc."
                        value={serviceType}
                        onChange={e => setServiceType(e.target.value)}
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {servicesLoading
                          ? 'Loading services list...'
                          : 'Type the service name while the list is unavailable.'}
                      </p>
                      {servicesError && (
                        <p className="text-xs text-red-500">{servicesError}</p>
                      )}
                    </>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Location *</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      className="input input-bordered w-full flex-1"
                      placeholder="City or area"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      disabled={!mapReady}
                      onClick={() => {
                        if (!mapReady) {
                          toastify.error('Map search is unavailable right now.');
                          return;
                        }
                        setIsMapModalOpen(true);
                      }}
                    >
                      {mapReady ? 'Select on map' : 'Map unavailable'}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter the address manually or open the map to pinpoint the exact location.
                  </p>
                  {loadError && (
                    <p className="mt-1 text-xs text-red-500">
                      Map search is unavailable right now. Enter the address manually.
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold">Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={jobDate}
                    onChange={(e) => setJobDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Amount paid</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">URL (optional)</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="https://"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Details of the completed job"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Image (jpg, png, gif, webp, max 5MB)</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Create completed job'}
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
