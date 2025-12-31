import React from 'react';
import Modal from '@/components/modal/Modal';
import type { IJob } from '@/core/types/IJob';

type Props = {
  item: IJob | null;
  onClose: () => void;
};

const JobDetailModal: React.FC<Props> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <Modal isOpen={!!item} onClose={onClose} title="Detalle del trabajo" size="lg">
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <span className="text-gray-500">ID</span>
          <span>{item.id}</span>

          <span className="text-gray-500">Creador</span>
          <span>{item.id_creator}</span>

          <span className="text-gray-500">Propietario</span>
          <span>{item.id_homeowner ?? '—'}</span>

          <span className="text-gray-500">Título</span>
          <span>{item.title}</span>

          <span className="text-gray-500">Servicio</span>
          <span>{item.service_type}</span>

          <span className="text-gray-500">Ubicación</span>
          <span>{item.location}</span>

          <span className="text-gray-500">Fecha</span>
          <span>{item.job_date ?? '—'}</span>

          <span className="text-gray-500">Monto</span>
          <span>{item.amount_paid ?? '—'}</span>

          <span className="text-gray-500">Estado</span>
          <span>{item.status ?? (item.is_active ? 'active' : 'inactive')}</span>

          <span className="text-gray-500">URL</span>
          <span>{item.url ?? '—'}</span>

          <span className="text-gray-500">Imagen</span>
          <span className="break-all">{item.image_url ?? '—'}</span>

          <span className="text-gray-500">Comentario</span>
          <span>{item.comment ?? '—'}</span>
        </div>

        {item.image_url && (
          <div className="pt-2">
            <h4 className="font-semibold mb-1">Previsualización</h4>
            <img
              src={item.image_url.startsWith('http') ? item.image_url : `http://127.0.0.1:8000/${item.image_url}`}
              alt="Imagen del trabajo"
              className="max-h-72 w-full object-contain rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-1">Descripción</h4>
          <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {item.description || 'Sin descripción'}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default JobDetailModal;