import { InputField, SelectField, UserSearchField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IContractorForm as ICreateRequest,
  IContractorForm as IUpdateRequest,
  IContractor as IItemResponse
} from '@/core/types/IContractor';
import { ContractStatus, ContractStatusLabels } from '../../../core/types/IContractor';
import { ContractorService as ItemService } from '@/core/services/contractor/contractor.service';
import { toastify } from '@/core/utils/toastify';
import * as yup from "yup";

// Esquema de validación simplificado
const contractorSchema = yup.object().shape({
  user_id: yup.number().required("El usuario es requerido"),
  company_name: yup.string().required("El nombre de la empresa es requerido"),
  license_number: yup.string().required("El número de licencia es requerido"),
  service_area: yup.string().required("El área de servicio es requerida"),
  contract_status: yup.string().required("El estado del contrato es requerido"),
});

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Trabajador' : 'Nuevo Trabajador'}
      size="xl"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={contractorSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 gap-8">
          {/* Sección: Usuario */}
          {!isEditing && (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Usuario</h3>
              <div className="grid grid-cols-1 gap-4">
                <UserSearchField
                  name="user_id"
                  label="Usuario"
                  placeholder="Buscar usuario por nombre o email..."
                  required
                />
              </div>
            </div>
          )}

          {/* Sección: Información de la Empresa */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
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
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="is_insured"
                  name="is_insured"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_insured" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  Está asegurado
                </label>
              </div>
            </div>
          </div>

          {/* Sección: Dirección */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
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

          {/* Sección: Ubicación */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
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

          {/* Sección: Contacto */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
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

          {/* Sección: Información Profesional */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información Profesional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_driving_license"
                  name="has_driving_license"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="has_driving_license" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  Tiene licencia de conducir
                </label>
              </div>
              <InputField
                name="driving_license_category"
                label="Categoría de licencia"
                placeholder="Ej: A, B, C"
              />
            </div>
          </div>

          {/* Sección: Contrato */}
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
      </FormProviderWrapper>
    </Modal>
  );
};

export default ContractorModal;