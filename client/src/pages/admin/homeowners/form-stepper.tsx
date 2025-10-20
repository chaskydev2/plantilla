import { InputField, SelectField, UserSearchField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IHomeownerForm as ICreateRequest,
  IHomeownerForm as IUpdateRequest,
  IHomeowner as IItemResponse
} from '@/core/types/IHomeowner';
import { CountryOptions, StateOptions } from '@/core/types/IHomeowner';
import { HomeownerService as ItemService } from '@/core/services/homeowner/homeowner.service';
import { toastify } from '@/core/utils/toastify';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Stepper from '@/components/common/Stepper';
import * as yup from "yup";

// Esquemas de validación por paso
const step1Schema = yup.object().shape({
  user_id: yup.number().required("El usuario es requerido"),
});

const step2Schema = yup.object().shape({
  address_line1: yup.string().required("La dirección es requerida"),
  city: yup.string().required("La ciudad es requerida"),
  state_code: yup.string().required("El estado es requerido"),
  preferred_zip: yup.string().required("El código postal es requerido"),
  country_code: yup.string().required("El país es requerido"),
});

const step3Schema = yup.object().shape({
  address_line2: yup.string().optional(),
  lat: yup.number().optional(),
  lng: yup.number().optional(),
});

const steps = [
  { id: 1, title: 'Usuario', description: 'Selección de usuario' },
  { id: 2, title: 'Dirección Principal', description: 'Información básica de ubicación' },
  { id: 3, title: 'Detalles Adicionales', description: 'Información complementaria' },
];

interface HomeownerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const HomeownerModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: HomeownerModalProps) => {
  const isEditing = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing && initialData
    ? {
        user_id: initialData.user_id,
        preferred_zip: initialData.preferred_zip,
        address_line1: initialData.address_line1,
        address_line2: initialData.address_line2,
        city: initialData.city,
        state_code: initialData.state_code,
        country_code: initialData.country_code,
        lat: initialData.lat,
        lng: initialData.lng,
      }
    : {
        user_id: 0,
        preferred_zip: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state_code: '',
        country_code: 'US',
        lat: undefined,
        lng: undefined,
      };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== '' && value !== undefined)
    );

    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.user_id, cleanData as Partial<IUpdateRequest>);
        toastify.success(response.message || 'Propietario actualizado');
        onClose();
        load();
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        toastify.success(response.message || 'Propietario creado');
        onClose();
        load();
      }
    } catch (error: any) {
      toastify.error(error.response?.data?.message || 'Error al guardar el propietario');
    }
  };

  const getValidationSchema = (): yup.ObjectSchema<any> => {
    switch (currentStep) {
      case 1: return step1Schema as yup.ObjectSchema<any>;
      case 2: return step2Schema as yup.ObjectSchema<any>;
      case 3: return step3Schema as yup.ObjectSchema<any>;
      default: return step1Schema as yup.ObjectSchema<any>;
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Selección de Usuario</h3>
              {!isEditing && (
                <UserSearchField
                  name="user_id"
                  label="Usuario"
                  placeholder="Buscar usuario por nombre o email..."
                  required
                />
              )}
              {isEditing && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Usuario seleccionado:</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {initialData?.user?.first_name} {initialData?.user?.last_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {initialData?.user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Dirección Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    name="address_line1"
                    label="Dirección línea 1"
                    placeholder="Ej: 123 Main Street"
                    required
                  />
                </div>
                <InputField
                  name="city"
                  label="Ciudad"
                  placeholder="Ej: Miami"
                  required
                />
                <SelectField
                  name="state_code"
                  label="Estado"
                  options={StateOptions}
                  placeholder="Selecciona un estado"
                  required
                />
                <InputField
                  name="preferred_zip"
                  label="Código postal"
                  placeholder="Ej: 33101"
                  required
                />
                <SelectField
                  name="country_code"
                  label="País"
                  options={CountryOptions}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    name="address_line2"
                    label="Dirección línea 2"
                    placeholder="Ej: Apt 4B, Suite 200"
                  />
                </div>
                <InputField
                  name="lat"
                  label="Latitud"
                  type="number"
                  step="any"
                  placeholder="Ej: 25.7617"
                />
                <InputField
                  name="lng"
                  label="Longitud"
                  type="number"
                  step="any"
                  placeholder="Ej: -80.1918"
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Nota:</strong> Las coordenadas GPS son opcionales pero ayudan a mejorar la precisión de la ubicación para los servicios.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Editar Propietario' : 'Nuevo Propietario'}
      size="xl"
    >
      <div className="space-y-6">
        {/* Stepper */}
        <Stepper steps={steps} currentStep={currentStep} />

        {/* Formulario */}
        <FormProviderWrapper
          onSubmit={handleSubmit}
          validationSchema={getValidationSchema()}
          defaultValues={defaultValues}
          mode={isEditing ? 'edit' : 'create'}
          className="w-full"
        >
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <div className="flex gap-2">
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                  {isEditing ? 'Actualizar Propietario' : 'Crear Propietario'}
                </button>
              )}
            </div>
          </div>
        </FormProviderWrapper>
      </div>
    </Modal>
  );
};

export default HomeownerModal;