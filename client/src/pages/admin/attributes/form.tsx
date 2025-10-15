import { InputField, TextAreaField, SelectField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IAttributeCreateRequest as ICreateRequest,
  IAttributeUpdateRequest as IUpdateRequest,
  IAttribute as IItemResponse
} from '@/core/types/IAttribute';
import { AttributeService as ItemService } from '@/core/services/attribute/attribute.service';
import { toastify } from '@/core/utils/toastify';
import { getRequiredForOptions } from '@/core/types/IAttribute';
import {
  AttributeStoreSchema as storeSchema,
  AttributeUpdateSchema as updateSchema
} from './validation';

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  mode?: 'create' | 'edit' | 'view';
}

const AttributeModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  mode = 'create'
}: AttributeModalProps) => {
  const isEditing = mode === 'edit';
  const isViewing = mode === 'view';
  
  console.log("Debug - Form props:", { mode, initialData, isEditing, isViewing });

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = (isEditing || isViewing)
    ? {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      required_for: initialData?.required_for || 'homeowner',
    }
    : {
      name: '',
      slug: '',
      description: '',
      required_for: 'homeowner' as const,
    };
    
  console.log("Debug - defaultValues:", defaultValues);

  const handleSubmit = async (data: FormValues) => {
    // No submit en modo view
    if (isViewing) return;
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.id, cleanData as IUpdateRequest);
        toastify.success(response.message || 'Attribute updated successfully');
        onClose();
        load();
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        toastify.success(response.message || 'Attribute created successfully');
        onClose();
        load();
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'An error occurred while saving the attribute';
      toastify.error(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewing ? 'View Attribute' : isEditing ? 'Edit Attribute' : 'New Attribute'}
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
              placeholder="Ex: Experience Years, Education Level, Certifications"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="slug"
              label="Slug (Friendly URL)"
              placeholder="Ex: experience-years, education-level (auto-generated)"
              helperText="Auto-generated based on the name if left empty"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <SelectField
              name="required_for"
              label="Required For"
              placeholder="Select who this attribute is for"
              options={getRequiredForOptions()}
              disabled={isViewing}
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Description (Optional)"
              placeholder="Briefly describe this attribute..."
              rows={4}
              readOnly={isViewing}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default AttributeModal;