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
  // Normalize status, comment, and metadata coming from different API shapes
  const rawStatus = item.status ?? item.estado ?? item.state ?? item.status_name ?? 0;
  const isApproved = rawStatus === 1 || rawStatus === "1";
  const isNotApproved = rawStatus === 0 || rawStatus === "0";
  const statusLabel = isApproved ? "Approved" : isNotApproved ? "Not approved" : "No status";

  const statusClass = isApproved ? "badge badge-success" : "badge badge-danger";

  const comment = item.comment || item.coment || item.comentario || item.observation || "";
  const hasComment = !!comment && comment.trim() !== "";
  const fileName = item.value ? item.value.split("/").pop() : "";
  const createdAt = item.created_at || item.createdAt;

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
            View document
          </button>
        ) : null}
        {item.value && allRequirementsUploaded ? (
          <span className="ml-2 px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 text-xs font-bold">
            Pending review
          </span>
        ) : <span className="ml-2 text-sm text-gray-500">—</span>}
        {fileName ? (
          <span className="ml-2 text-xs text-gray-500">({fileName})</span>
        ) : null}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={statusClass}>
          {statusLabel}
        </span>
        {hasComment ? (
          <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
            Comment: {comment}
          </span>
        ) : (
          <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-bold">
            No comment
          </span>
        )}
        {createdAt ? (
          <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-semibold">
            Uploaded: {new Date(createdAt).toLocaleString()}
          </span>
        ) : null}
      </div>
    </li>
  );
};

export default UploadedDocumentItem;
