import { getAllServices, ServiceService } from '@/core/services/service/service.service';
import ServiceSelectField from './ServiceSelectField';
import { useMemo, useState, useEffect } from 'react';
import { InputField, TextAreaField } from '@/components/form-field';

import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IProfessionCreateRequest as ICreateRequest,
  IProfessionUpdateRequest as IUpdateRequest,
  IProfession as IItemResponse
} from '@/core/types/IProfession';
import { ProfessionService as ItemService } from '@/core/services/profession/profession.service';
import { toastify } from '@/core/utils/toastify';
import {
  ProfessionStoreSchema as storeSchema,
  ProfessionUpdateSchema as updateSchema
} from './validation';

import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Icon as LucideIconBase } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface ProfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  mode?: 'create' | 'edit' | 'view';
}

export type LucideIconName = Exclude<keyof typeof LucideIcons, 'default' | 'createLucideIcon' | 'IconNode' | 'LucideIcon' | 'LucideProps'>;

export type LucideIconItem = {
  name: LucideIconName;
  Icon: LucideIcon;
};

/* -------------------------------------------------------------------------- */
/*                       LUCIDE ICONS (FIX REAL HERE)                        */
/* -------------------------------------------------------------------------- */

const isRenderableIcon = (Icon: unknown) => {
  if (!Icon) return false;
  const t = typeof Icon;
  const hasNode = (Icon as any).iconNode && Array.isArray((Icon as any).iconNode);
  const isForwardRef = !!(Icon as any).displayName && (Icon as any).render;
  return (hasNode || isForwardRef) && (t === 'function' || t === 'object');
};

export const LUCIDE_ICONS: LucideIconItem[] = Object.entries(LucideIcons)
  .filter(([name, Icon]) => /^[A-Z]/.test(name) && isRenderableIcon(Icon))
  .map(([name, Icon]) => ({
    name: name as LucideIconName,
    Icon: Icon as LucideIcon,
  }));

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const ProfessionModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  mode = 'create'
}: ProfessionModalProps) => {
  const isEditing = mode === 'edit';
  const isViewing = mode === 'view';

  type FormValues = (ICreateRequest | IUpdateRequest) & { icon?: string; service_id?: string };

  const defaultValues: FormValues = (isEditing || isViewing)
    ? {
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        icon: (initialData as any)?.icon || '',
        description: initialData?.description || '',
        service_id: (initialData as any)?.service_id || '',
      }
    : {
        name: '',
        slug: '',
        icon: '',
        description: '',
        service_id: '',
      };

  // Servicios para el select
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Importa la función getAllServices desde donde esté definida
  // import { getAllServices } from '@/core/services/service.service';
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        // Consumir el servicio getAllServices
        const response = await getAllServices();
        // Asume que la data está en response.data
        setServices((response.data || []).map((s: any) => ({ id: String(s.id), name: s.name })));
      } catch (e) {
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (data: FormValues) => {
    if (isViewing) return;

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );

    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.id, cleanData as IUpdateRequest);
        toastify.success(response.message || 'Profession updated successfully');
      } else {
        console.log(cleanData); 
        const response = await ItemService.create(cleanData as ICreateRequest);
        console.log(cleanData);
        toastify.success(response.message || 'Profession created successfully');
      }

      onClose();
      load();
    } catch (error: any) {
      toastify.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An error occurred'
      );
    }
  };

  // Eliminado: useFormContext fuera del FormProviderWrapper. El control se obtiene dentro de FormContent.

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewing ? 'View Profession' : isEditing ? 'Edit Profession' : 'New Profession'}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={isEditing ? updateSchema : storeSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 gap-6">
          <InputField
            name="name"
            label="Name"
            readOnly={isViewing}
          />

          <InputField
            name="slug"
            label="Slug"
            readOnly={isViewing}
          />

          <TextAreaField
            name="description"
            label="Description"
            rows={4}
            readOnly={isViewing}
          />

          {/* ServiceSelectField como campo normal de react-hook-form */}
          <div className="space-y-2">
            <ServiceSelectField
              name="service_id"
              options={services}
              loading={loadingServices}
              disabled={isViewing}
            />
            {!isViewing && <ServiceProfessionsPreview />}
          </div>

          <div>
            <label className="label mb-2">Icon</label>
            <IconField readOnly={isViewing} />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default ProfessionModal;

/* -------------------------------------------------------------------------- */
/*                  SERVICE PROFESSIONS PREVIEW POPUP                         */
/* -------------------------------------------------------------------------- */

function ServiceProfessionsPreview() {
  const { watch } = useFormContext();
  const serviceId = watch('service_id');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [professions, setProfessions] = useState<IItemResponse[]>([]);

  const loadProfessions = async () => {
    if (!serviceId) {
      toastify.error('Selecciona un servicio primero');
      return;
    }
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const res = await ServiceService.getProfessionsByService(serviceId);
      setProfessions((res.data as IItemResponse[]) || []);
    } catch {
      setError('No se pudieron cargar las profesiones para este servicio');
      setProfessions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={loadProfessions}
      >
        Ver profesiones del servicio
      </button>

      {open && (
        <Modal
          isOpen
          onClose={() => setOpen(false)}
          title="Profesiones del servicio"
          size="lg"
        >
          <div className="space-y-3">
            {loading && <div className="text-sm text-gray-500">Cargando profesiones...</div>}
            {error && !loading && <div className="text-sm text-red-600">{error}</div>}
            {!loading && !error && professions.length === 0 && (
              <div className="text-sm text-gray-500">No hay profesiones registradas para este servicio.</div>
            )}
            {!loading && !error && professions.length > 0 && (
              <ul className="divide-y divide-gray-200 max-h-80 overflow-auto">
                {professions.map((p) => (
                  <li key={p.id} className="py-2">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">/{p.slug}</div>
                    {p.description && (
                      <div className="text-sm text-gray-700 mt-1 line-clamp-2">{p.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                ICON FIELD                                  */
/* -------------------------------------------------------------------------- */

function IconField({ readOnly }: { readOnly?: boolean }) {
  const { register, watch } = useFormContext();
  const iconName = watch('icon') as LucideIconName | undefined;
  const Icon = iconName ? (LucideIcons[iconName] as LucideIcon) : null;

  return (
    <div className="flex items-center gap-4">
      <input type="hidden" {...register('icon')} />

      <div className="w-12 h-12 flex items-center justify-center rounded border">
        {Icon ? <Icon className="w-6 h-6" /> : <span className="text-xs">No icon</span>}
      </div>

      {!readOnly && <IconPickerButton />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           ICON PICKER BUTTON                               */
/* -------------------------------------------------------------------------- */

function IconPickerButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => setOpen(true)}
      >
        Select icon
      </button>

      {open && <IconPickerModal onClose={() => setOpen(false)} />}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                           ICON PICKER MODAL                                */
/* -------------------------------------------------------------------------- */

function IconPickerModal({ onClose }: { onClose: () => void }) {
  const { setValue, watch } = useFormContext();
  const current = watch('icon');
  const [query, setQuery] = useState('');

  const filteredIcons = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LUCIDE_ICONS;
    return LUCIDE_ICONS.filter(({ name }) => name.toLowerCase().includes(q));
  }, [query]);

  return (
    <Modal isOpen onClose={onClose} title="Select an icon" size="xl">
      <div className="mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons (e.g. Wrench, Hammer)"
          className="input input-sm w-full"
        />
      </div>
      <div className="grid grid-cols-6 gap-3 max-h-[60vh] overflow-y-auto p-2">
        {filteredIcons.map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setValue('icon', name);
              onClose();
            }}
            className={`flex flex-col items-center p-2 rounded border
              ${current === name
                ? 'border-primary bg-primary/10'
                : 'border-transparent hover:border-gray-300'}`}
          >
            {Icon
              ? <Icon className="w-6 h-6" />
              : <LucideIconBase iconNode={(LucideIcons as any)[name]?.iconNode ?? []} className="w-6 h-6" />}
            <span className="text-xs mt-1 truncate w-full text-center">
              {name}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
