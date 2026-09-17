import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Card — Clinical surface hierarchy Level 2.
 *
 * Use for related groups of content.
 * Keep nested cards to a maximum of one level deep.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-lg shadow-xs',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-3.5 border-b border-border',
        className
      )}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-3.5 border-t border-border bg-surface-subtle',
        className
      )}
      {...props}
    />
  )
}
