import { InputField, TextAreaField, SwitchField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { 
  IPersonalInformationRequest as ICreateRequest,
  IProfile as IItemResponse 
} from '@/core/types/IProfile';
import { userStoreSchema as storeSchema } from './validation';
import { ProfileService as ItemService } from '@/core/services/auth/profile.service';
import { toastify } from '@/core/utils/toastify';
import { useModal } from '@/core/hooks/useModal';
import { useWatch } from 'react-hook-form';
import { Edit } from 'lucide-react';

interface ModalProps {
  initialData?: IItemResponse | null;
  load: () => void;
}

const PersonalInformationFormModal = ({ initialData = null, load }: ModalProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  
  const defaultValues: ICreateRequest = {
    ci: initialData?.ci || '',
    address: initialData?.address || '',
    mobile_number: initialData?.mobile_number || '',
    phone_number: initialData?.phone_number || null,
    linkedin_url: initialData?.linkedin_url || null,
    portfolio_url: initialData?.portfolio_url || null,
    professional_summary: initialData?.professional_summary || null,
    travel_availability: initialData?.travel_availability || false,
    has_driving_license: initialData?.has_driving_license || false,
    driving_license_category: initialData?.driving_license_category || null,
  };

  const handleSubmit = async (data: ICreateRequest) => {
    try {
      const response = await ItemService.updatePersonalInformation(
        initialData?.id || '', 
        data
      );
      load();
      toastify.success(response.message || 'Información personal actualizada');
      closeModal();
    } catch (error: any) {
      toastify.error(error.message || 'Error al actualizar la información personal');
    }
  };

  const LicenseCategoryField = () => {
    const hasLicense = useWatch({ name: 'has_driving_license' });
    return hasLicense ? (
      <InputField
        name="driving_license_category"
        label="Categoría de licencia"
        placeholder="Ej: A, B, C, etc."
        required
      />
    ) : null;
  };

  return (
    <>
      {isOpen ? (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title="Editar Información Personal"
          size="lg"
        >
          <FormProviderWrapper
            onSubmit={handleSubmit}
            validationSchema={storeSchema}
            defaultValues={defaultValues}
            mode={'edit'}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="ci"
                label="Carnet de Identidad"
                placeholder="Ej: 1234567"
              />
              
              <InputField
                name="address"
                label="Dirección"
                placeholder="Ej: Av. Siempre Viva 123"
              />
              
              <InputField
                name="mobile_number"
                label="Teléfono Móvil"
                placeholder="Ej: 70012345"
              />
              
              <InputField
                name="phone_number"
                label="Teléfono Fijo (Opcional)"
                placeholder="Ej: 2212345"
              />
              
              <InputField
                name="linkedin_url"
                label="Perfil de LinkedIn (Opcional)"
                placeholder="Ej: https://linkedin.com/in/tu-perfil"
              />
              
              <InputField
                name="portfolio_url"
                label="Portafolio (Opcional)"
                placeholder="Ej: https://tusitio.com"
              />
            </div>
            
            <TextAreaField
              name="professional_summary"
              label="Resumen Profesional (Opcional)"
              placeholder="Describe tu experiencia profesional"
              rows={4}
              helperText="Máximo 500 caracteres"
            />
            
            <SwitchField
              name="travel_availability"
              label="Disponibilidad para viajar"
            />
              
            <SwitchField
              name="has_driving_license"
              label="Posee licencia de conducir"
            />
              
            <LicenseCategoryField />
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

export default PersonalInformationFormModal;