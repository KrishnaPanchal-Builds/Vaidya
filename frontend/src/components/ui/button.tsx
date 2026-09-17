import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base: consistent typography, transitions, focus states, disabled
  [
    'inline-flex items-center justify-center gap-2 font-medium select-none',
    'transition-colors transition-shadow',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:pointer-events-none',
    'active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      variant: {
        // Deep Medicinal Teal — primary clinical actions
        primary:
          'bg-brand text-white hover:bg-brand-dim shadow-xs hover:shadow-sm',
        // White surface with border — secondary choices
        secondary:
          'bg-surface text-text-primary border border-border hover:border-border-strong hover:bg-surface-subtle shadow-xs',
        // Sage mist — contextual or currently-selected state
        mist:
          'bg-brand-mist text-brand border border-brand-mist hover:bg-brand-mist-subtle',
        // Ghost — low-weight inline actions
        ghost:
          'bg-transparent text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
        // Outline — brand-colored bordered button
        outline:
          'bg-transparent text-brand border border-brand hover:bg-brand-mist',
        // Destructive — emergency or irreversible actions
        destructive:
          'bg-critical text-white hover:opacity-90 shadow-xs',
        // AYUSH teal — Ayurvedic workflow actions
        ayush:
          'bg-ayush text-white hover:opacity-90 shadow-xs',
        // Highlight copper — human-centered or celebration actions (use sparingly)
        highlight:
          'bg-highlight text-white hover:bg-highlight-dim shadow-xs',
      },
      size: {
        xs:      'h-7 px-2.5 text-xs rounded-sm',
        sm:      'h-8 px-3 text-sm rounded',
        md:      'h-9 px-4 text-sm rounded',
        lg:      'h-11 px-5 text-[15px] rounded-md',
        xl:      'h-12 px-6 text-[15px] rounded-lg',
        // Patient / kiosk — large touch targets (min 52px)
        patient: 'h-[52px] px-6 text-base rounded-lg',
        full:    'h-[52px] w-full px-6 text-base rounded-lg',
        // Icon-only variants
        'icon-sm': 'h-8 w-8 rounded',
        'icon-md': 'h-9 w-9 rounded',
        'icon-lg': 'h-10 w-10 rounded-md',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, loading, children, disabled, ...props }, ref) => {
    const isSpinning = isLoading || loading
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isSpinning}
        aria-busy={isSpinning}
        {...props}
      >
        {isSpinning ? (
          <svg
            className="processing-arc h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="40"
              strokeDashoffset="15"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
