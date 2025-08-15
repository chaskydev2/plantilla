import { InputField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  IRolCreateRequest as ICreateRequest, 
  IRolUpdateRequest as IUpdateRequest, 
  IRolResponse as IItemResponse 
} from '@/core/types/IRol';
import { 
  rolStoreSchema as storeSchema, 
  rolUpdateSchema as updateSchema
} from './validation';
import { RolService as ItemService } from '@/core/services/rol/rol.service';
import { toastify } from '@/core/utils/toastify';

interface RolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const RolModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: RolModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = 
    {
        name: initialData?.name || '',
    };

  const validationSchema = isEditing ? updateSchema : storeSchema;

  const handleSubmit = async (data: FormValues) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value != null)
      );

      if (isEditing) {
        const response = await ItemService.update(
          initialData!.id, 
          cleanData as IUpdateRequest
        );
        load();
        toastify.success(response.message || 'Item actualizado');
      } else {
        const response = await ItemService.create(
          cleanData as ICreateRequest
        );
        load();
        toastify.success(response.message || 'Item creado');
      }

      onClose();
    } catch (error: any) {
      toastify.error(
        error.response?.data?.message || 
        (isEditing ? 'Error al actualizar' : 'Error al crear')
      );
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Rol' : 'Nuevo Rol'}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <InputField
              name="name"
              label="Nombre rol"
              placeholder="Ingrese el nombre del rol"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default RolModal;