import { useTranslation } from 'react-i18next';
import { InputField, TextAreaField, SwitchField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IEventCreateRequest as ICreateRequest,
  IEventUpdateRequest as IUpdateRequest,
  IEvent as IItemResponse
} from '@/core/types/IEvent';
import { EventService as ItemService } from '@/core/services/event/event.service';
import { toastify } from '@/core/utils/toastify';
import {
  eventStoreSchema as storeSchema,
  eventUpdateSchema as updateSchema
} from './validation';
import { formatDateTimeForInput } from '@/core/utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const EventModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: EventModalProps) => {
  const { t } = useTranslation();
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      name: initialData?.name || '',
      event_type_id: initialData?.event_type_id || '',
      start_date: initialData?.start_date ? formatDateTimeForInput(initialData.start_date) : '',
      end_date: initialData?.end_date ? formatDateTimeForInput(initialData.end_date) : '',
      location: initialData?.location || '',
      generates_fine: initialData?.generates_fine || false,
    }
    : {
      name: '',
      event_type_id: '',
      start_date: '',
      end_date: '',
      location: '',
      generates_fine: false,
    };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || t('admin.messages.saveSuccess'));
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || t('admin.messages.saveSuccess'));
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
      title={isEditing ? t('admin.events.editEvent') : t('admin.events.addEvent')}
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
              label={t('admin.events.name')}
              placeholder={t('admin.events.namePlaceholder')}
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="event_type_id"
              label={t('admin.events.type')}
              placeholder={t('admin.events.typePlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1">
            <div>
              <InputField
                name="start_date"
                label={t('admin.events.startDate')}
                type="datetime-local"
              />
            </div>
            <div>
              <InputField
                name="end_date"
                label={t('admin.events.endDate')}
                type="datetime-local"
              />
            </div>
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="location"
              label={t('admin.events.location')}
              placeholder={t('admin.events.locationPlaceholder')}
              rows={4}
            />
          </div>

          <div className="col-span-1">
            <SwitchField
              name="generates_fine"
              label={t('admin.events.generatesFine')}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default EventModal;