import { InputField, PasswordField, SwitchField, MultiSelectField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        password: '',
        role_ids: (initialData as any)?.roles?.map((role: any) => role.id) || [],
        edit_profile: initialData.edit_profile || false,
      }
    : {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_ids: [],
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
      title={isEditing ? t("admin.users.editUser") : t("admin.users.addUser")}
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
              label={t("admin.users.firstName")}
              placeholder={t("admin.users.firstNamePlaceholder")}
            />
          </div>
          
          <div className="md:col-span-1">
            <InputField
              name="last_name"
              label={t("admin.users.lastName")}
              placeholder={t("admin.users.lastNamePlaceholder")}
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              name="email"
              label={t("admin.users.email")}
              type="email"
              placeholder={t("admin.users.emailPlaceholder")}
              disabled={isEditing}
            />
          </div>

          <div className="md:col-span-1">
            <PasswordField
              name="password"
              label={isEditing ? t("admin.users.newPassword") : t("admin.users.password")}
              placeholder={isEditing ? t("admin.users.newPasswordPlaceholder") : t("admin.users.passwordPlaceholder")}
            />
          </div>

          {!isEditing && (
            <div className="md:col-span-1">
              <PasswordField
                name="confirmPassword"
                label={t("admin.users.confirmPassword")}
                placeholder={t("admin.users.confirmPasswordPlaceholder")}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <MultiSelectField
              label={t("admin.users.selectRoles")}
              name="role_ids"
              options={roles}
              valueKey="id"
              labelKey="name"
              placeholder={t("admin.users.selectRoles")}
              helperText="Puedes seleccionar múltiples roles"
            />
          </div>

          <div className="md:col-span-2">
            <SwitchField
              name="edit_profile"
              label={t("admin.users.editProfile")}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default UserModal;