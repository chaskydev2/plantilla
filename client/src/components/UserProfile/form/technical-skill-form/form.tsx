import { InputField, TextAreaField, SelectField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  ITechnicalSkillCreateRequest as ICreateRequest, 
  ITechnicalSkillUpdateRequest as IUpdateRequest, 
  ITechnicalSkill as IItemResponse 
} from '@/core/types/ITechnicalSkill';
import { 
  profileStoreSchema as storeSchema, 
  profileUpdateSchema as updateSchema 
} from './validation';
import { TechnicalSkillService as ItemService } from '@/core/services/auth//technical-skill.service';
import { toastify } from '@/core/utils/toastify';

interface TechnicalSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  userId?: string | number | null;
}

const typeSkillOptions = [
  { value: 'equipment', label: 'Surveying equipment' },
  { value: 'software', label: 'Specialized software' },
  { value: 'technical', label: 'Technical skills' },
];

const skillLevelOptions = [
  { value: 'Basic', label: 'Basic' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
];

const TechnicalSkillModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  userId = null,
}: TechnicalSkillModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? {
        skill_type: initialData.skill_type || '',
        skill_name: initialData.skill_name || '',
        skill_level: initialData.skill_level || '',
        description: initialData.description || '',
      }
    : {
        skill_type: '',
        skill_name: '',
        skill_level: '',
        description: '',
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
        toastify.success(response.message || 'Technical skill updated');
      } else {
        const response = await ItemService.create(
          userId,
          data
        );
        toastify.success(response.message || 'Technical skill created');
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
      title={isEditing ? 'Edit technical skill' : 'Add technical skill'}
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
          <SelectField
            label='Skill type'
            name="skill_type"
            options={typeSkillOptions}
            valueKey="value"
            labelKey="label"
          />
          
          <InputField
            name="skill_name"
            label="Skill name"
            placeholder="E.g.: Total station operation, AutoCAD Civil 3D, Geometric leveling"
          />
          
          <SelectField
            label='Skill level'
            name="skill_level"
            options={skillLevelOptions}
            valueKey="value"
            labelKey="label"
          />

          <TextAreaField
            name="description"
            label="Detailed description"
            placeholder="E.g.: Description of the technical skill, years of experience, relevant projects"
            rows={4}
          />
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default TechnicalSkillModal;