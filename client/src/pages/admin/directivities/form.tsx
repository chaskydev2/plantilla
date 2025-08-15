import { InputField, TextAreaField, InputFileField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IDirectivityCreateRequest as ICreateRequest,
  IDirectivityUpdateRequest as IUpdateRequest,
  IDirectivity as IItemResponse
} from '@/core/types/IDirectivity';
import { DirectivityService as ItemService } from '@/core/services/directivity/directivity.service';
import { toastify } from '@/core/utils/toastify';
import {
  DirectivityStoreSchema as storeSchema,
  DirectivityUpdateSchema as updateSchema
} from './validation';

interface DirectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const DirectivityModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: DirectivityModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      name: initialData?.name || '',
      position: initialData?.position || '',
      photo: initialData?.photo || '',
    }
    : {
      name: '',
      position: '',
      photo: '',
    };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Item actualizado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Item creado');
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
      title={isEditing ? 'Editar Directiva' : 'Nuevo Miembro de Directiva'}
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
              name="name"
              label="Nombre completo"
              placeholder="Ej: Juan Pérez López"
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="position"
              label="Cargo"
              placeholder="Ej: Presidente, Secretario, etc."
              rows={3}
            />
          </div>

          <div className="col-span-1">
            <InputFileField
              name="photo"
              label="Fotografía"
              helperText="Formatos aceptados: JPG, PNG (Máx. 4MB)"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default DirectivityModal;