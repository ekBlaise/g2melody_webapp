'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Shield } from 'lucide-react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [status, session, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
        <p className="text-gray-400">Verifying admin access...</p>
      </div>
    </div>
  )
}
