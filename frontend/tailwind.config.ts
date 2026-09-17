import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/screens/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── COLOR SYSTEM ─────────────────────────────────────────────────
      // All values reference CSS variables from globals.css.
      // This ensures a single source of truth with no token drift.
      colors: {
        // Brand palette
        brand:             'var(--color-brand)',
        'brand-dim':       'var(--color-brand-dim)',
        'brand-mist':      'var(--color-brand-mist)',
        'brand-mist-subtle': 'var(--color-brand-mist-subtle)',
        highlight:         'var(--color-highlight)',
        'highlight-dim':   'var(--color-highlight-dim)',
        'highlight-subtle':'var(--color-highlight-subtle)',

        // Surfaces
        canvas:            'var(--color-canvas)',
        surface:           'var(--color-surface)',
        'surface-subtle':  'var(--color-surface-subtle)',
        'surface-dim':     'var(--color-surface-dim)',

        // Borders
        border:            'var(--color-border)',
        'border-strong':   'var(--color-border-strong)',
        'border-focus':    'var(--color-border-focus)',

        // Text
        ink:               'var(--color-ink)',
        'text-primary':    'var(--color-text-primary)',
        'text-secondary':  'var(--color-text-secondary)',
        'text-muted':      'var(--color-text-muted)',
        'text-disabled':   'var(--color-text-disabled)',

        // Pastel Palette Accents
        'pastel-blue':     'var(--color-pastel-blue)',
        'pastel-lavender': 'var(--color-pastel-lavender)',
        'pastel-mint':     'var(--color-pastel-mint)',
        'pastel-peach':    'var(--color-pastel-peach)',
        'pastel-yellow':   'var(--color-pastel-yellow)',

        // Accent (maps to brand)
        accent:            'var(--color-accent)',
        'accent-hover':    'var(--color-accent-hover)',
        'accent-subtle':   'var(--color-accent-subtle)',
        'accent-text':     'var(--color-accent-text)',

        // Semantic
        verified:          'var(--color-verified)',
        'verified-subtle': 'var(--color-verified-subtle)',
        'verified-text':   'var(--color-verified-text)',
        warning:           'var(--color-warning)',
        'warning-subtle':  'var(--color-warning-subtle)',
        'warning-text':    'var(--color-warning-text)',
        critical:          'var(--color-critical)',
        'critical-subtle': 'var(--color-critical-subtle)',
        'critical-text':   'var(--color-critical-text)',
        info:              'var(--color-info)',
        'info-subtle':     'var(--color-info-subtle)',
        'info-text':       'var(--color-info-text)',
        ayush:             'var(--color-ayush)',
        'ayush-subtle':    'var(--color-ayush-subtle)',
        'ayush-text':      'var(--color-ayush-text)',

        // Legacy Tailwind/Material aliases — kept for backward compat with existing JSX
        // These now map to the new palette so existing hardcoded classes
        // get visually updated without a global JSX rewrite.
        'on-primary':      '#ffffff',
        primary:           'var(--color-brand)',
        'primary-container': 'var(--color-brand-mist)',
        secondary:         'var(--color-ayush)',
        'secondary-container': 'var(--color-ayush-subtle)',
        tertiary:          'var(--color-highlight)',
        error:             'var(--color-critical)',
        'error-container': 'var(--color-critical-subtle)',

        // Kiosk-scoped tokens
        'kiosk-primary':    'var(--kiosk-primary)',
        'kiosk-surface':    'var(--kiosk-surface)',
        'kiosk-on-surface': 'var(--kiosk-on-surface)',
      },

      // ─── SPACING ──────────────────────────────────────────────────────
      spacing: {
        xs:    '4px',
        sm:    '8px',
        md:    '16px',
        base:  '4px',
        lg:    '24px',
        xl:    '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '64px',
        '5xl': '80px',
        gutter: '20px',
        'container-max': '1440px',
      },

      // ─── MAX WIDTHS ───────────────────────────────────────────────────
      maxWidth: {
        'container-max': '1440px',
        'clinical-form': '560px',
        'clinical-brief': '800px',
      },

      // ─── FONT FAMILIES ────────────────────────────────────────────────
      fontFamily: {
        display:  ['var(--font-display)', 'Hanken Grotesk', 'system-ui', 'sans-serif'],
        sans:     ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:     ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        // Tailwind named aliases for component use
        'page-title':      ['var(--font-display)', 'Hanken Grotesk', 'sans-serif'],
        'section-heading': ['var(--font-display)', 'Hanken Grotesk', 'sans-serif'],
        'body-primary':    ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'body-compact':    ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'metadata-mono':   ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        'display-lg':      ['var(--font-display)', 'Hanken Grotesk', 'sans-serif'],
      },

      // ─── FONT SIZES ───────────────────────────────────────────────────
      // Clinical typography scale — designed for readability on clinical monitors
      fontSize: {
        'display-xl': ['48px',  { lineHeight: '1.06', fontWeight: '700', letterSpacing: '-0.025em' }],
        'display-lg': ['38px',  { lineHeight: '1.10', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-md': ['30px',  { lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.015em' }],
        'page-title': ['24px',  { lineHeight: '32px', fontWeight: '600' }],
        'section-heading': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body-primary':    ['15px', { lineHeight: '24px', fontWeight: '400' }],
        'body-compact':    ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm':         ['13px', { lineHeight: '20px', fontWeight: '400' }],
        // Clinical specific
        'clinical-label':  ['11px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.04em' }],
        'clinical-value':  ['14px', { lineHeight: '20px', fontWeight: '500' }],  // Use font-mono utility alongside
        'metadata-mono':   ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        // Kiosk — larger for low-literacy users
        'kiosk-heading':   ['28px', { lineHeight: '1.2',  fontWeight: '600' }],
        'kiosk-body':      ['18px', { lineHeight: '1.5',  fontWeight: '400' }],
        'kiosk-action':    ['17px', { lineHeight: '1.3',  fontWeight: '600' }],
      },

      // ─── BORDER RADIUS ────────────────────────────────────────────────
      borderRadius: {
        xs:      '4px',
        sm:      '6px',
        DEFAULT: '8px',
        md:      '10px',
        lg:      '12px',
        xl:      '16px',
        '2xl':   '20px',
        '3xl':   '24px',
        full:    '9999px',
      },

      // ─── BOX SHADOWS ──────────────────────────────────────────────────
      boxShadow: {
        xs:     '0 1px 2px rgba(28, 41, 38, 0.04)',
        sm:     '0 1px 3px rgba(28, 41, 38, 0.06), 0 1px 2px rgba(28, 41, 38, 0.04)',
        md:     '0 4px 12px rgba(28, 41, 38, 0.08), 0 1px 3px rgba(28, 41, 38, 0.04)',
        lg:     '0 12px 32px rgba(28, 41, 38, 0.10), 0 4px 8px rgba(28, 41, 38, 0.05)',
        drawer: '-4px 0 32px rgba(28, 41, 38, 0.08)',
      },

      // ─── TRANSITIONS ──────────────────────────────────────────────────
      transitionDuration: {
        micro: '100ms',
        fast:  '160ms',
        base:  '220ms',
        slow:  '320ms',
      },
      transitionTimingFunction: {
        'ease-clinical': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
