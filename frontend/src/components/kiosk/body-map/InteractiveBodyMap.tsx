'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCw, RefreshCw, Hand } from 'lucide-react'
import { HumanBodyIllustration } from './HumanBodyIllustration'
import { BODY_HOTSPOTS, type BodyView, type BodyHotspot, type BodyRegionId, type SymptomCategoryId } from './types'

interface InteractiveBodyMapProps {
  selectedRegions: BodyRegionId[]
  selectedCategories: SymptomCategoryId[]
  onToggleHotspot: (hotspot: BodyHotspot) => void
  onResetView?: () => void
  className?: string
}

export function InteractiveBodyMap({
  selectedRegions,
  selectedCategories,
  onToggleHotspot,
  onResetView,
  className = '',
}: InteractiveBodyMapProps) {
  const [currentView, setCurrentView] = useState<BodyView>('FRONT')

  // Filter hotspots relevant to the current view
  const visibleHotspots = BODY_HOTSPOTS.filter((h) => h.view === currentView)

  const handleRotate = () => {
    if (currentView === 'FRONT') setCurrentView('SIDE')
    else if (currentView === 'SIDE') setCurrentView('BACK')
    else setCurrentView('FRONT')
  }

  const handleReset = () => {
    setCurrentView('FRONT')
    if (onResetView) onResetView()
  }

  return (
    <div
      className={`relative w-full h-full min-h-0 bg-white rounded-3xl border border-[#DFE8F1] shadow-card flex flex-col justify-between p-3 sm:p-4 overflow-hidden select-none ${className}`}
      style={{
        boxShadow: '0 4px 20px rgba(35, 75, 115, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* ── Top Floating Controls: View Switcher (Left) & Tap Hint (Right) ── */}
      <div className="w-full flex items-start justify-between z-20 pointer-events-none shrink-0">
        {/* Left: Compact Segmented View Switcher */}
        <div className="flex flex-col gap-1 pointer-events-auto bg-[#F8FAFC] p-1 rounded-2xl border border-[#DFE8F1] shadow-2xs">
          {/* Front View */}
          <button
            onClick={() => setCurrentView('FRONT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentView === 'FRONT'
                ? 'text-white shadow-xs font-bold'
                : 'text-[#4B5565] hover:text-[#17191F] hover:bg-white/80 font-semibold'
            }`}
            style={{
              background:
                currentView === 'FRONT'
                  ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                  : undefined,
            }}
            aria-label="Front View"
            aria-pressed={currentView === 'FRONT'}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <circle cx="12" cy="4.5" r="2.5" />
              <path d="M7 9C7 8.44772 7.44772 8 8 8H16C16.5523 8 17 8.44772 17 9V14C17 14.5523 16.5523 15 16 15H15V21C15 21.5523 14.5523 22 14 22H13C12.4477 22 12 21.5523 12 21V15H12V21C12 21.5523 11.5523 22 11 22H10C9.44772 22 9 21.5523 9 21V15H8C7.44772 15 7 14.5523 7 14V9Z" />
            </svg>
            <span className="text-[11px] tracking-tight">Front</span>
          </button>

          {/* Back View */}
          <button
            onClick={() => setCurrentView('BACK')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentView === 'BACK'
                ? 'text-white shadow-xs font-bold'
                : 'text-[#4B5565] hover:text-[#17191F] hover:bg-white/80 font-semibold'
            }`}
            style={{
              background:
                currentView === 'BACK'
                  ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                  : undefined,
            }}
            aria-label="Back View"
            aria-pressed={currentView === 'BACK'}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <circle cx="12" cy="4.5" r="2.5" />
              <path d="M8 8H16C16.5523 8 17 8.44772 17 9V14C17 14.5523 16.5523 15 16 15H14.5V21C14.5 21.5523 14.0523 22 13.5 22H12.8C12.3582 22 12 21.6418 12 21.2V15H12V21.2C12 21.6418 11.6418 22 11.2 22H10.5C9.94772 22 9.5 21.5523 9.5 21V15H8C7.44772 15 7 14.5523 7 14V9C7 8.44772 7.44772 8 8 8Z" />
            </svg>
            <span className="text-[11px] tracking-tight">Back</span>
          </button>

          {/* Side View */}
          <button
            onClick={() => setCurrentView('SIDE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentView === 'SIDE'
                ? 'text-white shadow-xs font-bold'
                : 'text-[#4B5565] hover:text-[#17191F] hover:bg-white/80 font-semibold'
            }`}
            style={{
              background:
                currentView === 'SIDE'
                  ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                  : undefined,
            }}
            aria-label="Side View"
            aria-pressed={currentView === 'SIDE'}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <circle cx="12" cy="4.5" r="2.5" />
              <path d="M10 8C9.44772 8 9 8.44772 9 9V14C9 14.5523 9.44772 15 10 15H11V21C11 21.5523 11.4477 22 12 22H13C13.5523 22 14 21.5523 14 21V15H14.5C15.0523 15 15.5 14.5523 15.5 14V9C15.5 8.44772 15.0523 8 14.5 8H10Z" />
            </svg>
            <span className="text-[11px] tracking-tight">Side</span>
          </button>
        </div>

        {/* Right: Tap Instruction Hint */}
        <div className="pointer-events-auto bg-[#F0F6FD] border border-[#D3E2F0] rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xs max-w-xs">
          <div className="w-7 h-7 rounded-lg bg-white text-[#2365B5] flex items-center justify-center shadow-xs shrink-0 border border-[#DFE8F1]">
            <Hand size={15} className="stroke-[2.2]" />
          </div>
          <div className="text-left">
            <p className="text-[11.5px] font-extrabold text-[#17191F] leading-tight">Tap a body part</p>
            <p className="text-[10px] font-medium text-[#6F7480] leading-tight">Selected areas highlight</p>
          </div>
        </div>
      </div>

      {/* ── Center: Interactive 2.5D Body Canvas with Hotspots ── */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center w-full py-0.5 overflow-hidden">
        {/* Aspect-Ratio Locked Container for Sub-Pixel Hotspot Precision */}
        <div className="relative h-full aspect-[896/1200] max-h-full max-w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full h-full flex items-center justify-center"
            >
              <HumanBodyIllustration view={currentView} />
            </motion.div>
          </AnimatePresence>

          {/* Hotspot Pins Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {visibleHotspots.map((hotspot) => {
              const isDirectlySelected = selectedRegions.includes(hotspot.id)
              const isCategorySelected = selectedCategories.includes(hotspot.categoryId)
              const isSelected = isDirectlySelected || isCategorySelected

              return (
                <div
                  key={`${hotspot.view}-${hotspot.id}-${hotspot.x}-${hotspot.y}`}
                  className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 transition-transform duration-150"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                  }}
                >
                  {/* Hotspot Button & Hit Area */}
                  <button
                    onClick={() => onToggleHotspot(hotspot)}
                    className="relative group p-2 flex items-center justify-center focus:outline-none cursor-pointer"
                    aria-label={`${hotspot.label}${isSelected ? ' (Selected)' : ''}`}
                  >
                    {/* Selected Glow Halo Ring (Pulsing soft coral/red) */}
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute w-10 h-10 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 animate-pulse pointer-events-none"
                      />
                    )}

                    {/* Hotspot Pin Body */}
                    <span
                      className={`relative flex items-center justify-center rounded-full transition-all duration-150 ${
                        isSelected
                          ? 'w-6 h-6 bg-[#EF4444] border-2 border-white shadow-[0_0_12px_rgba(239,68,68,0.7)]'
                          : 'w-4.5 h-4.5 bg-white border-2 border-[#2365B5] shadow-xs group-hover:scale-125 group-hover:border-[#174A91]'
                      }`}
                    >
                      {isSelected ? (
                        <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#2365B5] group-hover:bg-[#174A91]" />
                      )}
                    </span>

                    {/* Floating Tooltip Pill (Prominently visible when selected) */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute whitespace-nowrap px-2.5 py-0.5 rounded-full text-white text-[11px] font-extrabold shadow-md pointer-events-none z-30 ${
                          hotspot.tooltipPos === 'left'
                            ? 'right-full mr-1.5 top-1/2 -translate-y-1/2'
                            : hotspot.tooltipPos === 'right'
                            ? 'left-full ml-1.5 top-1/2 -translate-y-1/2'
                            : hotspot.tooltipPos === 'bottom'
                            ? 'top-full mt-1.5 left-1/2 -translate-x-1/2'
                            : 'bottom-full mb-1.5 left-1/2 -translate-x-1/2'
                        }`}
                        style={{
                          background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                        }}
                      >
                        {hotspot.label}
                      </motion.div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom Layer: Rotate Affordance (Left) & Reset View (Right) ── */}
      <div className="w-full flex items-center justify-between z-20 shrink-0 pt-1">
        {/* Left: Rotate 360 Control */}
        <button
          onClick={handleRotate}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#DFE8F1] shadow-2xs hover:bg-[#F3F8FD] hover:border-[#CBD8E5] transition-all cursor-pointer text-left group active:scale-95"
          aria-label="Rotate Human Body View"
        >
          <div className="w-6 h-6 rounded-lg bg-[#F0F6FD] text-[#2365B5] flex items-center justify-center font-bold text-[10px] group-hover:bg-[#2365B5] group-hover:text-white transition-colors">
            <RotateCw size={13} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-[#17191F] block leading-tight">Rotate</span>
            <span className="text-[9.5px] text-[#6F7480] block leading-tight">Tap to turn view</span>
          </div>
        </button>

        {/* Right: Reset View Control */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DFE8F1] shadow-2xs text-[11px] font-bold text-[#2365B5] hover:bg-[#F3F8FD] hover:border-[#CBD8E5] transition-all cursor-pointer active:scale-95"
          aria-label="Reset to Front View"
        >
          <RefreshCw size={12} className="stroke-[2.2]" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  )
}

