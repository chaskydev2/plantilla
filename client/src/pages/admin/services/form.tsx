import { InputField, InputFileField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { IService, IServiceCreateRequest, IServiceUpdateRequest } from '@/core/types/IService';
import { ServiceService as ItemService } from '@/core/services/service/service.service';
import { toastify } from '@/core/utils/toastify';
import { ServiceStoreSchema as storeSchema, ServiceUpdateSchema as updateSchema } from './validation';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IService | null;
  load: () => void;
}

const ServiceModal = ({ isOpen, onClose, initialData = null, load }: ServiceModalProps) => {
  const isEditing = !!initialData;
  type FormValues =
    | IServiceCreateRequest
    | (IServiceUpdateRequest & { icon?: string | null; image?: string | null });

  const defaultValues: FormValues = isEditing
    ? {
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        icon: initialData?.icon || '',
        image: initialData?.image || '',
      }
    : {
        name: '',
        slug: '',
        icon: '',
        image: '',
      };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    ) as FormValues;

    try {
      if (isEditing) {
        const payload: IServiceUpdateRequest = {
          name: cleanData.name,
          slug: cleanData.slug || undefined,
        };

        if ('icon' in cleanData) {
          const iconValue = cleanData.icon as string | null | undefined;
          const unchanged = iconValue === initialData?.icon;

          if (iconValue === null || iconValue === '') {
            payload.icon = null;
            payload.remove_icon = true;
          } else if (!unchanged && iconValue) {
            payload.icon = iconValue;
          }
        }

        if ('image' in cleanData) {
          const imageValue = cleanData.image as string | null | undefined;
          const unchanged = imageValue === initialData?.image;

          if (imageValue === null || imageValue === '') {
            payload.image = null;
            payload.remove_image = true;
          } else if (!unchanged && imageValue) {
            payload.image = imageValue;
          }
        }

        const response = await ItemService.update(initialData!.id, payload);
        toastify.success(response.message || 'Servicio actualizado');
      } else {
        const payload: IServiceCreateRequest = {
          name: cleanData.name!,
          slug: cleanData.slug || undefined,
          icon: cleanData.icon || undefined,
          image: cleanData.image || undefined,
        };
        const response = await ItemService.create(payload);
        console.log(response, "mi api  ");
        toastify.success(response.message || 'Servicio creado');
      }

      onClose();
      load();
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || 'Error al guardar el servicio');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar servicio' : 'Nuevo servicio'}
      size={isEditing ? 'lg' : 'md'}
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
            label="Nombre"
            placeholder="Nombre del servicio"
            required
          />

          <InputField
            name="slug"
            label="Slug (opcional)"
            placeholder="Se genera automáticamente si lo dejas vacío"
          />

          <InputFileField
            name="icon"
            label="Icono (opcional)"
            helperText="Formatos: JPG, PNG, WEBP (máx 4MB). Deja vacío para mantener o quita para remover."
            accept="image/*"
          />

          <InputFileField
            name="image"
            label="Imagen (opcional)"
            helperText="Formatos: JPG, PNG, WEBP (máx 4MB). Deja vacío para mantener o quita para remover."
            accept="image/*"
          />
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default ServiceModal;
