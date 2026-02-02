import React, { useState } from 'react';
import Modal from '@/components/modal/Modal';
import { toastify } from '@/core/utils/toastify';
import type { AttributeHomeowner } from '@/pages/admin/attribute-homeowner/types';
import { AttributeHomeownerService as ItemService } from '@/core/services/homeowner/attributeHomeowner.service';

const h = React.createElement;

interface AttributeHomeownerModalProps {
	viewFile: string | null;
	viewItem: AttributeHomeowner | null;
	setViewFile: React.Dispatch<React.SetStateAction<string | null>>;
	setViewItem: React.Dispatch<React.SetStateAction<AttributeHomeowner | null>>;
	fetchItems: () => void;
	isProcessing: boolean;
	setIsProcessing: (value: boolean) => void;
}

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
const DEFAULT_FILE_URL = 'https://via.placeholder.com/150/cccccc/ffffff?text=File';

const getLocalUrl = (url?: string | null): string => {
	if (!url || url.trim() === '') return DEFAULT_FILE_URL;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;
	const fullUrl = `${API_BASE}/${url.replace(/^\//, '')}`;
	return fullUrl;
};

const AttributeHomeownerModal: React.FC<AttributeHomeownerModalProps> = ({
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

	const handleSaveComentario = async () => {
		if (!viewItem?.id) return;

		setSavingComentario(true);
		try {
			const response = await ItemService.updateComentario(viewItem.id, comentario);
			if (response.success) {
				toastify.success(response.message || 'Comment saved');
				fetchItems();
			} else {
				toastify.error(response.message || 'Error saving comment');
			}
		} catch (err: any) {
			toastify.error(err?.response?.data?.message || err?.message || 'Error saving comment');
		} finally {
			setSavingComentario(false);
		}
	};

	const renderModalContent = (): React.ReactElement =>
		h(
			'div',
			{ className: 'w-full flex flex-col items-center justify-center gap-4' },
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
						viewItem.status ? 'Active' : 'Disabled'
					),
					h(
						'label',
						{ className: 'flex items-center cursor-pointer select-none' },
						h('span', { className: 'mr-2 text-xs' }, 'Disabled'),
						h('input', {
							type: 'checkbox',
							className: 'toggle toggle-success',
							checked: !!viewItem.status,
							onChange: async (event: React.ChangeEvent<HTMLInputElement>) => {
								if (!viewItem?.id) return;
								const checked = event.target.checked;
								setViewItem(prev => (prev ? { ...prev, status: checked } : prev));

								try {
									setIsProcessing(true);
									const response = await ItemService.updateStatus(viewItem.id, checked);
									if (response.success) {
										toastify.success(response.message || 'Status updated');
										fetchItems();
									} else {
										toastify.error(response.message || 'Error updating status');
									}
								} catch (err: any) {
									toastify.error(err?.response?.data?.message || err?.message || 'Error updating status');
								} finally {
									setIsProcessing(false);
								}
							},
							disabled: isProcessing,
						}),
						h('span', { className: 'ml-2 text-xs' }, 'Active')
					)
				),
			/\.(jpg|jpeg|png|gif)$/i.test(viewFile ?? '') &&
				h('img', {
					src: getLocalUrl(viewFile),
					alt: 'Document',
					className: 'max-w-full max-h-[60vh] mx-auto',
				}),
			/\.pdf$/i.test(viewFile ?? '') &&
				h('iframe', {
					src: getLocalUrl(viewFile),
					title: 'PDF Document',
					className: 'w-full h-[60vh] border rounded',
				}),
			viewFile &&
				h(
					'a',
					{
						href: getLocalUrl(viewFile),
						target: '_blank',
						rel: 'noopener noreferrer',
						className: 'text-blue-600 underline',
					},
					'Open / Download file'
				),
			viewItem &&
				h(
					'div',
					{ className: 'w-full flex flex-col gap-2 mt-4' },
					h('label', { className: 'font-semibold text-sm' }, 'Comment'),
					h('textarea', {
						className: 'textarea textarea-bordered w-full',
						value: comentario,
						onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => setComentario(event.target.value),
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
						savingComentario ? 'Saving...' : 'Save comment'
					)
				)
		);

	const modalProps: React.ComponentProps<typeof Modal> = {
		isOpen: !!viewFile,
		onClose: () => {
			setViewFile(null);
			setViewItem(null);
		},
		title: 'Uploaded file',
		size: 'lg',
		children: renderModalContent(),
	};

	return viewFile ? h(Modal, modalProps) : null;
};

export default AttributeHomeownerModal;
