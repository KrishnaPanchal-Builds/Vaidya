'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PatientWelcomeRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/kiosk')
  }, [router])

  return (
    <div className="min-h-screen bg-canvas-atmospheric flex items-center justify-center p-6 text-center">
      <div className="p-8 rounded-2xl bg-white border border-border shadow-sm space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin mx-auto" />
        <p className="text-[14px] font-bold text-ink">Redirecting to Vaidya Patient Kiosk...</p>
      </div>
    </div>
  )
}
