'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TabOption<T extends string = string> {
  id: T
  label: string
  nativeLabel?: string
  sublabel?: string
  icon?: React.ComponentType<{ className?: string; size?: number | string }> | React.ElementType
  badge?: string | number
  badgeVariant?: 'default' | 'critical' | 'warning' | 'verified'
}

interface SlidingSegmentedTabsProps<T extends string = string> {
  options: TabOption<T>[]
  selectedId: T
  onChange: (id: T) => void
  variant?: 'default' | 'compact' | 'large' | 'kiosk'
  fullWidth?: boolean
  className?: string
  layoutId?: string
  ariaLabel?: string
}

export function SlidingSegmentedTabs<T extends string = string>({
  options,
  selectedId,
  onChange,
  variant = 'default',
  fullWidth = false,
  className,
  layoutId = 'sliding-tab-pill',
  ariaLabel = 'Segmented Navigation',
}: SlidingSegmentedTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = options.findIndex((opt) => opt.id === selectedId)
    if (currentIndex === -1) return

    let nextIndex = currentIndex
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % options.length
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + options.length) % options.length
      e.preventDefault()
    } else if (e.key === 'Home') {
      nextIndex = 0
      e.preventDefault()
    } else if (e.key === 'End') {
      nextIndex = options.length - 1
      e.preventDefault()
    }

    if (nextIndex !== currentIndex) {
      onChange(options[nextIndex].id)
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      buttons?.[nextIndex]?.focus()
    }
  }

  // Variant size mappings matching approved Frosted Clinical Surface system
  const variantStyles = {
    compact: {
      container: 'p-1 rounded-xl',
      btn: 'px-3 py-1.5 text-[12px] font-semibold rounded-lg min-h-[34px]',
      iconSize: 13,
    },
    default: {
      container: 'p-1.5 rounded-2xl',
      btn: 'px-4 py-2 text-[13px] font-bold rounded-xl min-h-[42px]',
      iconSize: 15,
    },
    large: {
      container: 'p-2 rounded-2xl',
      btn: 'px-5 py-2.5 text-[14.5px] font-bold rounded-xl min-h-[48px]',
      iconSize: 17,
    },
    kiosk: {
      container: 'p-2 rounded-2xl',
      btn: 'px-5 py-3 text-[16px] font-extrabold rounded-xl min-h-[56px]',
      iconSize: 20,
    },
  }[variant]

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative inline-flex items-center gap-1 select-none transition-all',
        fullWidth ? 'w-full grid' : '',
        fullWidth ? `grid-cols-${options.length}` : '',
        variantStyles.container,
        className
      )}
      style={{
        background: 'linear-gradient(180deg, #F3F8FD 0%, #E8F1FA 100%)',
        border: '1px solid #D3E2F0',
        boxShadow: '0 5px 16px rgba(41, 87, 135, 0.08), 0 2px 3px rgba(41, 87, 135, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        gridTemplateColumns: fullWidth ? `repeat(${options.length}, minmax(0, 1fr))` : undefined,
      }}
    >
      {options.map((option) => {
        const isSelected = selectedId === option.id
        const Icon = option.icon

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              'relative z-10 flex items-center justify-center gap-2 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2365B5] focus-visible:ring-offset-2',
              variantStyles.btn,
              isSelected ? 'text-white font-bold' : 'text-[#536A82] hover:text-[#173B59]'
            )}
          >
            {/* Sliding Approved Clinical Blue Gradient Active Pill */}
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 32,
                }}
                className="absolute inset-0 rounded-[inherit] z-[-1]"
                style={{
                  background: 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)',
                  boxShadow: '0 4px 10px rgba(35, 101, 181, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
                }}
              />
            )}

            {/* Optional Icon */}
            {Icon && (
              <Icon
                size={variantStyles.iconSize}
                className={cn(
                  'shrink-0 transition-colors',
                  isSelected ? 'text-white' : 'text-[#536A82]'
                )}
              />
            )}

            {/* Main Label with Native Script Support */}
            <div className="flex flex-col items-center justify-center text-center leading-tight">
              <span className="truncate">
                {option.nativeLabel || option.label}
              </span>
              {option.sublabel && (
                <span
                  className={cn(
                    'text-[10px] tracking-wide uppercase mt-0.5',
                    isSelected ? 'text-white/85' : 'text-[#8E9CAB]'
                  )}
                >
                  {option.sublabel}
                </span>
              )}
            </div>

            {/* Optional Badge */}
            {option.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none shrink-0 transition-colors',
                  isSelected
                    ? 'bg-white/25 text-white'
                    : option.badgeVariant === 'critical'
                    ? 'bg-critical text-white'
                    : option.badgeVariant === 'warning'
                    ? 'bg-warning text-white'
                    : 'bg-[#DCE7F2] text-[#536A82]'
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
