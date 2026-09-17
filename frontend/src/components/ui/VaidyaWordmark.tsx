/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React from 'react'

export interface VaidyaWordmarkProps {
  /**
   * Sizing presets or specific pixel height.
   * Preset heights:
   * - 'xs': 26px (compact subheaders, mobile bars)
   * - 'sm': 32px (standard sidebars: clinical & admin shell)
   * - 'md': 38px (kiosk headers, top app bars, auth headers)
   * - 'lg': 46px (public homepage top navbar, main hero headers)
   * - 'xl': 60px (auth splash / large brand displays)
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

  /**
   * Color variant:
   * - 'default': Clinical teal symbol + charcoal serif wordmark (for light backgrounds)
   * - 'on-dark': Glowing ivory symbol + serif wordmark (for dark teal / dark backgrounds)
   * @default 'default'
   */
  variant?: 'default' | 'on-dark'

  /**
   * If true, renders only the circular clinical-human symbol mark.
   * @default false
   */
  markOnly?: boolean

  /**
   * If true, renders the stacked vertical lockup (mark on top, wordmark below).
   * @default false
   */
  stacked?: boolean

  /**
   * Preserved for API compatibility across existing screens.
   * @default true
   */
  showDescriptor?: boolean

  /** Additional CSS class names */
  className?: string

  /** Additional inline styles */
  style?: React.CSSProperties

  /** Accessible alt text */
  alt?: string

  /** Image loading priority */
  priority?: boolean
}

export default function VaidyaWordmark({
  size = 'md',
  variant = 'default',
  markOnly = false,
  stacked = false,
  showDescriptor = true,
  className = '',
  style,
  alt = 'Vaidya — Clinical Intelligence',
  priority = false,
}: VaidyaWordmarkProps) {
  // Map size prop to height in px
  const heightPx: number =
    typeof size === 'number'
      ? size
      : {
          xs: 26,
          sm: 32,
          md: 38,
          lg: 46,
          xl: 60,
        }[size] || 38

  // Choose the authentic extracted asset
  let src = '/brand/vaidya-logo-primary.png'
  let aspectRatio = 1428 / 423 // ~3.375

  if (markOnly) {
    src = variant === 'on-dark' ? '/brand/vaidya-mark-white.png' : '/brand/vaidya-mark.png'
    aspectRatio = 1 // 1:1 square
  } else if (stacked) {
    src = '/brand/vaidya-logo-stacked.png'
    aspectRatio = 1005 / 702 // ~1.43
  } else {
    src = variant === 'on-dark' ? '/brand/vaidya-logo-reversed.png' : '/brand/vaidya-logo-primary.png'
    aspectRatio = 1428 / 423 // ~3.375
  }

  const calculatedWidth = Math.round(heightPx * aspectRatio)

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 0,
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        width={calculatedWidth}
        height={heightPx}
        style={{
          height: `${heightPx}px`,
          width: 'auto',
          maxWidth: 'none',
          objectFit: 'contain',
          display: 'block',
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}
