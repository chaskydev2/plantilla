import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IContactCreateRequest as ICreateRequest,
  IContactUpdateRequest as IUpdateRequest,
  IContact as IItemResponse
} from '@/core/types/IContact';
import { ContactService as ItemService } from '@/core/services/contact/contact.service';
import { toastify } from '@/core/utils/toastify';
import {
  ContactStoreSchema as storeSchema,
  ContactUpdateSchema as updateSchema
} from './validation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const ContactModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: ContactModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      address: initialData?.address || '',
      mobile_number: initialData?.mobile_number || '',
      phone_number: initialData?.phone_number || '',
      email: initialData?.email || '',
      business_hours: initialData?.business_hours || '',
    }
    : {
      address: '',
      mobile_number: '',
      phone_number: '',
      email: '',
      business_hours: '',
    };

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
      title={isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}
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
              name="address"
              label="Dirección"
              placeholder="Ej: Dirección del recinto..."
            />
          </div>

          <div>
            <InputField
              name="mobile_number"
              label="Número de celular"
              placeholder="Ej: 0991234567"
            />
          </div>

          <div>
            <InputField
              name="phone_number"
              label="Número de teléfono"
              placeholder="Ej: 022345678"
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              name="email"
              label="Correo electrónico"
              placeholder="Ej: contacto@empresa.com"
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              name="business_hours"
              label="Horario laboral"
              placeholder="Ej: Lunes a Viernes: 08:00 - 17:00"
              rows={4}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default ContactModal;