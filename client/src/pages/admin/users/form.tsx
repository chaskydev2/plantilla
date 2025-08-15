import { InputField, PasswordField, SelectField, SwitchField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  IUserCreateRequest as ICreateRequest, 
  IUserUpdateRequest as IUpdateRequest, 
  IUserResponse as IItemResponse 
} from '@/core/types/IUser';
import { 
  userStoreSchema as storeSchema, 
  userUpdateSchema as updateSchema 
} from './validation';
import { UserService as ItemService } from '@/core/services/user/user.service';
import { toastify } from '@/core/utils/toastify';
import type { IRolResponse } from '@/core/types/IRol';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  roles: IRolResponse[]
}

const UserModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  roles = []
}: UserModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        password: '',
        role_id : initialData.role_id || '',
        edit_profile: initialData.edit_profile || false,
      }
    : {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_id: '',
        edit_profile: false,
      };

  const validationSchema = isEditing ? updateSchema : storeSchema;

  const handleSubmit = async (data: FormValues) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value != null)
      );

      if (isEditing) {
        if ('password' in cleanData && !cleanData.password) {
          delete cleanData.password;
        }
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
      title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
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
          <div className="md:col-span-1">
            <InputField
              name="first_name"
              label="Nombre completo"
              placeholder="Ej: Juan Pérez"
            />
          </div>
          
          <div className="md:col-span-1">
            <InputField
              name="last_name"
              label="Apellido completo"
              placeholder="Ej: Salazar Gómez"
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="Ej: usuario@ejemplo.com"
              disabled={isEditing}
            />
          </div>

          <div className="md:col-span-1">
            <PasswordField
              name="password"
              label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Mínimo 5 caracteres'}
            />
          </div>

          {!isEditing && (
            <div className="md:col-span-1">
              <PasswordField
                name="confirmPassword"
                label="Confirmar contraseña"
                placeholder="Repite la contraseña"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <SelectField
              label='Seleccionar el rol'
              name="role_id"
              options={roles}
              valueKey="id"
              labelKey="name"
            />
          </div>

          <div className="md:col-span-2">
            <SwitchField
              name="edit_profile"
              label="Aprobar edición de perfil"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default UserModal;