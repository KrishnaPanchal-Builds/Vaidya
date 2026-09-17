'use client'
import { useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'right' | 'left'
  width?: string
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'w-[420px]' }: DrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          'fixed top-0 bottom-0 z-50 bg-white border-l border-[#CBD8E5] shadow-drawer flex flex-col transition-transform duration-[240ms] ease-out',
          width,
          side === 'right' ? 'right-0 rounded-l-2xl' : 'left-0 rounded-r-2xl border-r border-l-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-[56px] px-6 border-b border-[#DFE8F1] bg-[#FAFCFE] shrink-0">
          {title && <span className="text-[15px] font-bold text-text-primary tracking-tight">{title}</span>}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-[#EEF3F8] transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  )
}
