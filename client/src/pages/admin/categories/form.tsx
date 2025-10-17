import { useState, useEffect } from 'react';
import { InputField, TextAreaField, SelectField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  ICategoryCreateRequest as ICreateRequest,
  ICategoryUpdateRequest as IUpdateRequest,
  ICategory as IItemResponse,
  ICategoryOption
} from '@/core/types/ICategory';
import { CategoryService as ItemService } from '@/core/services/category/category.service';
import { formatCategoriesForSelect } from '@/core/types/ICategory';
import { toastify } from '@/core/utils/toastify';
import {
  CategoryStoreSchema as storeSchema,
  CategoryUpdateSchema as updateSchema
} from './validation';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  mode?: 'create' | 'edit' | 'view';
}

const CategoryModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  mode = 'create'
}: CategoryModalProps) => {
  const isEditing = mode === 'edit';
  const isViewing = mode === 'view';
  const [parentOptions, setParentOptions] = useState<ICategoryOption[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);
  
  console.log("Debug - Form props:", { mode, initialData, isEditing, isViewing });

  // Load parent categories for dropdown
  useEffect(() => {
    if (isOpen) {
      loadParentCategories();
    }
  }, [isOpen]);

  const loadParentCategories = async () => {
    try {
      setLoadingParents(true);
      const response = await ItemService.getTree();
      if (response.success && response.data) {
        const options = formatCategoriesForSelect(response.data);
        
        // If editing, filter out the current category and its descendants to prevent circular references
        if (isEditing && initialData) {
          const filteredOptions = options.filter(option => {
            if (option.value === null) return true; // Always allow "No Parent"
            return option.value !== initialData.id; // Prevent selecting itself as parent
            // TODO: También filtrar descendientes si es necesario
          });
          setParentOptions(filteredOptions);
        } else {
          setParentOptions(options);
        }
      }
    } catch (error) {
      console.error('Error loading parent categories:', error);
      toastify.error('Error loading parent categories');
      setParentOptions([{ value: null, label: 'No Parent Category (Root)' }]);
    } finally {
      setLoadingParents(false);
    }
  };

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = (isEditing || isViewing)
    ? {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      parent_id: initialData?.parent_id || null,
      description: initialData?.description || '',
      icon: initialData?.icon || '',
    }
    : {
      name: '',
      slug: '',
      parent_id: null,
      description: '',
      icon: '',
    };
    
  console.log("Debug - defaultValues:", defaultValues);

  const handleSubmit = async (data: FormValues) => {
    // No submit en modo view
    if (isViewing) return;
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => {
        // Keep null values for parent_id but filter empty strings
        if (value === null) return true;
        return value !== '' && value !== undefined;
      })
    );
    
    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.id, cleanData as IUpdateRequest);
        toastify.success(response.message || 'Category updated successfully');
        onClose();
        load();
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        toastify.success(response.message || 'Category created successfully');
        onClose();
        load();
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'An error occurred while saving the category';
      toastify.error(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewing ? 'View Category' : isEditing ? 'Edit Category' : 'New Category'}
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
              label="Name"
              placeholder="Ex: Construction, Home Services, Technology"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="slug"
              label="Slug (Friendly URL)"
              placeholder="Ex: construction, home-services (auto-generated)"
              helperText="Auto-generated based on the name if left empty"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <SelectField
              name="parent_id"
              label="Parent Category"
              placeholder={loadingParents ? "Loading categories..." : "Select parent category"}
              options={parentOptions}
              disabled={isViewing || loadingParents}
              helperText="Select a parent category to create a subcategory, or leave empty for a root category"
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="icon"
              label="Icon (Optional)"
              placeholder="Ex: home, hammer, computer, heart"
              helperText="Icon name or class for display purposes"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Description (Optional)"
              placeholder="Briefly describe this category..."
              rows={4}
              readOnly={isViewing}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default CategoryModal;