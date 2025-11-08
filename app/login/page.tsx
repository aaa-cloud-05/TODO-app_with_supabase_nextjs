'use client'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // すでにログインしている場合はホームへ
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/')
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-lg">
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full rounded-lg bg-white border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <h1>Google でログイン</h1>
          )}
        </button>
      </div>
    </div>
  )
}

export default LoginPage