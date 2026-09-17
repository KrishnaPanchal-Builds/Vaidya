import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3 | 4
}

/**
 * Card — Clinical surface hierarchy Level 2 (default), Level 1 (embedded), Level 3 (focused), Level 4 (overlay).
 */
export function Card({ level = 2, className, ...props }: CardProps) {
  const levelClass = {
    1: 'surface-embedded rounded-xl',
    2: 'surface-clinical-card rounded-2xl',
    3: 'surface-focused rounded-2xl',
    4: 'surface-overlay rounded-2xl',
  }[level]

  return (
    <div
      className={cn(levelClass, className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-4 border-b border-[#DFE8F1]',
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
        'px-5 py-3.5 border-t border-[#DFE8F1] bg-[#F8FAFC]',
        className
      )}
      {...props}
    />
  )
}
