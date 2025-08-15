import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IFaqCreateRequest as ICreateRequest,
  IFaqUpdateRequest as IUpdateRequest,
  IFaq as IItemResponse
} from '@/core/types/IFaq';
import { FaqService as ItemService } from '@/core/services/faq/faq.service';
import { toastify } from '@/core/utils/toastify';
import {
  FaqStoreSchema as storeSchema,
  FaqUpdateSchema as updateSchema
} from '../faqs/validation';

interface FaqsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const FaqsModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: FaqsModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
      question: initialData?.question || '',
      answer: initialData?.answer || '',
      order: initialData?.order || 0,
    }
    : {
      question: '',
      answer: '',
      order: 0,
    };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Pregunta frecuente actualizada');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Pregunta frecuente creada');
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
      title={isEditing ? 'Editar Pregunta Frecuente' : 'Nueva Pregunta Frecuente'}
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
              name="question"
              label="Pregunta"
              placeholder="Ej: ¿Cómo puedo contactar al soporte técnico?"
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="answer"
              label="Respuesta"
              placeholder="Redacte una respuesta clara y completa..."
              rows={5}
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="order"
              label="Orden de prioridad"
              type="number"
              min="0"
              placeholder="Ej: 1 (para mostrar primero)"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default FaqsModal;