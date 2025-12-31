import React, { useState } from 'react';
import { JobCreatorService } from '@/core/services/job/jobCreator.service';
import { toastify } from '@/core/utils/toastify';
import type { IJob, IJobCreateRequest } from '@/core/types/IJob';

interface CreateJobFormProps {
  creatorId: number | null;
  onCreated: () => void;
  jobToEdit?: IJob | null;
  onEditClosed?: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({ creatorId, onCreated, jobToEdit, onEditClosed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [jobDate, setJobDate] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = !!jobToEdit;

  React.useEffect(() => {
    if (jobToEdit) {
      setIsOpen(true);
      setTitle(jobToEdit.title || '');
      setDescription(jobToEdit.description || '');
      setLocation(jobToEdit.location || '');
      setServiceType(jobToEdit.service_type || '');
      setAmountPaid(jobToEdit.amount_paid != null ? String(jobToEdit.amount_paid) : '');
      setJobDate(jobToEdit.job_date || '');
      setUrl(jobToEdit.url || '');
      setFile(null);
    }
  }, [jobToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSizeBytes = 5 * 1024 * 1024;

    if (!allowedTypes.includes(selected.type)) {
      toastify.error('Formato de imagen no permitido. Usa jpg, png, gif o webp.');
      e.target.value = '';
      return;
    }

    if (selected.size > maxSizeBytes) {
      toastify.error('La imagen debe pesar menos de 5MB.');
      e.target.value = '';
      return;
    }

    setFile(selected);
  };

  const reset = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setServiceType('');
    setAmountPaid('');
    setJobDate('');
    setUrl('');
    setFile(null);
    if (onEditClosed) onEditClosed();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorId) {
      toastify.error('No se encontró el usuario autenticado.');
      return;
    }
    if (!title || !location || !serviceType) {
      toastify.error('Título, ubicación y tipo de servicio son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const normalizedUrl = url.trim() ? url.trim() : undefined;
      const payload: IJobCreateRequest = {
        id_creator: creatorId,
        title,
        description: description || undefined,
        location,
        service_type: serviceType,
        url: normalizedUrl,
        amount_paid: amountPaid ? Number(amountPaid) : undefined,
        job_date: jobDate || undefined,
        is_active: false,
      };
      const res = isEdit && jobToEdit?.id
        ? await JobCreatorService.update(jobToEdit.id, payload)
        : await JobCreatorService.createWithFile(payload, file || undefined);
      console.log('🔧', res);
      if (res?.success) {
        toastify.success(isEdit ? 'Trabajo actualizado' : 'Trabajo creado');
        reset();
        setIsOpen(false);
        onCreated();
      } else {
        toastify.error(res?.message || 'Error al Crear trabajo realizado');
      }
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || err?.message || 'Error al Crear trabajo realizado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-primary mb-4" onClick={() => setIsOpen(true)}>
        Nuevo trabajo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
              aria-label="Cerrar"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-2">{isEdit ? 'Editar trabajo' : 'Crear trabajo realizado'}</h3>
            {isEdit && <p className="text-sm text-gray-500 mb-2">Editando #{jobToEdit?.id}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Título *</label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Ej. Reparación de tubería"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Tipo de servicio *</label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Plomería, electricidad, etc."
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Ubicación *</label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Ciudad o zona"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Fecha</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={jobDate}
                    onChange={(e) => setJobDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Monto pagado</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">URL (opcional)</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="https://"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Descripción</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Detalles del trabajo realizado"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Imagen (jpg, png, gif, webp, máx 5MB)</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Crear trabajo realizado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateJobForm;
