import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text-meta)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5',
            'text-[var(--color-text-page-title)] placeholder-[var(--color-text-meta)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)]/30',
            'transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--color-danger)]/50 focus:ring-[var(--color-danger)]/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
