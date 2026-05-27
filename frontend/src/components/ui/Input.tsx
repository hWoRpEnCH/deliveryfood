import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ifood-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-ifood-red focus:ring-2 focus:ring-red-100 ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
