import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  INewsletterCreateRequest as ICreateRequest,
  INewsletterUpdateRequest as IUpdateRequest,
  INewsletter as IItemResponse
} from '@/core/types/INewsletter';
import { NewsletterService as ItemService } from '@/core/services/newsletter/newsletter.service';
import { toastify } from '@/core/utils/toastify';
import {
  NewsletterStoreSchema as storeSchema,
  NewsletterUpdateSchema as updateSchema
} from './validation';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const NewsletterModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: NewsletterModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      name: initialData?.name || '',
      email: initialData?.email || '',
      subject: initialData?.subject || '',
      content: initialData?.content || '',
    }
    : {
      name: '',
      email: '',
      subject: '',
      content: '',
    };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Boletín actualizado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Boletín creado');
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
      title={isEditing ? 'Editar consulta' : 'Nuevo consulta'}
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
              label="Nombre del consulta"
              placeholder="Ej: consulta mensual, Noticias trimestrales..."
            />
          </div>

          <div>
            <InputField
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="contacto@organizacion.com"
            />
          </div>

          <div>
            <InputField
              name="subject"
              label="Asunto"
              placeholder="Ej: Novedades del mes, Eventos importantes..."
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              name="content"
              label="Contenido"
              placeholder="Redacte el contenido completo del consulta..."
              rows={6}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default NewsletterModal;