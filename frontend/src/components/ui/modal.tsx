'use client'
import { useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidth?: string
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0c1829]/40 backdrop-blur-xs transition-opacity" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('relative surface-overlay rounded-2xl w-full z-10 overflow-hidden', maxWidth)}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#DFE8F1] bg-white">
            <h2 className="text-[17px] font-bold text-text-primary tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F1F4F9] text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
