import React, { useState } from 'react';
import Modal from '@/components/modal/Modal';
import { toastify } from '@/core/utils/toastify';
import type { AttributeContractor as IItemResource } from '@/pages/admin/attribute-contractor/types';
import { AttributeContractorUploadService } from '@/core/services/contractor/attributeContractorUpload.service';
import { Upload } from 'lucide-react';

const h = React.createElement;

interface AttributeContractorModalProps {
  viewFile: string | null;
  viewItem: IItemResource | null;
  setViewFile: React.Dispatch<React.SetStateAction<string | null>>;
  setViewItem: React.Dispatch<React.SetStateAction<IItemResource | null>>;
  fetchItems: () => void;
  isProcessing: boolean;
}

const getLocalUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `http://localhost:8000/${cleanUrl}`;
};

const AttributeContractorModal: React.FC<AttributeContractorModalProps> = ({
  viewFile,
  viewItem,
  setViewFile,
  setViewItem,
  fetchItems,
  isProcessing,
}) => {

  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Manejar la subida de nuevo documento
     // Manejar la subida de nuevo documento
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !viewItem) return;

    // Validar que los campos requeridos existan
    if (!viewItem.contractor_id || !viewItem.attribute_id) {
      toastify.error('Datos incompletos: No se puede actualizar el documento');
      return;
    }

    setUploadingFile(true);
    try {
      const response = await AttributeContractorUploadService.updateDocument(
        viewItem.id,
        viewItem.contractor_id,
        viewItem.attribute_id,
        file
      );

      console.log('✅ Documento actualizado:', response);
      if (response.success) {
        toastify.success('Documento actualizado correctamente');
        fetchItems();
        // Actualizar el viewFile con la nueva URL
        if (response.data?.value) {
          setViewFile(response.data.value);
          setViewItem(prev => prev ? { ...prev, value: response.data.value } : prev);
        }
      } else {
        toastify.error(response.message || 'Error al actualizar el documento');
      }
    } catch (err: any) {
      toastify.error(err.message || 'Error al actualizar el documento');
    } finally {
      setUploadingFile(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderModalContent = (): React.ReactElement =>
    h(
      'div',
      { className: 'w-full flex flex-col items-center justify-center gap-4' },

      // ===============================
      // ESTADO: APROBADO O NO (SOLO LECTURA)
      // ===============================
      viewItem &&
        h(
          'div',
          { className: 'mb-2 flex items-center justify-center' },
          h(
            'span',
            {
              className:
                'px-4 py-2 rounded-full text-sm font-bold ' +
                (viewItem.status ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'),
            },
            viewItem.status ? '✓ Aprobado' : '⏳ No aprobado'
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
      // BOTÓN PARA EDITAR DOCUMENTO
      // ===============================
      viewItem &&
        h(
          'div',
          { className: 'w-full flex flex-col gap-2 mt-4' },
          
          h(
            'button',
            {
              className: 'btn btn-primary w-full',
              onClick: () => fileInputRef.current?.click(),
              disabled: uploadingFile || isProcessing,
            },
            h('span', { className: 'flex items-center gap-2 justify-center' },
              h(Upload, { className: 'w-4 h-4' }),
              uploadingFile ? 'Subiendo...' : 'Cambiar Documento'
            )
          ),

          // Input oculto para el archivo
          h('input', {
            ref: fileInputRef,
            type: 'file',
            accept: '.pdf,.jpg,.jpeg,.png,.gif',
            className: 'hidden',
            onChange: handleFileUpload,
            disabled: uploadingFile || isProcessing,
          }),

          h('p', { className: 'text-xs text-gray-500 text-center' }, 
            'Formatos permitidos: PDF, JPG, PNG, GIF (máx. 10MB)'
          )
        ),

      // ===============================
      // COMENTARIO (SOLO LECTURA)
      // ===============================
      viewItem && viewItem.coment &&
        h(
          'div',
          { className: 'w-full flex flex-col gap-2 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg' },

          h('label', { className: 'font-semibold text-sm' }, 'Comentario:'),

          h('p', { 
            className: 'text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap'
          }, viewItem.coment || 'Sin comentarios')
        )
    );

  const modalProps: React.ComponentProps<typeof Modal> = {
    isOpen: !!viewFile,
    onClose: () => {
      setViewFile(null);
      setViewItem(null);
    },
    title: 'Documento',
    size: 'lg',
    children: renderModalContent(),
  };

  return viewFile ? h(Modal, modalProps) : null;
};

export default AttributeContractorModal;