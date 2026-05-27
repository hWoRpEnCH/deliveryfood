'use client';

type AlertType = 'success' | 'error';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const styles: Record<AlertType, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
};

export function Alert({ type, message, onClose }: AlertProps) {
  if (!message) return null;
  return (
    <div
      className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
    >
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-4 font-bold">
          ×
        </button>
      )}
    </div>
  );
}
