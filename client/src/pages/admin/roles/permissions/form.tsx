import { SelectField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  IRolPermissionResponse as IItemResponse 
} from '@/core/types/IRol';
import { 
  rolPermissionStoreSchema as storeSchema, 
} from './validation';
import { RolService as ItemService } from '@/core/services/rol/rol.service';
import { toastify } from '@/core/utils/toastify';
import type { IPermissionResponse } from '@/core/types/IPermission';
import { useMemo } from 'react';
import { useParams } from 'react-router';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  permissions: IPermissionResponse[]
}

const UserModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  permissions = []
}: UserModalProps) => {
  const isEditing = !!initialData;

  const { id } = useParams();

  const availablePermissions = useMemo(() => {
    const selectedPermissionIds = initialData?.permissions?.map(p => p.name) || [];
    return permissions.filter(permission => 
      !selectedPermissionIds.includes(permission.name)
    );
  }, [permissions, initialData]);

  const defaultValues: { permission: string } = {
    permission: '',
  };

  const validationSchema = storeSchema;

  const handleSubmit = async (data: { permission: string }) => {
    const names = initialData?.permissions?.map(p => p.name) || [];
    const request = {
      permissions: [...names, data.permission]
    };
    await ItemService.createPermissions(id, request)
      .then(response => {
        load();
        toastify.success(response.message || 'Item creado');
      })
      .catch(error => toastify.error(error.message))
      .finally(() => onClose());
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
        className="w-full max-w-md"
      >
        <SelectField
          name="permission"
          options={availablePermissions}
          valueKey="name"
          labelKey="name"
        />
      </FormProviderWrapper>
    </Modal>
  );
};

export default UserModal;