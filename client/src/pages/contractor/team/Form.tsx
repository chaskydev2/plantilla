import { useEffect, useState } from 'react';
import * as yup from 'yup';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import { InputField } from '@/components/form-field';
import { toastify } from '@/core/utils/toastify';
import { createTeamMember, searchContractorsByName } from '@/core/services/contractor/contractor.service';

interface FormValues {
  member_user_id: number | string;
  status: 'pending';
  compania?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leaderUserId: number | null;
  onCreated: () => void;
}

function getUserIdFromLocalStorage(): number | null {
  try {
    const raw = localStorage.getItem('user_data');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id ?? parsed?.user?.id ?? null;
  } catch {
    return null;
  }
}

const defaultValues: FormValues = {
  member_user_id: '',
  status: 'pending',
  compania: '',
};

const validationSchema = yup.object({
  member_user_id: yup
    .string()
    .required('Ingresa el ID del miembro'),
  status: yup
    .string()
    .oneOf(['pending'])
    .required(),
  compania: yup
    .string()
    .max(255)
    .optional(),
});

const TeamMemberForm = ({ isOpen, onClose, leaderUserId, onCreated }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; name: string; email?: string }>>([]);
  const [searching, setSearching] = useState(false);

  const resolvedLeaderId = leaderUserId ?? getUserIdFromLocalStorage();

  useEffect(() => {
    if (!isOpen) {
      setValues(defaultValues);
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]);

  // Búsqueda reactiva mientras se escribe con pequeño debounce
  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      void handleSearch(term);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async () => {
    if (!resolvedLeaderId) {
      toastify.error('No se encontró el líder');
      return;
    }
    if (!values.member_user_id) {
      toastify.error('Ingresa el ID del miembro');
      return;
    }

    setSubmitting(true);
    try {
      await createTeamMember({
        leader_user_id: resolvedLeaderId,
        member_user_id: Number(values.member_user_id),
        status: 'pending',
        compania: values.compania?.trim() || undefined,
      });

      console.log();
      toastify.success('Miembro agregado');
      onCreated();
      onClose();
      setValues(defaultValues);
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || 'Error al agregar miembro');
    } finally {
      setSubmitting(false);
    }
  };

  // Sin auto-guardar: solo selecciona/parcea el ID
  const handleSelectOption = (val: string) => {
    setSearchTerm(val);
    const idPart = val.split(' - ')[0];
    if (idPart && !Number.isNaN(Number(idPart))) {
      setValues(prev => ({ ...prev, member_user_id: idPart }));
    } else if (!Number.isNaN(Number(val))) {
      setValues(prev => ({ ...prev, member_user_id: val }));
    } else {
      setValues(prev => ({ ...prev, member_user_id: '' }));
    }
  };

  const handleSearch = async (term?: string) => {
    const query = (term ?? searchTerm).trim();
    if (!query) return;
    setSearching(true);
    try {
      const res = await searchContractorsByName(query, 10);
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      const mapped = list.map((c: any) => ({
        id: c?.user?.id ?? c?.id,
        name: c?.user?.name ?? c?.name ?? 'Sin nombre',
        email: c?.user?.email ?? c?.email,
      }));
      setSearchResults(mapped);
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || 'Error al buscar contratistas');
    } finally {
      setSearching(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar miembro"
      size="sm"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        className="w-full"
        renderActions={false}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Buscar contratista</label>
            <div className="flex gap-2 items-center">
              <input
                list="contractor-options"
                className="input flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                placeholder="Escribe el nombre (mín. 2 letras)"
                value={searchTerm}
                onChange={(e) => handleSelectOption(e.target.value)}
              />
              {searching && <span className="loading loading-spinner loading-sm self-center" />}
            </div>
            <datalist id="contractor-options">
              {searchResults.map((c) => {
                const label = `${c.id} - ${c.name}${c.email ? ` (${c.email})` : ''}`;
                return <option key={c.id} value={label} />;
              })}
            </datalist>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Estado</label>
            <div className="input bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-500">
              Pendiente (predeterminado)
            </div>
          </div>
          <InputField
            name="compania"
            label="Compañía (opcional)"
            placeholder="Nombre de la compañía"
            value={values.compania}
            onChange={(e) => setValues({ ...values, compania: e.target.value })}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
            {submitting && <span className="loading loading-spinner loading-sm" />}
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default TeamMemberForm;
