import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  IAcademicCreateRequest as ICreateRequest, 
  IAcademicUpdateRequest as IUpdateRequest, 
  IAcademic as IItemResponse 
} from '@/core/types/IAcademicTraining';
import { 
  profileStoreSchema as storeSchema, 
  profileUpdateSchema as updateSchema 
} from './validation';
import { AcademicTrainingService as ItemService } from '@/core/services/auth/academictraining.service';
import { toastify } from '@/core/utils/toastify';

interface AcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  userId?: string | number | null;
}

const AcademicModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  userId = null,
}: AcademicModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? {
        professional_title: initialData.professional_title || '',
        academic_degree: initialData.academic_degree || '',
        graduated_from: initialData.graduated_from || '',
        relevant_certifications: initialData.relevant_certifications || '',
        graduation_date: initialData.graduation_date || '',
        degree_date: initialData.degree_date || '',
      }
    : {
        professional_title: '',
        academic_degree: '',
        graduated_from: '',
        relevant_certifications: '',
        graduation_date: '',
        degree_date: '',
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
      title={isEditing ? 'Editar formación académica' : 'Agregar formación académica'}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="space-y-4">
          <InputField
            name="professional_title"
            label="Título profesional"
            placeholder="Ej: Ingeniero en Geodesia y Topografia"
          />

          <InputField
            name="academic_degree"
            label="Grado académico"
            placeholder="Ej: Licenciatura, Técnico Medio"
          />

          <InputField
            name="graduated_from"
            label="Titulado de la institución"
            placeholder="Ej: Universidad Latinoamericana"
          />

          <TextAreaField
            name="relevant_certifications"
            label="Certificaciones relevantes"
            placeholder="Ej: Certificación en ... (nombre de la certificación)"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="graduation_date"
              label="Fecha de egreso"
              type="date"
            />

            <InputField
              name="degree_date"
              label="Fecha de obtención del título"
              type="date"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default AcademicModal;