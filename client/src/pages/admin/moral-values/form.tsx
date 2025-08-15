import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IMoralValueCreateRequest as ICreateRequest,
  IMoralValueUpdateRequest as IUpdateRequest,
  IMoralValue as IItemResponse
} from '@/core/types/IMoralValue';
import { MoralValueService as ItemService } from '@/core/services/moral-value/moral-value.service';
import { toastify } from '@/core/utils/toastify';
import {
  MoralValueStoreSchema as storeSchema,
  MoralValueUpdateSchema as updateSchema
} from './validation';

interface MoralValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const MoralValuesModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: MoralValuesModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      title: initialData?.title || '',
      description: initialData?.description || '',
    }
    : {
      title: '',
      description: '',
    };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Valor moral actualizado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Valor moral creado');
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
      title={isEditing ? 'Editar Valor Moral' : 'Nuevo Valor Moral'}
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
              label="Título"
              placeholder="Ej: Respeto, Honestidad, Responsabilidad..."
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Descripción"
              placeholder="Describa el valor moral y su importancia..."
              rows={6}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default MoralValuesModal;