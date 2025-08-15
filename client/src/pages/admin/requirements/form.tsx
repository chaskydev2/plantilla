import { InputField, TextAreaField, SelectField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IRequirementCreateRequest as ICreateRequest,
  IRequirementUpdateRequest as IUpdateRequest,
  IRequirement as IItemResponse
} from '@/core/types/IRequirement';
import { RequirementService as ItemService } from '@/core/services/requirement/requirement.service';
import { toastify } from '@/core/utils/toastify';
import {
  RequirementStoreSchema as storeSchema,
  RequirementUpdateSchema as updateSchema
} from './validation';

interface RequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const typeRequirementOptions = [
  { value: 'inscription', label: 'Inscripción' },
  { value: 'renovation', label: 'Renovación' },
  { value: 'updateinfo', label: 'Actualización de Información' },
];

const RequirementModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: RequirementModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || '',
      order: initialData?.order || 0,
    }
    : {
      title: '',
      description: '',
      type: '',
      order: 0,
    };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Requisito actualizado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Requisito creado');
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
      title={isEditing ? 'Editar Requisito' : 'Nuevo Requisito'}
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
              name="title"
              label="Título"
              placeholder="Ej: Documento de identidad, Certificado de estudios..."
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              name="description"
              label="Descripción"
              placeholder="Detalles específicos del requisito..."
              rows={4}
            />
          </div>

          <div>
            <SelectField
              label='Tipo de requisito'
              name="type"
              options={typeRequirementOptions}
              valueKey="value"
              labelKey="label"
            />
          </div>

          <div>
            <InputField
              name="order"
              label="Orden de prioridad"
              type="number"
              min="0"
              placeholder="Ej: 1, 2, 3..."
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default RequirementModal;