'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Hand, Check } from 'lucide-react'
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

  const handleReset = () => {
    setCurrentView('FRONT')
    if (onResetView) onResetView()
  }

  return (
    <div
      className={`relative w-full h-full min-h-0 bg-white rounded-3xl border border-[#DFE8F1] shadow-card flex flex-col justify-between p-2.5 sm:p-3.5 overflow-hidden select-none ${className}`}
      style={{
        boxShadow: '0 4px 20px rgba(35, 75, 115, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* ── 1. Top Bar: Orientation Status & Instruction Badge ── */}
      <div className="w-full flex items-center justify-between z-20 pointer-events-none shrink-0 mb-1">
        {/* Left: Body View Status Pill */}
        <div className="pointer-events-auto bg-[#F8FAFC] border border-[#DFE8F1] rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-[#2365B5] animate-pulse" />
          <span className="text-[11.5px] font-extrabold text-[#17191F] tracking-tight">
            {currentView === 'FRONT' ? 'Front View' : currentView === 'BACK' ? 'Back View' : 'Side View'}
          </span>
          <span className="text-[10px] font-medium text-[#6F7480]">
            ({visibleCallouts.length} regions)
          </span>
        </div>

        {/* Right: Patient Instruction Badge */}
        <div className="pointer-events-auto bg-[#F0F6FD] border border-[#D3E2F0] rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-2xs">
          <div className="w-5 h-5 rounded-lg bg-white text-[#2365B5] flex items-center justify-center shadow-xs shrink-0 border border-[#DFE8F1]">
            <Hand size={11} className="stroke-[2.2]" />
          </div>
          <p className="text-[11px] font-extrabold text-[#17191F] leading-tight">
            Tap a body area to select
          </p>
        </div>
      </div>

      {/* ── 2. Left-Side Dedicated View Control Dock ── */}
      <div className="absolute left-2.5 sm:left-3.5 top-14 z-30 flex flex-col gap-1 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-[#DFE8F1] shadow-card">
        {/* Front View Button */}
        <button
          type="button"
          onClick={() => setCurrentView('FRONT')}
          className={`w-16 sm:w-20 py-2 sm:py-2.5 px-1.5 rounded-xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center gap-0.5 focus:outline-none ${currentView === 'FRONT'
              ? 'text-white font-extrabold shadow-[0_2px_8px_rgba(35,101,181,0.3)] scale-102'
              : 'text-[#4B5565] hover:text-[#17191F] hover:bg-[#F3F8FD] font-bold border border-transparent'
            }`}
          style={{
            background:
              currentView === 'FRONT'
                ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                : undefined,
          }}
          aria-label="Switch to Front View"
          aria-pressed={currentView === 'FRONT'}
        >
          <span className="text-[12px] sm:text-[13px] tracking-tight leading-none">Front</span>
          <span
            className={`text-[9px] font-medium leading-none ${currentView === 'FRONT' ? 'text-white/80' : 'text-[#6F7480]'
              }`}
          >
            Anterior
          </span>
        </button>

        {/* Back View Button */}
        <button
          type="button"
          onClick={() => setCurrentView('BACK')}
          className={`w-16 sm:w-20 py-2 sm:py-2.5 px-1.5 rounded-xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center gap-0.5 focus:outline-none ${currentView === 'BACK'
              ? 'text-white font-extrabold shadow-[0_2px_8px_rgba(35,101,181,0.3)] scale-102'
              : 'text-[#4B5565] hover:text-[#17191F] hover:bg-[#F3F8FD] font-bold border border-transparent'
            }`}
          style={{
            background:
              currentView === 'BACK'
                ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                : undefined,
          }}
          aria-label="Switch to Back View"
          aria-pressed={currentView === 'BACK'}
        >
          <span className="text-[12px] sm:text-[13px] tracking-tight leading-none">Back</span>
          <span
            className={`text-[9px] font-medium leading-none ${currentView === 'BACK' ? 'text-white/80' : 'text-[#6F7480]'
              }`}
          >
            Posterior
          </span>
        </button>

        {/* Side View Button */}
        <button
          type="button"
          onClick={() => setCurrentView('SIDE')}
          className={`w-16 sm:w-20 py-2 sm:py-2.5 px-1.5 rounded-xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center gap-0.5 focus:outline-none ${currentView === 'SIDE'
              ? 'text-white font-extrabold shadow-[0_2px_8px_rgba(35,101,181,0.3)] scale-102'
              : 'text-[#4B5565] hover:text-[#17191F] hover:bg-[#F3F8FD] font-bold border border-transparent'
            }`}
          style={{
            background:
              currentView === 'SIDE'
                ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                : undefined,
          }}
          aria-label="Switch to Side View"
          aria-pressed={currentView === 'SIDE'}
        >
          <span className="text-[12px] sm:text-[13px] tracking-tight leading-none">Side</span>
          <span
            className={`text-[9px] font-medium leading-none ${currentView === 'SIDE' ? 'text-white/80' : 'text-[#6F7480]'
              }`}
          >
            Lateral
          </span>
        </button>

        <div className="h-px w-full bg-[#DFE8F1] my-0.5" />

        {/* Reset View Button */}
        <button
          type="button"
          onClick={handleReset}
          className="w-16 sm:w-20 py-1.5 px-1 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 text-[10.5px] font-bold text-[#2365B5] hover:bg-[#F0F6FD] active:scale-95 border border-[#DFE8F1]/60 focus:outline-none"
          aria-label="Reset View to Front"
        >
          <RefreshCw size={10} className="stroke-[2.2]" />
          <span>Reset</span>
        </button>
      </div>

      {/* ── 3. Center: 2.5D Body Mannequin with Clean Leader Lines & Anatomical Label Callouts ── */}
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
                    strokeWidth={isSelected ? '0.65' : isHovered ? '0.55' : '0.4'}
                    strokeDasharray={isSelected || isHovered ? 'none' : '0.9 0.9'}
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
                      className="relative w-5 h-5 flex items-center justify-center focus:outline-none cursor-pointer rounded-full group"
                      aria-label={`Select ${callout.label}`}
                      aria-pressed={isSelected}
                    >
                      {/* Anchor Dot Target */}
                      <span
                        className={`rounded-full transition-all duration-150 ${isSelected
                            ? 'w-3 h-3 bg-[#EF4444] border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-110'
                            : isHovered
                              ? 'w-2.5 h-2.5 bg-[#2365B5] border-2 border-white scale-125 shadow-xs'
                              : 'w-2 h-2 bg-[#3B82F6]/70 border border-white shadow-2xs group-hover:bg-[#2365B5]'
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
                      className={`group flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-[11.5px] transition-all duration-150 cursor-pointer shadow-2xs focus:outline-none whitespace-nowrap ${isSelected
                          ? 'text-white border border-[#174A91] shadow-xs scale-102 font-extrabold'
                          : isHovered
                            ? 'bg-[#F0F6FD] text-[#174A91] border border-[#2365B5] shadow-xs scale-102 font-bold'
                            : 'bg-white/95 backdrop-blur-xs text-[#2A3B4E] border border-[#CBD8E5] hover:border-[#2365B5] hover:text-[#174A91] hover:bg-[#F8FAFC] font-semibold'
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
                        <Check size={11} className="stroke-[3] text-white shrink-0" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isHovered ? 'bg-[#2365B5]' : 'bg-[#94A3B8]'
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
    </div>
  )
}

