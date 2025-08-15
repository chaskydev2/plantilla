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
        toastify.error('Se requiere un ID de usuario');
        return;
      }
      if (isEditing) {
        const response = await ItemService.update(
          userId,
          initialData!.id, 
          data
        );
        toastify.success(response.message || 'Formación académica actualizada');
      } else {
        const response = await ItemService.create(
          userId,
          data
        );
        toastify.success(response.message || 'Formación académica creada');
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
      title={isEditing ? 'Editar experiencia profesional' : 'Agregar experiencia profesional'}
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
            label="Empresa/Institución"
            placeholder="Ej: GEOBOL, Empresa Topográfica Boliviana, Consultoría Independiente"
          />
          
          <InputField
            name="company_location"
            label="Ubicación (Ciudad/Departamento)"
            placeholder="Ej: La Paz, Santa Cruz, Cochabamba"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="start_date"
              label="Fecha de inicio"
              type="date"
              placeholder="Inicio de labores"
            />

            <InputField
              name="end_date"
              label="Fecha de conclusión"
              type="date"
              placeholder="Fin de labores (dejar vacío si actual)"
            />
          </div>

          <InputField
            name="position"
            label="Cargo/Función"
            placeholder="Ej: Topógrafo de campo, Jefe de levantamiento, Responsable de catastro"
          />

          <TextAreaField
            name="responsibilities"
            label="Tareas realizadas (especialización)"
            placeholder="Ej: Levantamientos topográficos con estación total, delimitación catastral rural, replanteo de obras civiles, uso de drones para fotogrametría"
            rows={4}
          />
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default WorkExperienceModal;