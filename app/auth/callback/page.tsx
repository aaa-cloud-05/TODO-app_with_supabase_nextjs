'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'

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
      <Spinner />
    </div>
  )
}