import { InputField, TextAreaField, SwitchField, SelectField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  ICourseCreateRequest as ICreateRequest,
  ICourseUpdateRequest as IUpdateRequest,
  ICourse as IItemResponse
} from '@/core/types/ICourse';
import { CourseService as ItemService } from '@/core/services/course/course.service';
import { toastify } from '@/core/utils/toastify';
import {
  courseStoreSchema as storeSchema,
  courseUpdateSchema as updateSchema
} from './validation';
import { formatDateTimeForInput } from '@/core/utils/dateUtils';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const CourseModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: CourseModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      name: initialData?.name || '',
      instructor_id: initialData?.instructor_id || '',
      start_date: initialData?.start_date ? formatDateTimeForInput(initialData.start_date) : '',
      end_date: initialData?.end_date ? formatDateTimeForInput(initialData.end_date) : '',
      modality: initialData?.modality || '',
      location: initialData?.location || '',
      cost: initialData?.cost || 0,
      max_capacity: initialData?.max_capacity || 0,
      status: initialData?.status || '',
      has_certificate: initialData?.has_certificate || false,
      attendance_tracking: initialData?.attendance_tracking || false,
    }
    : {
      name: '',
      instructor_id: '',
      start_date: '',
      end_date: '',
      modality: 'presential',
      location: '',
      cost: 0,
      max_capacity: 0,
      status: '',
      has_certificate: false,
      attendance_tracking: false,
    };

  const modalityOptions = [
    { value: 'presential', label: 'Presencial' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Híbrido' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Borrador' },
    { value: 'active', label: 'Activo' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Item actualizado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Item creado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Curso' : 'Nuevo Curso'}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={isEditing ? updateSchema : storeSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField
              name="name"
              label="Nombre del curso"
              placeholder="Ej: Nombre curso"
            />
          </div>

          <div>
            <InputField
              name="instructor_id"
              label="ID del Instructor"
              placeholder="Ej: INSTR-001"
            />
          </div>

          <div>
            <SelectField
              name="modality"
              label="Modalidad"
              options={modalityOptions}
            />
          </div>

          <div>
            <InputField
              name="start_date"
              label="Fecha de inicio"
              type="date"
            />
          </div>

          <div>
            <InputField
              name="end_date"
              label="Fecha de fin"
              type="date"
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              name="location"
              label="Ubicación"
              placeholder="Ej: Aula 201 o Zoom Meeting"
            />
          </div>

          <div>
            <InputField
              name="cost"
              label="Costo (Bs)"
              type="number"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <InputField
              name="max_capacity"
              label="Capacidad máxima"
              type="number"
              min="1"
            />
          </div>

          <div>
            <SelectField
              name="status"
              label="Estado"
              options={statusOptions}
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <SwitchField
              name="has_certificate"
              label="Incluye certificado"
            />
            <SwitchField
              name="attendance_tracking"
              label="Control de asistencia"
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              name="description"
              label="Descripción adicional"
              placeholder="Detalles sobre el curso..."
              rows={3}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default CourseModal;