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
      title={isEditing ? 'Editar referencia laboral' : 'Agregar referencia laboral'}
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
            label="Nombre del referente"
            placeholder="Ej: Ing. Juan Pérez, Arq. María Gómez"
          />
          
          <InputField
            name="company"
            label="Empresa/Institución"
            placeholder="Ej: GEOBOL, Consultoría Topográfica Andina, Municipalidad de La Paz"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="position"
              label="Cargo del referente"
              placeholder="Ej: Jefe de Topografía, Supervisor de Catastro"
            />

            <InputField
              name="phone"
              label="Teléfono de contacto"
              placeholder="Ej: +591 71234567"
              type="tel"
            />
          </div>

          <InputField
            name="email"
            label="Correo electrónico"
            placeholder="Ej: referencia@empresa.com"
            type="email"
          />

          <TextAreaField
            name="additional_notes"
            label="Observaciones adicionales"
            placeholder="Ej: Descripcion de notas adicionales"
            rows={4}
          />
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default WorkReferenceModal;