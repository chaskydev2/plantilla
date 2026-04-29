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
    }
    : {
      title: '',
      description: '',
      content: '',
    };

  const handleSubmit = async (data: FormValues) => {
    // Don't filter - send all data including Files
    if (isEditing) {
      await ItemService.update(initialData!.id, data as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Item updated');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(data as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Item created');
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
      title={isEditing ? 'Edit History' : 'New History'}
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
              label="Title"
              placeholder="e.g., Story title..."
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Description"
              placeholder="Brief description of the story..."
              rows={4}
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="content"
              label="Content"
              placeholder="Detailed story content..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-1">
            <div>
              <InputFileField
                name="banner1"
                label="Banner 1"
                helperText="Formats: JPG, PNG (Max 4MB)"
              />
            </div>
            <div>
              <InputFileField
                name="banner2"
                label="Banner 2"
                helperText="Formats: JPG, PNG (Max 4MB)"
              />
            </div>
            <div>
              <InputFileField
                name="banner3"
                label="Banner 3"
                helperText="Formats: JPG, PNG (Max 4MB)"
              />
            </div>
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default HistoryModal;