import { InputField, TextAreaField, InputFileField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IBannerCreateRequest as ICreateRequest,
  IBannerUpdateRequest as IUpdateRequest,
  IBanner as IItemResponse
} from '@/core/types/IBanner';
import { BannerService as ItemService } from '@/core/services/banner/banner.service';
import { toastify } from '@/core/utils/toastify';
import {
  BannerStoreSchema as storeSchema,
  BannerUpdateSchema as updateSchema
} from './validation';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const BannerModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: BannerModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
      image: initialData?.image || '',
    }
    : {
      title: '',
      subtitle: '',
      image: '',
    };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Banner actualizado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Banner creado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Banner' : 'Nuevo Banner'}
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
          <div className="col-span-1">
            <InputField
              name="title"
              label="Título del banner"
              placeholder="Ej: Promoción de verano, Evento especial..."
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="subtitle"
              label="Subtítulo"
              placeholder="Texto descriptivo o llamada a acción..."
              rows={3}
            />
          </div>

          <div className="col-span-1">
            <InputFileField
              name="image"
              label="Imagen del banner"
              helperText="Formatos recomendados: JPG, PNG, WEBP (Máx. 4MB)"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default BannerModal;