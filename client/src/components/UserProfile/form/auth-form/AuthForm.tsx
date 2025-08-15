import { InputField, PasswordField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  IProfileRequest as ICreateRequest,
  IProfile as IItemResponse 
} from '@/core/types/IProfile';
import { 
  userStoreSchema as storeSchema, 
} from './validation';
import { ProfileService as ItemService } from '@/core/services/auth/profile.service';
import { toastify } from '@/core/utils/toastify';
import { useModal } from '@/core/hooks/useModal';
import { Edit } from 'lucide-react';

interface ProfileModalProps {
  initialData?: IItemResponse | null;
  load: () => void;
}

const AuthFormModal = ({
  initialData = null,
  load,
}: ProfileModalProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  const defaultValues: ICreateRequest = {
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    password: '',
  };

  const handleSubmit = async (data: ICreateRequest) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
  
    if ('password' in cleanData && !cleanData.password) {
      delete cleanData.password;
    }
    
    await ItemService.update(
      initialData?.id || '',
      cleanData as ICreateRequest
    ).then((response) => {
      load();
      toastify.success(response.message || 'Item actualizado');
    }).catch((error) => {
      toastify.error(error.message || 'Error al actualizar el item');
    }).finally(() => {
      closeModal();
    });
  }

  return (
    <>
      {isOpen ? (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={'Editar Usuario'}
          size="lg"
        >
          <FormProviderWrapper
            onSubmit={handleSubmit}
            validationSchema={storeSchema}
            defaultValues={defaultValues}
            mode={'edit'}
            className="w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField
                  name="email"
                  label="Correo electrónico"
                  type="email"
                  placeholder="Ej: usuario@ejemplo.com"
                />
              </div>
              
              <InputField
                name="first_name"
                label="Nombre"
                placeholder="Ej: Juan"
              />

              <InputField
                name="last_name"
                label="Apellido"
                placeholder="Ej: Pérez"
              />

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <PasswordField
                  name="password"
                  label={'Nueva contraseña (opcional)'}
                  placeholder={'Dejar vacío para no cambiar'}
                />

                <PasswordField
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
          </FormProviderWrapper>
        </Modal> 
      ) : (
        <button
          onClick={openModal}
          className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <Edit className="w-5 h-5" />
          Editar
        </button>
      )}
    </>
  );
};

export default AuthFormModal;