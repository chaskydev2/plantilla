import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { InputField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  ITagCreateRequest as ICreateRequest,
  ITagUpdateRequest as IUpdateRequest,
  ITag as IItemResponse,
} from '@/core/types/ITag';
import { TagService as ItemService } from '@/core/services/tag/tag.service';
import { toastify } from '@/core/utils/toastify';
import {
  TagStoreSchema as storeSchema,
  TagUpdateSchema as updateSchema,
} from '@/pages/admin/tags/validation';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const getContractorIdFromLocalStorage = (): number | null => {
  try {
    const raw = localStorage.getItem('user_data');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const id = parsed?.id ?? parsed?.user?.id ?? parsed?.contractor?.id ?? null;
    return typeof id === 'number' ? id : Number(id) || null;
  } catch {
    return null;
  }
};

// Reusable modal for creating/updating contractor tags
const TagModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: TagModalProps) => {
  const isEditing = !!initialData;
  const [allTags, setAllTags] = useState<IItemResponse[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const contractorId = getContractorIdFromLocalStorage();

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? {
        name: initialData?.name || '',
        slug: initialData?.slug || '',
      }
    : {
        name: '',
        slug: '',
      };

  useEffect(() => {
    setSelectedTagId(initialData?.id ? String(initialData.id) : '');
  }, [initialData]);

  const handleSubmit = async (data: FormValues) => {
    if (!contractorId) {
      toastify.error('Contractor ID not found');
      return;
    }
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null && value !== '' && value !== undefined)
    );

    if (!cleanData.slug || (typeof cleanData.slug === 'string' && cleanData.slug.trim() === '')) {
      delete cleanData.slug;
    }

    try {
      if (isEditing && initialData) {
        // Determine target tag id: selected different tag or create new then swap
        let targetTagId: number | null = null;

        if (selectedTagId && Number(selectedTagId) !== Number(initialData.id)) {
          targetTagId = Number(selectedTagId);
        } else {
          // Create a new tag with the edited data to assign as new_tag_id
          const createRes = await ItemService.create(cleanData as ICreateRequest);
          targetTagId = Number((createRes?.data as any)?.id);
          toastify.success(createRes?.message || 'Tag created');
        }

        if (!targetTagId) {
          toastify.error('Could not determine the tag to assign');
          return;
        }

        const response = await ItemService.updateForContractor({
          contractor_user_id: contractorId,
          tag_id: Number(initialData.id),
          new_tag_id: targetTagId,
        });

        toastify.success(response?.message || 'Tag updated for contractor');
        onClose();
        load();
        return;
      }

      // If user picked an existing tag, link it to contractor via contractor-tags API
      if (selectedTagId) {
        const response = await ItemService.createForContractor({
          contractor_user_id: contractorId,
          tag_id: Number(selectedTagId),
        });
        toastify.success(response?.message || 'Tag assigned');
        onClose();
        load();
        return;
      }

      // Otherwise create a new tag then link it
      const createRes = await ItemService.create(cleanData as ICreateRequest);
      const newTagId = (createRes?.data as any)?.id;
      if (newTagId) {
        await ItemService.createForContractor({
          contractor_user_id: contractorId,
          tag_id: Number(newTagId),
        });
      }
      toastify.success(createRes?.message || 'Tag created and assigned');
      onClose();
      load();
    } catch (error: any) {
      toastify.error(error.response?.data?.message || 'Error saving tag');
    }
  };

  // Load all tags to show in the selector
  useEffect(() => {
    const loadTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await ItemService.getAll();
        const list = Array.isArray(response?.data) ? response.data : [];
        setAllTags(list as IItemResponse[]);
      } catch (error: any) {
        console.error('Error loading tags', error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    loadTags();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit tag' : 'New tag'}
      size="md"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={isEditing ? updateSchema : storeSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <ExistingTagSelect
          tags={allTags}
          loading={isLoadingTags}
          initialSelectedId={selectedTagId}
          onSelect={(id) => setSelectedTagId(id)}
        />
        <div className="grid grid-cols-1 gap-6">
          <div>
            <InputField name="name" label="Tag name" placeholder="E.g.: Painting" required />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              The name must be unique.
            </p>
          </div>

          <div>
            <InputField
              name="slug"
              label="Slug (optional)"
              placeholder="Automatically generated from name"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              If left empty, it will be generated automatically from the name.
            </p>
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default TagModal;

type ExistingTagSelectProps = {
  tags: IItemResponse[];
  loading: boolean;
  initialSelectedId?: string;
  onSelect: (id: string) => void;
};

// Lightweight select to browse all existing tags and optionally prefill the form
const ExistingTagSelect = ({ tags, loading, initialSelectedId = '', onSelect }: ExistingTagSelectProps) => {
  const { setValue } = useFormContext();
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId);

  useEffect(() => {
    setSelectedId(initialSelectedId);
    if (initialSelectedId) {
      const tag = tags.find((t) => String(t.id) === initialSelectedId);
      if (tag) {
        setValue('name', tag.name, { shouldValidate: true });
        setValue('slug', tag.slug || '', { shouldValidate: true });
      }
    }
  }, [initialSelectedId, tags, setValue]);
  const handleChange = (value: string) => {
    setSelectedId(value);
    const tag = tags.find((t) => String(t.id) === value) || null;
    if (tag) {
      // Prefill fields to speed up creation or edits
      setValue('name', tag.name, { shouldValidate: true });
      setValue('slug', tag.slug || '', { shouldValidate: true });
    }
    onSelect(value);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        Existing tags
      </label>
      <select
        className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
        value={selectedId}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading || tags.length === 0}
      >
        <option value="">Select a tag</option>
        {loading && <option value="" disabled>Loading...</option>}
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Select a tag to automatically fill in the name and slug.
      </p>
    </div>
  );
};
