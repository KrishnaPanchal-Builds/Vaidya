'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { BodyView } from './types'

interface HumanBodyIllustrationProps {
  view: BodyView
  className?: string
}

const MANNEQUIN_IMAGES: Record<BodyView, string> = {
  FRONT: '/images/body/mannequin-front.jpg',
  BACK: '/images/body/mannequin-back.jpg',
  SIDE: '/images/body/mannequin-side.jpg',
}

export function HumanBodyIllustration({ view, className = '' }: HumanBodyIllustrationProps) {
  const [hasError, setHasError] = useState(false)

  const imgSrc = MANNEQUIN_IMAGES[view] || MANNEQUIN_IMAGES.FRONT

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      {!hasError ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={`2.5D Medical Body Mannequin - ${view} View`}
            width={896}
            height={1200}
            priority
            unoptimized
            onError={() => setHasError(true)}
            className="w-full h-full max-h-full object-contain drop-shadow-[0_6px_20px_rgba(35,75,115,0.07)] pointer-events-none select-none"
          />
        </div>
      ) : (
        /* Medical Vector Mannequin Fallback */
        <svg
          viewBox="0 0 400 680"
          className="w-full h-full max-h-full drop-shadow-[0_8px_24px_rgba(35,75,115,0.08)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skinBase" x1="150" y1="50" x2="250" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F8EDE3" />
              <stop offset="40%" stopColor="#EED9C7" />
              <stop offset="80%" stopColor="#E2C7B2" />
              <stop offset="100%" stopColor="#D4B69F" />
            </linearGradient>
            <linearGradient id="shortsGrad" x1="150" y1="340" x2="250" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B0BDCB" />
              <stop offset="100%" stopColor="#8796A7" />
            </linearGradient>
            <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#254261" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#254261" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="200" cy="650" rx="95" ry="14" fill="url(#groundShadow)" />

          {/* Torso & Core */}
          <path
            d="M150 190 C140 215 142 275 144 315 C145 340 142 360 146 395 C165 400 235 400 254 395 C258 360 255 340 256 315 C258 275 260 215 250 190 C236 195 220 198 200 198 C180 198 164 195 150 190 Z"
            fill="url(#skinBase)"
          />
          {/* Arms */}
          <path d="M142 195 C132 205 118 245 110 275 C104 298 94 340 85 365 C78 385 70 398 75 410 C78 418 86 422 92 414 C98 406 108 375 116 348 C124 320 138 275 146 250 Z" fill="url(#skinBase)" />
          <path d="M258 195 C268 205 282 245 290 275 C296 298 306 340 315 365 C322 385 330 398 325 410 C322 418 314 422 308 414 C302 406 292 375 284 348 C276 320 262 275 254 250 Z" fill="url(#skinBase)" />
          {/* Legs */}
          <path d="M152 390 C150 430 148 480 152 510 C154 525 152 550 154 590 C155 615 150 635 145 644 C152 646 166 646 170 642 C172 635 174 615 176 590 C178 550 182 525 180 510 C176 480 180 430 182 390 Z" fill="url(#skinBase)" />
          <path d="M248 390 C250 430 252 480 248 510 C246 525 248 550 246 590 C245 615 250 635 255 644 C248 646 234 646 230 642 C228 635 226 615 224 590 C222 550 218 525 220 510 C224 480 220 430 218 390 Z" fill="url(#skinBase)" />
          {/* Shorts */}
          <path d="M145 345 C143 370 142 395 144 402 C158 408 178 408 184 398 C192 396 208 396 216 398 C222 408 242 408 256 402 C258 395 257 370 255 345 C230 350 170 350 145 345 Z" fill="url(#shortsGrad)" />
          {/* Head & Neck */}
          <path d="M184 150 C182 170 178 185 174 194 C184 197 216 197 226 194 C222 185 218 170 216 150 Z" fill="url(#skinBase)" />
          <path d="M172 105 C170 70 182 55 200 55 C218 55 230 70 228 105 C226 128 218 152 200 152 C182 152 174 128 172 105 Z" fill="url(#skinBase)" />
        </svg>
      )}
    </div>
  )
}

