import { InputField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  ITagCreateRequest as ICreateRequest,
  ITagUpdateRequest as IUpdateRequest,
  ITag as IItemResponse
} from '@/core/types/ITag';
import { TagService as ItemService } from '@/core/services/tag/tag.service';
import { toastify } from '@/core/utils/toastify';
import {
  TagStoreSchema as storeSchema,
  TagUpdateSchema as updateSchema
} from './validation.ts';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const TagModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: TagModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
        name: initialData?.name || '',
        slug: initialData?.slug || '',
      }
    : {
        name: '',
        slug: '',
      };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== '' && value !== undefined)
    );
    
    // Si el slug está vacío, lo eliminamos para que el backend lo genere automáticamente
    if (!cleanData.slug || cleanData.slug.trim() === '') {
      delete cleanData.slug;
    }

    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.id, cleanData as IUpdateRequest);
        toastify.success(response.message || 'Tag updated');
        onClose();
        load();
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        toastify.success(response.message || 'Tag created');
        onClose();
        load();
      }
    } catch (error: any) {
      toastify.error(error.response?.data?.message || 'Error saving tag');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Tag' : 'New Tag'}
      size="md"
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
              label="Tag name"
              placeholder="E.g.: Laravel"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              The tag name must be unique.
            </p>
          </div>

          <div>
            <InputField
              name="slug"
              label="Slug (optional)"
              placeholder="Automatically generated from name"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              If not provided, it will be generated automatically from the name. Only lowercase letters, numbers, and hyphens are allowed.
            </p>
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default TagModal;
