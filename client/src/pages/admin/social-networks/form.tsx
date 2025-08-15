import { InputField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  ISocialNetworkCreateRequest as ICreateRequest,
  ISocialNetworkUpdateRequest as IUpdateRequest,
  ISocialNetwork as IItemResponse
} from '@/core/types/ISocialNetwork';
import { SocialNetworkService as ItemService } from '@/core/services/social-network/social-network.service';
import { toastify } from '@/core/utils/toastify';
import {
  SocialNetworkStoreSchema as storeSchema,
  SocialNetworkUpdateSchema as updateSchema
} from './validation';

interface SocialNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const SocialNetworkModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: SocialNetworkModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? {
        url_facebook: initialData?.url_facebook || '',
        url_twitter: initialData?.url_twitter || '',
        url_instagram: initialData?.url_instagram || '',
        url_tiktok: initialData?.url_tiktok || '',
        url_linkedin: initialData?.url_linkedin || '',
      }
    : {
        url_facebook: '',
        url_twitter: '',
        url_instagram: '',
        url_tiktok: '',
        url_linkedin: '',
      };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );

    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.id, cleanData as IUpdateRequest);
        toastify.success(response.message || 'Red social actualizada');
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        toastify.success(response.message || 'Red social creada');
      }

      onClose();
      load();
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || 'Error inesperado');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Redes Sociales' : 'Nuevas Redes Sociales'}
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
          <div className="col-span-1">
            <InputField
              name="url_facebook"
              label="Facebook"
              placeholder="https://facebook.com/company"
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="url_twitter"
              label="Twitter"
              placeholder="https://twitter.com/company"
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="url_instagram"
              label="Instagram"
              placeholder="https://instagram.com/company"
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="url_tiktok"
              label="TikTok"
              placeholder="https://tiktok.com/company"
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              name="url_linkedin"
              label="LinkedIn"
              placeholder="https://linkedin.com/company"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default SocialNetworkModal;