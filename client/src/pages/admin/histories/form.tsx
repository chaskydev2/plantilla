import { InputField, TextAreaField, InputFileField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IHistoryCreateRequest as ICreateRequest,
  IHistoryUpdateRequest as IUpdateRequest,
  IHistory as IItemResponse
} from '@/core/types/IHistory';
import { HistoryService as ItemService } from '@/core/services/history/history.service';
import { toastify } from '@/core/utils/toastify';
import {
  HistoryStoreSchema as storeSchema,
  HistoryUpdateSchema as updateSchema
} from './validation';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const HistoryModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: HistoryModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      title: initialData?.title || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      banner1: initialData?.banner1 || '',
      banner2: initialData?.banner2 || '',
      banner3: initialData?.banner3 || '',
    }
    : {
      title: '',
      description: '',
      content: '',
      banner1: '',
      banner2: '',
      banner3: '',
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
      title={isEditing ? 'Editar Historia' : 'Nuevo Historia'}
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
              placeholder="Ej: Nombre de la historia..."
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Descripción"
              placeholder="Breve descripción de la historia..."
              rows={4}
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="content"
              label="Contenido"
              placeholder="Contenido detallado de la historia..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-1">
            <div>
              <InputFileField
                name="banner1"
                label="Banner 1"
                helperText="Formatos: JPG, PNG (Max. 4MB)"
              />
            </div>
            <div>
              <InputFileField
                name="banner2"
                label="Banner 2"
                helperText="Formatos: JPG, PNG (Max. 4MB)"
              />
            </div>
            <div>
              <InputFileField
                name="banner3"
                label="Banner 3"
                helperText="Formatos: JPG, PNG (Max. 4MB)"
              />
            </div>
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default HistoryModal;