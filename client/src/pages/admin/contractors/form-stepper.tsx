import { InputField, SelectField, UserSearchField, CheckboxField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IContractorForm as ICreateRequest,
  IContractorForm as IUpdateRequest,
  IContractor as IItemResponse
} from '@/core/types/IContractor';
import { ContractStatus, ContractStatusLabels } from '@/core/types/IContractor';
import { ContractorService as ItemService } from '@/core/services/contractor/contractor.service';
import { toastify } from '@/core/utils/toastify';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import Stepper from '@/components/common/Stepper';
import * as yup from "yup";

// Esquemas de validación por paso
const step1Schema = yup.object().shape({
  user_id: yup.number().required("El usuario es requerido"),
  company_name: yup.string().required("El nombre de la empresa es requerido"),
  license_number: yup.string().required("El número de licencia es requerido"),
  service_area: yup.string().required("El área de servicio es requerida"),
  is_insured: yup.boolean().default(false),
  average_rating: yup.number().min(0).max(5).default(0),
});

const step2Schema = yup.object().shape({
  address_line1: yup.string().optional(),
  address_line2: yup.string().optional(),
  city: yup.string().optional(),
  state_code: yup.string().optional(),
  preferred_zip: yup.string().optional(),
  country_code: yup.string().required("El código de país es requerido"),
  lat: yup.number().optional(),
  lng: yup.number().optional(),
  mobile_number: yup.string().optional(),
  phone_number: yup.string().optional(),
});

const step3Schema = yup.object().shape({
  has_driving_license: yup.boolean().default(false),
  driving_license_category: yup.string().optional(),
  linkedin_url: yup.string().url().optional(),
  portfolio_url: yup.string().url().optional(),
});

const step4Schema = yup.object().shape({
  affiliation_date: yup.date().optional(),
  approval_date: yup.date().optional(),
  contract_status: yup.string().required("El estado del contrato es requerido"),
});

const steps = [
  { id: 1, title: 'Usuario y Empresa', description: 'Información básica' },
  { id: 2, title: 'Ubicación y Contacto', description: 'Dirección y contacto' },
  { id: 3, title: 'Información Profesional', description: 'Licencias y portafolio' },
  { id: 4, title: 'Contrato', description: 'Fechas y estado' },
];

interface ContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const ContractorModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: ContractorModalProps) => {
  const isEditing = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);

  type FormValues = ICreateRequest | IUpdateRequest;

  // Función para aplanar los datos del contratista para el formulario
  const flattenContractorData = (contractor: IItemResponse): ICreateRequest => {
    return {
      user_id: contractor.user_id,
      preferred_zip: contractor.address?.preferred_zip || '',
      address_line1: contractor.address?.address_line1 || '',
      address_line2: contractor.address?.address_line2 || '',
      city: contractor.address?.city || '',
      company_name: contractor.company_info?.company_name || '',
      license_number: contractor.company_info?.license_number || '',
      is_insured: contractor.company_info?.is_insured || false,
      service_area: contractor.company_info?.service_area || '',
      average_rating: contractor.company_info?.average_rating || 0,
      state_code: contractor.address?.state_code || '',
      country_code: contractor.address?.country_code || 'US',
      lat: contractor.location?.lat || undefined,
      lng: contractor.location?.lng || undefined,
      mobile_number: contractor.contact?.mobile_number || '',
      phone_number: contractor.contact?.phone_number || '',
      has_driving_license: contractor.professional?.has_driving_license || false,
      driving_license_category: contractor.professional?.driving_license_category || '',
      linkedin_url: contractor.contact?.linkedin_url || '',
      portfolio_url: contractor.contact?.portfolio_url || '',
      affiliation_date: contractor.contract?.affiliation_date || '',
      approval_date: contractor.contract?.approval_date || '',
      contract_status: contractor.contract?.contract_status || ContractStatus.PENDING,
    };
  };

  const defaultValues: FormValues = isEditing && initialData
    ? flattenContractorData(initialData)
    : {
        user_id: 0,
        preferred_zip: '',
        address_line1: '',
        address_line2: '',
        city: '',
        company_name: '',
        license_number: '',
        is_insured: false,
        service_area: '',
        average_rating: 0,
        state_code: '',
        country_code: 'US',
        lat: undefined,
        lng: undefined,
        mobile_number: '',
        phone_number: '',
        has_driving_license: false,
        driving_license_category: '',
        linkedin_url: '',
        portfolio_url: '',
        affiliation_date: '',
        approval_date: '',
        contract_status: ContractStatus.PENDING,
      };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== '' && value !== undefined)
    );

    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.user_id, cleanData as Partial<IUpdateRequest>);
        toastify.success(response.message || 'Trabajador actualizado');
        onClose();
        load();
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        toastify.success(response.message || 'Trabajador creado');
        onClose();
        load();
      }
    } catch (error: any) {
      toastify.error(error.response?.data?.message || 'Error al guardar el trabajador');
    }
  };

  const getValidationSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      default: return step1Schema;
    }
  };

  const nextStep = async () => {
    // Validar el paso actual antes de avanzar
    const schema = getValidationSchema();
    try {
      // Aquí se validaría con el contexto del formulario
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toastify.error('Por favor, completa todos los campos requeridos');
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

  const statusOptions = [
    { value: ContractStatus.PENDING, label: ContractStatusLabels[ContractStatus.PENDING] },
    { value: ContractStatus.APPROVED, label: ContractStatusLabels[ContractStatus.APPROVED] },
    { value: ContractStatus.REJECTED, label: ContractStatusLabels[ContractStatus.REJECTED] },
    { value: ContractStatus.SUSPENDED, label: ContractStatusLabels[ContractStatus.SUSPENDED] },
  ];

  const countryOptions = [
    { value: 'US', label: 'Estados Unidos' },
    { value: 'MX', label: 'México' },
    { value: 'CA', label: 'Canadá' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Usuario */}
            {!isEditing && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Usuario</h3>
                <UserSearchField
                  name="user_id"
                  label="Usuario"
                  placeholder="Buscar usuario por nombre o email..."
                  required
                />
              </div>
            )}

            {/* Información de la empresa */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información de la Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="company_name"
                  label="Nombre de la empresa"
                  placeholder="Ej: Construcciones ABC"
                  required
                />
                <InputField
                  name="license_number"
                  label="Número de licencia"
                  placeholder="Ej: LIC-123456"
                  required
                />
                <InputField
                  name="service_area"
                  label="Área de servicio"
                  placeholder="Ej: Miami-Dade County"
                  required
                />
                <InputField
                  name="average_rating"
                  label="Calificación promedio"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0.0"
                />
                <div className="md:col-span-2">
                  <CheckboxField
                    name="is_insured"
                    label="Está asegurado"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Dirección */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="address_line1"
                  label="Dirección línea 1"
                  placeholder="Ej: 123 Main Street"
                />
                <InputField
                  name="address_line2"
                  label="Dirección línea 2"
                  placeholder="Ej: Apt 4B"
                />
                <InputField
                  name="city"
                  label="Ciudad"
                  placeholder="Ej: Miami"
                />
                <InputField
                  name="state_code"
                  label="Código de estado"
                  placeholder="Ej: FL"
                />
                <InputField
                  name="preferred_zip"
                  label="Código postal"
                  placeholder="Ej: 33101"
                />
                <SelectField
                  name="country_code"
                  label="País"
                  options={countryOptions}
                  required
                />
              </div>
            </div>

            {/* Coordenadas GPS */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Coordenadas GPS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="mobile_number"
                  label="Número de celular"
                  placeholder="Ej: +1 (555) 123-4567"
                />
                <InputField
                  name="phone_number"
                  label="Número de teléfono"
                  placeholder="Ej: +1 (555) 987-6543"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Información Profesional */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información Profesional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField
                  name="has_driving_license"
                  label="Tiene licencia de conducir"
                />
                <InputField
                  name="driving_license_category"
                  label="Categoría de licencia"
                  placeholder="Ej: A, B, C"
                />
              </div>
            </div>

            {/* URLs Profesionales */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Enlaces Profesionales</h3>
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  name="linkedin_url"
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/..."
                />
                <InputField
                  name="portfolio_url"
                  label="Portfolio URL"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Información del Contrato */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información del Contrato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="affiliation_date"
                  label="Fecha de afiliación"
                  type="date"
                />
                <InputField
                  name="approval_date"
                  label="Fecha de aprobación"
                  type="date"
                />
                <div className="md:col-span-2">
                  <SelectField
                    name="contract_status"
                    label="Estado del contrato"
                    options={statusOptions}
                    required
                  />
                </div>
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
      title={isEditing ? 'Editar Trabajador' : 'Nuevo Trabajador'}
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
                  {isEditing ? 'Actualizar Trabajador' : 'Crear Trabajador'}
                </button>
              )}
            </div>
          </div>
        </FormProviderWrapper>
      </div>
    </Modal>
  );
};

export default ContractorModal;