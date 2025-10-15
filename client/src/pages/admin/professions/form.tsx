import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IProfessionCreateRequest as ICreateRequest,
  IProfessionUpdateRequest as IUpdateRequest,
  IProfession as IItemResponse
} from '@/core/types/IProfession';
import { ProfessionService as ItemService } from '@/core/services/profession/profession.service';
import { toastify } from '@/core/utils/toastify';
import {
  ProfessionStoreSchema as storeSchema,
  ProfessionUpdateSchema as updateSchema
} from './validation';

interface ProfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  mode?: 'create' | 'edit' | 'view';
}

const ProfessionModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  mode = 'create'
}: ProfessionModalProps) => {
  const isEditing = mode === 'edit';
  const isViewing = mode === 'view';
  
  console.log("Debug - Form props:", { mode, initialData, isEditing, isViewing });

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = (isEditing || isViewing)
    ? {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
    }
    : {
      name: '',
      slug: '',
      description: '',
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
        toastify.success(response.message || 'Profession updated successfully');
        onClose();
        load();
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        toastify.success(response.message || 'Profession created successfully');
        onClose();
        load();
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'An error occurred while saving the profession';
      toastify.error(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewing ? 'View Profession' : isEditing ? 'Edit Profession' : 'New Profession'}
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
              placeholder="Ex: Plumbing, Electricity, Carpentry"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="slug"
              label="Slug (Friendly URL)"
              placeholder="Ex: plumbing, electricity, carpentry (auto-generated)"
              helperText="Auto-generated based on the name if left empty"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Description (Optional)"
              placeholder="Briefly describe this profession..."
              rows={4}
              readOnly={isViewing}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default ProfessionModal;