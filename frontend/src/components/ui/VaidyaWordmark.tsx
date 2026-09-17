/**
 * VaidyaWordmark — Clinical brand mark.
 *
 * Design: A stylized leaf/caduceus-inspired mark enclosed in a teal square,
 * paired with the product name and optional descriptor.
 * Replaces the generic double-chevron tech icon with a symbol
 * that communicates care, clinical precision, and Indian herbal medicine.
 */

interface VaidyaWordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  showDescriptor?: boolean
  /** Variant for dark/teal backgrounds (e.g., sidebar nav) */
  variant?: 'default' | 'on-dark'
}

export default function VaidyaWordmark({
  size = 'md',
  showDescriptor = true,
  variant = 'default',
}: VaidyaWordmarkProps) {
  const dims = { sm: 28, md: 34, lg: 42 }
  const iconSizes = { sm: 15, md: 18, lg: 22 }
  const d = dims[size]
  const i = iconSizes[size]

  const nameClass = {
    sm: 'text-[15px] font-semibold tracking-[-0.01em]',
    md: 'text-[18px] font-semibold tracking-[-0.015em]',
    lg: 'text-[22px] font-semibold tracking-[-0.02em]',
  }[size]

  const descClass = {
    sm: 'text-[9px] tracking-[0.10em]',
    md: 'text-[10px] tracking-[0.10em]',
    lg: 'text-[11px] tracking-[0.10em]',
  }[size]

  const nameColor = variant === 'on-dark' ? '#E4F0EC' : 'var(--color-text-primary)'
  const descColor = variant === 'on-dark' ? 'rgba(228,240,236,0.6)' : 'var(--color-text-muted)'

  return (
    <div className="flex items-center gap-2.5">
      {/* Emblem mark */}
      <div
        style={{
          width: d,
          height: d,
          background: 'var(--color-brand)',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {/*
          Stylized botanical-clinical mark:
          - Central vertical stem (caduceus-inspired)
          - Two leaf shapes branching from the stem
          - A small circle at the top (representing a pulse / vital)
          Communicates: living care, medical precision, plant medicine
        */}
        <svg
          width={i}
          height={i}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central vertical stem */}
          <line
            x1="12" y1="20"
            x2="12" y2="6"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Left leaf */}
          <path
            d="M12 14 C9 12 7 9 9 6 C9 6 11 10 12 11"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Right leaf */}
          <path
            d="M12 10 C15 8 17 5 15 3 C15 3 13 7 12 8"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Pulse dot at apex */}
          <circle
            cx="12"
            cy="4.5"
            r="1.5"
            fill="rgba(255,255,255,0.85)"
          />
        </svg>
      </div>

      {/* Wordmark text */}
      <div>
        <div
          className={nameClass}
          style={{
            color: nameColor,
            fontFamily: 'var(--font-display)',
            lineHeight: 1,
          }}
        >
          VAIDYA
        </div>
        {showDescriptor && (
          <div
            className={`${descClass} font-semibold uppercase mt-0.5`}
            style={{ color: descColor, letterSpacing: '0.10em' }}
          >
            Clinical Intelligence
          </div>
        )}
      </div>
    </div>
  )
}
