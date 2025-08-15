import { InputField, TextAreaField, SelectField, InputFileField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IAnnouncementCreateRequest as ICreateRequest,
  IAnnouncementUpdateRequest as IUpdateRequest,
  IAnnouncement as IItemResponse
} from '@/core/types/IAnnouncement';
import { AnnouncementService as ItemService } from '@/core/services/announcement/announcement.service';
import { toastify } from '@/core/utils/toastify';
import useAuth from '@/core/hooks/useAuth';
import {
  announcementStoreSchema as storeSchema,
  announcementUpdateSchema as updateSchema
} from './validation';
import { formatDateTimeForInput } from '@/core/utils/dateUtils';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const AnnouncementModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: AnnouncementModalProps) => {
  const { user } = useAuth();
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      title: initialData?.title || '',
      content: initialData?.content || '',
      start_date: initialData?.start_date ? formatDateTimeForInput(initialData.start_date) : '',
      image: initialData?.image || '',
      type: initialData?.type || '',
      visible_until: initialData?.visible_until ? formatDateTimeForInput(initialData.visible_until) : '',
      published_by: initialData?.published_by || '',
    }
    : {
      title: '',
      content: '',
      start_date: '',
      image: '',
      type: '',
      visible_until: '',
      published_by: user?.id || '',
    };

  const announcementTypes = [
    { value: 'general', label: 'General' },
    { value: 'important', label: 'Importante' },
    { value: 'news', label: 'Noticia' },
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
      title={isEditing ? 'Editar Comunicado' : 'Nuevo Comunicado'}
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
              name="title"
              label="Título"
              placeholder="Ej: Titulo del comunicado..."
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="content"
              label="Contenido"
              placeholder="Detalles del comunicado..."
              rows={4}
            />
          </div>

          <div className="col-span-1">
            <InputFileField
              name="image"
              label="Imagen"
              helperText="Formatos: JPG, PNG (Max. 4MB)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1">
            <div>
              <InputField
                name="start_date"
                label="Fecha de inicio"
                type="datetime-local"
              />
            </div>
            <div>
              <InputField
                name="visible_until"
                label="Visible hasta"
                type="datetime-local"
              />
            </div>
          </div>

          <div className="col-span-1">
            <SelectField
              name="type"
              label="Tipo de comunicado"
              options={announcementTypes}
              required
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default AnnouncementModal;