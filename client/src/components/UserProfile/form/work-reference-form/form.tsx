import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  IWorkReferenceCreateRequest as ICreateRequest, 
  IWorkReferenceUpdateRequest as IUpdateRequest, 
  IWorkReference as IItemResponse 
} from '@/core/types/IWorkReference';
import { 
  profileStoreSchema as storeSchema, 
  profileUpdateSchema as updateSchema 
} from './validation';
import { WorkReferenceService as ItemService } from '@/core/services/auth/work-reference.service';
import { toastify } from '@/core/utils/toastify';

interface WorkReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  userId?: string | number | null;
}

const WorkReferenceModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  userId = null,
}: WorkReferenceModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? {
        reference_name: initialData.reference_name || '',
        company: initialData.company || '',
        position: initialData.position || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        additional_notes: initialData.additional_notes || '',
      }
    : {
        reference_name: '',
        company: '',
        position: '',
        phone: '',
        email: '',
        additional_notes: '',
      };

  const validationSchema = isEditing ? updateSchema : storeSchema;

  const handleSubmit = async (data: FormValues) => {
    try {
      if (!userId) {
        toastify.error('User ID is required');
        return;
      }
      if (isEditing) {
        const response = await ItemService.update(
          userId,
          initialData!.id, 
          data
        );
        toastify.success(response.message || 'Work reference updated');
      } else {
        const response = await ItemService.create(
          userId,
          data
        );
        toastify.success(response.message || 'Work reference created');
      }

      load();
      onClose();
    } catch (error: any) {
      toastify.error(
        error.response?.data?.message || 
        (isEditing ? 'Error updating' : 'Error creating')
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit work reference' : 'Add work reference'}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 gap-4">
          <InputField
            name="reference_name"
            label="Reference name"
            placeholder="E.g.: Eng. John Smith, Arch. Mary Gomez"
          />
          
          <InputField
            name="company"
            label="Company/Institution"
            placeholder="E.g.: GEOBOL, Andean Topographic Consulting, Municipality of La Paz"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="position"
              label="Reference position"
              placeholder="E.g.: Head of Surveying, Cadastre Supervisor"
            />

            <InputField
              name="phone"
              label="Contact phone"
              placeholder="E.g.: +591 71234567"
              type="tel"
            />
          </div>

          <InputField
            name="email"
            label="Email address"
            placeholder="E.g.: reference@company.com"
            type="email"
          />

          <TextAreaField
            name="additional_notes"
            label="Additional notes"
            placeholder="E.g.: Description of additional notes"
            rows={4}
          />
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default WorkReferenceModal;