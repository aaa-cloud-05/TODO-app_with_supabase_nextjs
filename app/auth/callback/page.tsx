'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleSession = async () => {
      try {
        // URL からコードを取得してセッションと交換
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          router.replace('/login')
          return
        }

        if (session) {
          router.replace('/')
        } else {
          router.replace('/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.replace('/login')
      }
    }

    handleSession()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-lg">認証中</div>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
      </div>
    </div>
  )
}