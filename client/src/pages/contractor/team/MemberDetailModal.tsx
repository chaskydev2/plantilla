import React from 'react';
import Modal from '@/components/modal/Modal';
import type { WithRelations } from './Main';

type Props = {
  item: WithRelations | null;
  onClose: () => void;
};

const MemberDetailModal: React.FC<Props> = ({ item, onClose }) => {
  if (!item) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const coords = (() => {
    const lat = (item.member as any)?.lat ?? item.member?.lat ?? item.leader?.lat ?? (item.leader as any)?.lat;
    const lng = (item.member as any)?.lng ?? item.member?.lng ?? item.leader?.lng ?? (item.leader as any)?.lng;
    if (lat == null || lng == null) return null;
    if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return null;
    return { lat: Number(lat), lng: Number(lng) };
  })();

  const mapsLink = coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : undefined;
  const embedSrc = coords && apiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${coords.lat},${coords.lng}&zoom=12&maptype=roadmap`
    : undefined;

  return (
    <Modal
      isOpen={!!item}
      onClose={onClose}
      title="Detalle del miembro"
      size="md"
    >
      <div className="space-y-4 text-sm">
        <div className="grid gap-2">
          <h4 className="font-semibold">Líder</h4>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-500">ID</span>
            <span>{item.leader_user_id}</span>
            <span className="text-gray-500">Nombre</span>
            <span>{item.leader?.user?.name || item.leader?.name || '—'}</span>
            <span className="text-gray-500">Compañía</span>
            <span>{item.leader?.company_name || '—'}</span>
            <span className="text-gray-500">Email</span>
            <span>{item.leader?.user?.email || '—'}</span>
            <span className="text-gray-500">Ciudad</span>
            <span>{item.leader?.city || '—'}</span>
            <span className="text-gray-500">Servicio</span>
            <span>{item.leader?.service_area || '—'}</span>
          </div>
        </div>
        <div className="grid gap-2">
          <h4 className="font-semibold">Miembro</h4>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-500">ID</span>
            <span>{item.member_user_id}</span>
            <span className="text-gray-500">Nombre</span>
            <span>{item.member?.user?.name || '—'}</span>
            <span className="text-gray-500">Email</span>
            <span>{item.member?.user?.email || '—'}</span>
            <span className="text-gray-500">Compañía</span>
            <span>{item.member?.company_name || item.compania || '—'}</span>
            <span className="text-gray-500">Estado</span>
            <span>{item.status || 'pending'}</span>
            <span className="text-gray-500">Servicio</span>
            <span>{(item.member as any)?.service_area || '—'}</span>
            <span className="text-gray-500">Portafolio</span>
            <span className="truncate">{(item.member as any)?.portfolio_url || '—'}</span>
            <span className="text-gray-500">Lat / Lng</span>
            <span>{coords ? `${coords.lat}, ${coords.lng}` : '—'}</span>
            {mapsLink && (
              <>
                <span className="text-gray-500">Mapa</span>
                <a
                  className="text-blue-600 underline"
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver en Google Maps
                </a>
              </>
            )}
          </div>
        </div>
        {embedSrc && (
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
            <iframe
              title="Ubicación"
              src={embedSrc}
              width="100%"
              height="260"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MemberDetailModal;