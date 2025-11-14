'use client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
    <div className="flex min-h-screen items-center justify-center text-background">
      <Button
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <Spinner />
        ) : (
          <h1>Sign in with Google</h1>
        )}
      </Button>
    </div>
  )
}

export default LoginPage