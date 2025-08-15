import { toast, type ToastOptions } from 'react-toastify';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  text: string;
  type?: NotificationType;
  timeout?: number;
}

export function showNotification({ text, type = 'success', timeout = 3000 }: NotificationOptions): void {
  const options: ToastOptions = {
    type,
    autoClose: timeout
  };

  toast(text, options);
}

export const toastify = {
  success: (text: string, timeout?: number) => showNotification({ text, type: 'success', timeout }),
  error: (text: string, timeout?: number) => showNotification({ text, type: 'error', timeout }),
  warning: (text: string, timeout?: number) => showNotification({ text, type: 'warning', timeout }),
  info: (text: string, timeout?: number) => showNotification({ text, type: 'info', timeout })
};
