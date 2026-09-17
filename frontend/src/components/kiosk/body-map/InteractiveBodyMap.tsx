'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Hand, Check, Layers } from 'lucide-react'
import { HumanBodyIllustration } from './HumanBodyIllustration'
import {
  getCalloutsForView,
  type BodyView,
  type BodyRegionId,
} from './types'

interface InteractiveBodyMapProps {
  selectedRegions: BodyRegionId[]
  onToggleRegion: (regionId: BodyRegionId) => void
  onResetView?: () => void
  className?: string
}

export function InteractiveBodyMap({
  selectedRegions,
  onToggleRegion,
  onResetView,
  className = '',
}: InteractiveBodyMapProps) {
  const [currentView, setCurrentView] = useState<BodyView>('FRONT')
  const [hoveredRegionId, setHoveredRegionId] = useState<BodyRegionId | null>(null)

  // Retrieve visible anatomical callouts for the active body view
  const visibleCallouts = getCalloutsForView(currentView)

  const handleCycleView = () => {
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
      className={`relative w-full h-full min-h-0 bg-white rounded-3xl border border-[#DFE8F1] shadow-card flex flex-col justify-between p-2.5 sm:p-3 overflow-hidden select-none ${className}`}
      style={{
        boxShadow: '0 4px 20px rgba(35, 75, 115, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* ── 1. Top Bar: View Switcher (Left) & Patient Instruction Badge (Right) ── */}
      <div className="w-full flex items-start justify-between z-20 pointer-events-none shrink-0">
        {/* Left: Segmented View Selector */}
        <div className="flex flex-row gap-0.5 pointer-events-auto bg-[#F8FAFC] p-0.5 rounded-2xl border border-[#DFE8F1] shadow-2xs">
          <button
            type="button"
            onClick={() => setCurrentView('FRONT')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all duration-150 cursor-pointer ${
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
            aria-label="Front Body View"
            aria-pressed={currentView === 'FRONT'}
          >
            <span className="text-[11.5px] tracking-tight">Front</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('BACK')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all duration-150 cursor-pointer ${
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
            aria-label="Back Body View"
            aria-pressed={currentView === 'BACK'}
          >
            <span className="text-[11.5px] tracking-tight">Back</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('SIDE')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all duration-150 cursor-pointer ${
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
            aria-label="Side Body View"
            aria-pressed={currentView === 'SIDE'}
          >
            <span className="text-[11.5px] tracking-tight">Side</span>
          </button>
        </div>

        {/* Right: Simplified Patient Instruction Badge */}
        <div className="pointer-events-auto bg-[#F0F6FD] border border-[#D3E2F0] rounded-xl px-2.5 py-1 flex items-center gap-2 shadow-2xs">
          <div className="w-5.5 h-5.5 rounded-lg bg-white text-[#2365B5] flex items-center justify-center shadow-xs shrink-0 border border-[#DFE8F1]">
            <Hand size={12} className="stroke-[2.2]" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-extrabold text-[#17191F] leading-tight">Tap a body area</p>
          </div>
        </div>
      </div>

      {/* ── 2. Center: 2.5D Body Mannequin with Clean Leader Lines & Anatomical Label Callouts ── */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center w-full py-0.5 overflow-hidden">
        <div className="relative h-full aspect-[896/1200] max-h-full max-w-full flex items-center justify-center">
          {/* Mannequin 2.5D Illustration */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full flex items-center justify-center"
            >
              <HumanBodyIllustration view={currentView} />
            </motion.div>
          </AnimatePresence>

          {/* SVG Leader Lines Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {visibleCallouts.map((callout) => {
              const isSelected = selectedRegions.includes(callout.id)
              const isHovered = hoveredRegionId === callout.id

              return (
                <g key={`leader-${currentView}-${callout.id}`}>
                  {/* Clean connecting leader line from label to body anchor */}
                  <line
                    x1={callout.labelX}
                    y1={callout.labelY}
                    x2={callout.anchorX}
                    y2={callout.anchorY}
                    stroke={
                      isSelected
                        ? '#2365B5'
                        : isHovered
                        ? '#2365B5'
                        : '#CBD8E5'
                    }
                    strokeWidth={isSelected ? '0.6' : isHovered ? '0.5' : '0.35'}
                    strokeDasharray={isSelected || isHovered ? 'none' : '0.8 0.8'}
                    strokeLinecap="round"
                    className="transition-all duration-150"
                  />
                </g>
              )
            })}
          </svg>

          {/* Anatomical Callouts & Interactive Body Anchor Pins Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {visibleCallouts.map((callout) => {
              const isSelected = selectedRegions.includes(callout.id)
              const isHovered = hoveredRegionId === callout.id

              return (
                <React.Fragment key={`${currentView}-${callout.id}`}>
                  {/* ── Body Anchor Pin (on anatomical point) ── */}
                  <div
                    className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                    style={{
                      left: `${callout.anchorX}%`,
                      top: `${callout.anchorY}%`,
                    }}
                    onMouseEnter={() => setHoveredRegionId(callout.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    onClick={() => onToggleRegion(callout.id)}
                  >
                    <button
                      type="button"
                      className="relative w-4.5 h-4.5 flex items-center justify-center focus:outline-none cursor-pointer rounded-full"
                      aria-label={`Select ${callout.label}`}
                      aria-pressed={isSelected}
                    >
                      {/* Anchor Dot */}
                      <span
                        className={`rounded-full transition-all duration-150 ${
                          isSelected
                            ? 'w-2.5 h-2.5 bg-[#EF4444] border-2 border-white shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                            : isHovered
                            ? 'w-2 h-2 bg-[#2365B5] border-2 border-white scale-125 shadow-xs'
                            : 'w-1.5 h-1.5 bg-[#3B82F6]/60 border border-white shadow-2xs'
                        }`}
                      />
                    </button>
                  </div>

                  {/* ── Clinical Anatomical Label Pill (Flank Callout) ── */}
                  <div
                    className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                    style={{
                      left: `${callout.labelX}%`,
                      top: `${callout.labelY}%`,
                    }}
                    onMouseEnter={() => setHoveredRegionId(callout.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    onClick={() => onToggleRegion(callout.id)}
                  >
                    <button
                      type="button"
                      onFocus={() => setHoveredRegionId(callout.id)}
                      onBlur={() => setHoveredRegionId(null)}
                      className={`group flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold transition-all duration-150 cursor-pointer shadow-2xs focus:outline-none ${
                        isSelected
                          ? 'text-white border border-[#174A91] shadow-xs scale-102 font-extrabold'
                          : isHovered
                          ? 'bg-[#F0F6FD] text-[#174A91] border border-[#2365B5] shadow-xs scale-102'
                          : 'bg-white/95 backdrop-blur-xs text-[#334155] border border-[#CBD8E5] hover:border-[#2365B5] hover:text-[#174A91] hover:bg-[#F8FAFC]'
                      }`}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, #2365B5 0%, #174A91 100%)'
                          : undefined,
                      }}
                      aria-label={`Select ${callout.label}`}
                      aria-pressed={isSelected}
                    >
                      {/* Selection Checkmark / Status Dot */}
                      {isSelected ? (
                        <Check size={10} className="stroke-[3] text-white shrink-0" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            isHovered ? 'bg-[#2365B5]' : 'bg-[#94A3B8]'
                          }`}
                        />
                      )}

                      <span className="whitespace-nowrap tracking-tight leading-none">
                        {callout.label}
                      </span>
                    </button>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Layer: Switch View & Reset View ── */}
      <div className="w-full flex items-center justify-between z-20 shrink-0 pt-0.5">
        {/* Left: Cycle View */}
        <button
          type="button"
          onClick={handleCycleView}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#DFE8F1] shadow-2xs hover:bg-[#F3F8FD] hover:border-[#CBD8E5] transition-all cursor-pointer text-left group active:scale-95"
          aria-label="Switch Body View"
        >
          <div className="w-5 h-5 rounded-lg bg-[#F0F6FD] text-[#2365B5] flex items-center justify-center font-bold text-[10px] group-hover:bg-[#2365B5] group-hover:text-white transition-colors">
            <Layers size={11} />
          </div>
          <div>
            <span className="text-[10.5px] font-extrabold text-[#17191F] block leading-tight">Switch View</span>
            <span className="text-[9px] text-[#6F7480] block leading-tight">
              {currentView === 'FRONT' ? 'Front → Side' : currentView === 'SIDE' ? 'Side → Back' : 'Back → Front'}
            </span>
          </div>
        </button>

        {/* Right: Reset View */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#DFE8F1] shadow-2xs text-[10.5px] font-bold text-[#2365B5] hover:bg-[#F3F8FD] hover:border-[#CBD8E5] transition-all cursor-pointer active:scale-95"
          aria-label="Reset View to Front"
        >
          <RefreshCw size={10} className="stroke-[2.2]" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  )
}
