import { TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IBeginningCreateRequest as ICreateRequest,
  IBeginningUpdateRequest as IUpdateRequest,
  IBeginning as IItemResponse
} from '@/core/types/IBeginning';
import { BeginningService as ItemService } from '@/core/services/beginning/beginning.service';
import { toastify } from '@/core/utils/toastify';
import {
  BeginningStoreSchema as storeSchema,
  BeginningUpdateSchema as updateSchema
} from './validation';

interface BeginningModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const BeginningModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: BeginningModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      mission: initialData?.mission || '',
      vision: initialData?.vision || '',
      our_father: initialData?.our_father || '',
    }
    : {
      mission: '',
      vision: '',
      our_father: '',
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
      title={isEditing ? 'Editar Principios' : 'Nuevos Principios'}
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
            <TextAreaField
              name="mission"
              label="Misión"
              placeholder="Redacte la misión institucional..."
              rows={5}
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="vision"
              label="Visión"
              placeholder="Redacte la visión institucional..."
              rows={5}
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="our_father"
              label="Padre Nuestro"
              placeholder="Incluya el texto completo de la oración..."
              rows={5}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default BeginningModal;