import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3
  variant?: 'default' | 'critical' | 'verified' | 'focused' | 'warning'
}

/**
 * Card — Single Source of Truth Clinical Surface System
 * Level 1: Page background / embedded neutral
 * Level 2: Primary content (white/near-white, low-contrast border, subtle shadow)
 * Level 3: Secondary/inset info (faint blue-gray tint, border, no shadow)
 *
 * Semantic Overlays:
 * - critical: restrained red left-border accent
 * - verified: restrained green left-border accent
 * - focused: clean blue outline / elevation
 * - warning: restrained amber left-border accent
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ level = 2, variant = 'default', className, ...props }, ref) => {
    const levelClasses = {
      1: 'bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-2xl',
      2: 'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs',
      3: 'bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-xl',
    }[level]

    const variantClasses = {
      default: '',
      critical: 'border-l-4 border-l-[var(--color-critical)]',
      verified: 'border-l-4 border-l-[var(--color-verified)]',
      warning: 'border-l-4 border-l-[var(--color-warning)]',
      focused: 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)] shadow-xs',
    }[variant]

    return (
      <div
        ref={ref}
        className={cn(levelClasses, variantClasses, className)}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between gap-3',
        className
      )}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)]',
        className
      )}
      {...props}
    />
  )
}


