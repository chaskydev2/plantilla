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
  { value: 'equipment', label: 'Equipos topográficos' },
  { value: 'software', label: 'Software especializado' },
  { value: 'technical', label: 'Habilidades tecnicas' },
];

const skillLevelOptions = [
  { value: 'Básico', label: 'Básico' },
  { value: 'Intermedio', label: 'Intermedio' },
  { value: 'Avanzado', label: 'Avanzado' },
  { value: 'Experto', label: 'Experto' },
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
        toastify.error('Se requiere un ID de usuario');
        return;
      }
      if (isEditing) {
        const response = await ItemService.update(
          userId,
          initialData!.id, 
          data
        );
        toastify.success(response.message || 'Habilidad Tecnica actualizada');
      } else {
        const response = await ItemService.create(
          userId,
          data
        );
        toastify.success(response.message || 'Habilidad Tecnica creada');
      }

      load();
      onClose();
    } catch (error: any) {
      toastify.error(
        error.response?.data?.message || 
        (isEditing ? 'Error al actualizar' : 'Error al crear')
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar habilidad técnica' : 'Agregar habilidad técnica'}
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
            label='Tipo de habilidad'
            name="skill_type"
            options={typeSkillOptions}
            valueKey="value"
            labelKey="label"
          />
          
          <InputField
            name="skill_name"
            label="Nombre de la habilidad"
            placeholder="Ej: Manejo de estación total, Uso de AutoCAD Civil 3D, Nivelación geométrica"
          />
          
          <SelectField
            label='Nivel de dominio'
            name="skill_level"
            options={skillLevelOptions}
            valueKey="value"
            labelKey="label"
          />

          <TextAreaField
            name="description"
            label="Descripción detallada"
            placeholder="Ej: Descripción de la habilidad técnica, años de experiencia, proyectos relevantes"
            rows={4}
          />
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default TechnicalSkillModal;