import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  IWorkExperienceCreateRequest as ICreateRequest, 
  IWorkExperienceUpdateRequest as IUpdateRequest, 
  IWorkExperience as IItemResponse 
} from '@/core/types/IWorkExperience';
import { 
  profileStoreSchema as storeSchema, 
  profileUpdateSchema as updateSchema 
} from './validation';
import { WorkExperienceService as ItemService } from '@/core/services/auth/work-experience.service';
import { toastify } from '@/core/utils/toastify';

interface WorkExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  userId?: string | number | null;
}

const WorkExperienceModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  userId = null,
}: WorkExperienceModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? {
        company_name: initialData.company_name || '',
        company_location: initialData.company_location || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        position: initialData.position || '',
        responsibilities: initialData.responsibilities || '',
      }
    : {
        company_name: '',
        company_location: '',
        start_date: '',
        end_date: '',
        position: '',
        responsibilities: '',
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
        toastify.success(response.message || 'Work experience updated');
      } else {
        const response = await ItemService.create(
          userId,
          data
        );
        toastify.success(response.message || 'Work experience created');
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
      title={isEditing ? 'Edit work experience' : 'Add work experience'}
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
            name="company_name"
            label="Company/Institution"
            placeholder="E.g.: GEOBOL, Bolivian Topographic Company, Independent Consulting"
          />
          
          <InputField
            name="company_location"
            label="Location (City/Department)"
            placeholder="E.g.: La Paz, Santa Cruz, Cochabamba"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="start_date"
              label="Start date"
              type="date"
              placeholder="Start of work"
            />

            <InputField
              name="end_date"
              label="End date"
              type="date"
              placeholder="End of work (leave empty if current)"
            />
          </div>

          <InputField
            name="position"
            label="Position/Role"
            placeholder="E.g.: Field surveyor, Survey chief, Cadastre manager"
          />

          <TextAreaField
            name="responsibilities"
            label="Main responsibilities (specialization)"
            placeholder="E.g.: Topographic surveys with total station, rural cadastral delimitation, civil works staking, drone use for photogrammetry"
            rows={4}
          />
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default WorkExperienceModal;