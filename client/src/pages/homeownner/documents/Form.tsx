import React, { useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { toastify } from "@/core/utils/toastify";
import type { AttributeHomeowner as IItemResource } from "@/pages/admin/attribute-homeowner/types";
import { AttributeHomeownerService as ItemService } from "@/core/services/homeowner/attributeHomeowner.service";

type Props = {
	viewFile: string | null;
	viewItem: IItemResource | null;
	setViewFile: React.Dispatch<React.SetStateAction<string | null>>;
	setViewItem: React.Dispatch<React.SetStateAction<IItemResource | null>>;
	fetchItems: () => void;
	isProcessing: boolean;
	setIsProcessing: (v: boolean) => void;
};

const getLocalUrl = (url: string | null | undefined) => {
	if (!url) return "";
	if (/^https?:\/\//i.test(url)) return url;
	const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
	return `${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}/${cleanUrl}`;
};

const AttributeHomeownerModal: React.FC<Props> = ({
	viewFile,
	viewItem,
	setViewFile,
	setViewItem,
	fetchItems,
	isProcessing,
	setIsProcessing,
}) => {
	const [comentario, setComentario] = useState<string>(viewItem?.coment || "");
	const [savingComentario, setSavingComentario] = useState(false);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		setComentario(viewItem?.coment || "");
	}, [viewItem]);

	const handleSaveComentario = async () => {
		if (!viewItem) return;
		setSavingComentario(true);
		try {
			const response = await ItemService.updateComentario(viewItem.id, comentario);
			if (response.success) {
				toastify.success("Comentario guardado");
				fetchItems();
			} else {
				toastify.error(response.message || "Error al guardar comentario");
			}
		} catch (err: any) {
			toastify.error(err?.response?.data?.message || err?.message || "Error al guardar comentario");
		} finally {
			setSavingComentario(false);
		}
	};

	const handleStatusToggle = async (newStatus: boolean) => {
		if (!viewItem) return;
		setViewItem((prev) => (prev ? { ...prev, status: newStatus } : prev));
		try {
			setIsProcessing(true);
			const response = await ItemService.updateStatus(viewItem.id, newStatus);
			if (response.success) {
				toastify.success("Estado actualizado");
				fetchItems();
			} else {
				toastify.error(response.message || "Error al cambiar estado");
			}
		} catch (err: any) {
			toastify.error(err?.response?.data?.message || err?.message || "Error al cambiar estado");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleUpload = async (file: File) => {
		if (!viewItem?.id || !viewItem.homeowner_id || !viewItem.attribute_id) return;
		const formData = new FormData();
		formData.append("homeowner_id", String(viewItem.homeowner_id));
		formData.append("attribute_id", String(viewItem.attribute_id));
		formData.append("value", file);
		setUploading(true);
		try {
			const res = await ItemService.updateDocument(viewItem.id, formData as any);
			if (res.success) {
				toastify.success(res.message || "Documento actualizado");
				fetchItems();
			} else {
				toastify.error(res.message || "Error al actualizar documento");
			}
		} catch (err: any) {
			toastify.error(err?.response?.data?.message || err?.message || "Error al actualizar documento");
		} finally {
			setUploading(false);
		}
	};

	const renderContent = () => (
		<div className="w-full flex flex-col gap-4">
			{viewItem && (
				<div className="flex items-center gap-3">
					<span
						className={`px-3 py-1 rounded-full text-xs font-bold ${viewItem.status ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
					>
						{viewItem.status ? "Activo" : "Desactivado"}
					</span>
					<label className="flex items-center gap-2 text-sm">
						<span>Desactivado</span>
						<input
							type="checkbox"
							className="toggle toggle-success"
							checked={!!viewItem.status}
							onChange={(e) => handleStatusToggle(e.target.checked)}
							disabled={isProcessing}
						/>
						<span>Activo</span>
					</label>
				</div>
			)}

			{viewFile && /\.(jpg|jpeg|png|gif)$/i.test(viewFile) && (
				<img src={getLocalUrl(viewFile)} alt="Documento" className="max-w-full max-h-[60vh] mx-auto" />
			)}

			{viewFile && /\.pdf$/i.test(viewFile) && (
				<iframe
					src={getLocalUrl(viewFile)}
					title="Documento PDF"
					className="w-full h-[60vh] border rounded"
				/>
			)}

			{viewFile && (
				<a
					href={getLocalUrl(viewFile)}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 underline"
				>
					Abrir / Descargar archivo
				</a>
			)}

			<div className="flex flex-col gap-2">
				<label className="font-semibold text-sm">Comentario</label>
				<textarea
					className="textarea textarea-bordered w-full"
					value={comentario}
					onChange={(e) => setComentario(e.target.value)}
					rows={3}
					disabled={savingComentario || isProcessing}
				/>
				<div className="flex justify-end">
					<button
						className="btn btn-primary"
						onClick={handleSaveComentario}
						disabled={savingComentario || isProcessing}
					>
						{savingComentario ? "Guardando..." : "Guardar comentario"}
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<label className="font-semibold text-sm">Actualizar documento</label>
				<input
					type="file"
					accept="application/pdf,image/jpeg,image/png,image/jpg"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) handleUpload(file);
					}}
					disabled={uploading || isProcessing}
					className="file-input file-input-bordered w-full"
				/>
			</div>
		</div>
	);

	return (
		<Modal
			isOpen={!!viewFile}
			onClose={() => {
				setViewFile(null);
				setViewItem(null);
			}}
			title="Archivo enviado"
			size="lg"
		>
			{viewFile ? renderContent() : null}
		</Modal>
	);
};

export default AttributeHomeownerModal;
