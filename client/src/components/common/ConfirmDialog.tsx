import type{ ReactNode } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isProcessing = false,
  variant = 'primary'
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-error',
    success: 'btn-success'
  };

  return (
    <dialog open={isOpen} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{message}</div>
        <div className="modal-action">
          <button 
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${variantClasses[variant]}`}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="loading loading-spinner"></span>
            ) : confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
};