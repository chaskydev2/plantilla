import { InputField, TextAreaField, InputFileField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IAgreementCreateRequest as ICreateRequest,
  IAgreementUpdateRequest as IUpdateRequest,
  IAgreement as IItemResponse
} from '@/core/types/IAgreement';
import { AgreementService as ItemService } from '@/core/services/agreement/agreement.service';
import { toastify } from '@/core/utils/toastify';
import {
  AgreementStoreSchema as storeSchema,
  AgreementUpdateSchema as updateSchema
} from './validation';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const AgreementModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: AgreementModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      name: initialData?.name || '',
      description: initialData?.description || '',
      photo: initialData?.photo || '',
    }
    : {
      name: '',
      description: '',
      photo: '',
    };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Acuerdo actualizado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Acuerdo creado');
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
      title={isEditing ? 'Editar Acuerdo' : 'Nuevo Acuerdo'}
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
              label="Nombre de la institución"
              placeholder="Ej: Universidad Nacional, Empresa XYZ..."
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Detalles del acuerdo"
              placeholder="Descripción del tipo de convenio o colaboración..."
              rows={5}
            />
          </div>

          <div className="col-span-1">
            <InputFileField
              name="photo"
              label="Documento o Fotografía del acuerdo"
              helperText="Formatos aceptados: JPG, PNG, PDF (Máx. 4MB)"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default AgreementModal;