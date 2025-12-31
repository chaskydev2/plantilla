import React, { useState } from 'react';
import Modal from '@/components/modal/Modal';
import { toastify } from '@/core/utils/toastify';
import type { AttributeContractor as IItemResource } from '@/pages/admin/attribute-contractor/types';
import { AttributeContractorService as ItemService } from '@/core/services/attribute-contractor/attribute-contractor.service';
import axios from '@/core/config/axios';

const h = React.createElement;

// Servicio para actualizar el comentario
const updateComentario = async (id: number, comentario: string) => {
  const res = await axios.patch(`/v1/attribute-contractors/${id}/comentario`, { comentario });
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
};

// ===============================
//  PROPS CORREGIDOS  🔥 IMPORTANTE
// ===============================
interface AttributeContractorModalProps {
  viewFile: string | null;
  viewItem: IItemResource | null;
  setViewFile: React.Dispatch<React.SetStateAction<string | null>>;
  setViewItem: React.Dispatch<React.SetStateAction<IItemResource | null>>; // <-- CORREGIDO
  fetchItems: () => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

const getLocalUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `http://localhost:8080/${cleanUrl}`;
};

const AttributeContractorModal: React.FC<AttributeContractorModalProps> = ({
  viewFile,
  viewItem,
  setViewFile,
  setViewItem,
  fetchItems,
  isProcessing,
  setIsProcessing,
}) => {

  const [comentario, setComentario] = useState<string>(viewItem?.coment || '');
  const [savingComentario, setSavingComentario] = useState(false);

  React.useEffect(() => {
    setComentario(viewItem?.coment || '');
  }, [viewItem]);

  // ===============================
  // GUARDAR COMENTARIO
  // ===============================
  const handleSaveComentario = async () => {
    if (!viewItem) return;

    setSavingComentario(true);
    try {
      const response = await updateComentario(viewItem.id, comentario);
      if (response.success) {
        toastify.success('Comentario guardado');
        fetchItems();
      } else {
        toastify.error(response.message || 'Error al guardar comentario');
      }
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || err?.message || 'Error al guardar comentario');
    } finally {
      setSavingComentario(false);
    }
  };

  // ===============================
  // CONTENIDO DEL MODAL (NO JSX)
  // ===============================
  const renderModalContent = (): React.ReactElement =>
    h(
      'div',
      { className: 'w-full flex flex-col items-center justify-center gap-4' },

      // Estado Activo / Inactivo
      viewItem &&
        h(
          'div',
          { className: 'mb-2 flex items-center gap-3' },
          h(
            'span',
            {
              className:
                'px-3 py-1 rounded-full text-xs font-bold ' +
                (viewItem.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'),
            },
            viewItem.status ? 'Activo' : 'Desactivado'
          ),
          h(
            'label',
            { className: 'flex items-center cursor-pointer select-none' },

            h('span', { className: 'mr-2 text-xs' }, 'Desactivado'),

            // ===============================
            //  TOGGLE DE ESTADO (CORREGIDO)
            // ===============================
            h('input', {
              type: 'checkbox',
              className: 'toggle toggle-success',
              checked: !!viewItem.status,

              onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                const newStatus = e.target.checked;

                // 🔥 AHORA SÍ: setViewItem acepta funciones
                setViewItem(prev =>
                  prev ? { ...prev, status: newStatus } : prev
                );

                try {
                  setIsProcessing(true);
                  const response = await ItemService.updateStatus(viewItem.id, newStatus);
                  if (response.success) {
                    toastify.success('Estado actualizado');
                    fetchItems();
                  } else {
                    toastify.error(response.message || 'Error al cambiar estado');
                  }
                } catch (err: any) {
                  toastify.error(err?.response?.data?.message || err?.message || 'Error al cambiar estado');
                } finally {
                  setIsProcessing(false);
                }
              },

              disabled: isProcessing,
            }),

            h('span', { className: 'ml-2 text-xs' }, 'Activo')
          )
        ),

      // Vista de imagen
      (/\.(jpg|jpeg|png|gif)$/i.test(viewFile ?? '') &&
        h('img', {
          src: getLocalUrl(viewFile),
          alt: 'Documento',
          className: 'max-w-full max-h-[60vh] mx-auto'
        })),

      // Vista PDF
      (/\.pdf$/i.test(viewFile ?? '') &&
        h('iframe', {
          src: getLocalUrl(viewFile),
          title: 'Documento PDF',
          className: 'w-full h-[60vh] border rounded',
        })),

      // Link descarga/visualización
      (viewFile &&
        h(
          'a',
          {
            href: getLocalUrl(viewFile),
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'text-blue-600 underline'
          },
          'Abrir / Descargar archivo'
        )
      ),

      // ===============================
      // CAMPO COMENTARIO
      // ===============================
      viewItem &&
        h(
          'div',
          { className: 'w-full flex flex-col gap-2 mt-4' },

          h('label', { className: 'font-semibold text-sm' }, 'Comentario'),

          h('textarea', {
            className: 'textarea textarea-bordered w-full',
            value: comentario,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setComentario(e.target.value),
            rows: 3,
            disabled: savingComentario || isProcessing,
          }),

          h(
            'button',
            {
              className: 'btn btn-primary self-end',
              onClick: handleSaveComentario,
              disabled: savingComentario || isProcessing,
            },
            savingComentario ? 'Guardando...' : 'Guardar comentario'
          )
        )
    );

  // ===============================
  // PROPS DEL MODAL (CON CHILDREN)
  // ===============================
  const modalProps: React.ComponentProps<typeof Modal> = {
    isOpen: !!viewFile,
    onClose: () => {
      setViewFile(null);
      setViewItem(null);
    },
    title: 'Archivo enviado',
    size: 'lg',
    children: renderModalContent(),
  };

  return viewFile ? h(Modal, modalProps) : null;
};

export default AttributeContractorModal;