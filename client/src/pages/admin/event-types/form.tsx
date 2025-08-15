import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IEventTypeCreateRequest as ICreateRequest,
  IEventTypeUpdateRequest as IUpdateRequest,
  IEventType as IItemResponse
} from '@/core/types/IEventType';
import { EventTypeService as ItemService } from '@/core/services/event-type/event-type.service';
import { toastify } from '@/core/utils/toastify';
import {
  typeEventStoreSchema as storeSchema,
  typeEventUpdateSchema as updateSchema
} from './validation';

interface EventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const EventTypeModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: EventTypeModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      name: initialData?.name || '',
      description: initialData?.description || '',
    }
    : {
      name: '',
      description: '',
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
      title={isEditing ? 'Editar Tipo de evento' : 'Nuevo Tipo de evento'}
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
          <div>
            <InputField
              name="name"
              label="Nombre"
              placeholder="Ej: Nombre del tipo de evento..."
            />
          </div>

          <div>
            <TextAreaField
              name="description"
              label="Descripción"
              placeholder="Detalles del tipo de evento..."
              rows={4}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default EventTypeModal;