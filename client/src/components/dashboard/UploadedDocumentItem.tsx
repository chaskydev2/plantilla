import React from "react";

interface UploadedDocumentItemProps {
  item: any;
  allRequirementsUploaded: boolean;
  getDocumentUrl: (value: string) => string;
  setPdfViewerUrl: (url: string | null) => void;
}

const UploadedDocumentItem: React.FC<UploadedDocumentItemProps> = ({
  item,
  allRequirementsUploaded,
  getDocumentUrl,
  setPdfViewerUrl,
}) => {
  // Determinar estatus y comentario
  const status = item.status || item.estado || item.state || "Sin estado";
  const comment = item.comment || item.comentario || item.observation || "";
  const hasComment = !!comment && comment.trim() !== "";

  return (
    <li className="flex flex-col md:flex-row md:items-center gap-2 text-base text-gray-700 dark:text-yellow-100 border-b border-gray-200 dark:border-gray-700 pb-2">
      <div className="flex items-center gap-2 flex-1">
        <span className="material-icons text-yellow-400">insert_drive_file</span>
        <span className="font-semibold">{item.attribute?.name || item.attribute_id || item.name}:</span>
        {item.value && !allRequirementsUploaded ? (
          <button
            type="button"
            onClick={() => setPdfViewerUrl(getDocumentUrl(item.value))}
            className="underline text-blue-600 ml-2"
          >
            Ver documento
          </button>
        ) : null}
        {item.value && allRequirementsUploaded ? (
          <span className="ml-2 px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 text-xs font-bold">
            Pendiente de revisión
          </span>
        ) : <span className="ml-2 text-sm text-gray-500">—</span>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={
          status === "Aprobado" || status === "aprobado" || status === "approved"
            ? "badge badge-success"
            : status === "Rechazado" || status === "rechazado" || status === "rejected"
              ? "badge badge-danger"
              : "badge badge-secondary"
        }>
          {status}
        </span>
        {hasComment ? (
          <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
            Comentario: {comment}
          </span>
        ) : (
          <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-bold">
            Sin comentario
          </span>
        )}
      </div>
    </li>
  );
};

export default UploadedDocumentItem;
