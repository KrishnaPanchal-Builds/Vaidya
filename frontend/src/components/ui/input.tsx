import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  hint?: string
  error?: string
  size?: 'md' | 'lg' | 'patient'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, size = 'md', id, ...props }, ref) => {
    const heightClass =
      size === 'patient' ? 'h-[52px] text-base rounded-xl' :
      size === 'lg'      ? 'h-11 text-[15px] rounded-xl' :
                           'h-9 text-[13.5px] rounded-lg'

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-bold text-text-primary tracking-tight"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3.5 border bg-white text-text-primary',
            'border-[#DFE8F1] shadow-2xs',
            'placeholder:text-text-muted',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#2365B5]/20 focus:border-[#2365B5]',
            error
              ? 'border-critical focus:border-critical focus:ring-critical/15 bg-critical-subtle/30'
              : 'hover:border-[#CBD8E5]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-dim',
            'read-only:bg-surface-subtle read-only:text-text-secondary',
            heightClass,
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` :
            hint  ? `${inputId}-hint`  : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[12px] text-critical-text font-medium flex items-center gap-1"
            role="alert"
          >
            <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4z"/>
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-[12px] text-text-muted">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
