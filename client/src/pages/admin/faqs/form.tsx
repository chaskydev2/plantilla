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
          toastify.success(response.message || 'FAQ updated');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));

    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'FAQ created');
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
      title={isEditing ? 'Edit FAQ' : 'New FAQ'}
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
              label="Question"
              placeholder="E.g. How can I contact support?"
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="answer"
              label="Answer"
              placeholder="Write a clear and complete answer..."
              rows={5}
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="order"
              label="Priority order"
              type="number"
              min="0"
              placeholder="E.g. 1 (to show first)"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default FaqsModal;