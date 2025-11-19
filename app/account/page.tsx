'use client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const AccountPage = () => {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center text-background">
      <Button
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <Spinner className='text-accent-foreground'/>
        ) : (
          <h1>Sign in with Google</h1>
        )}
      </Button>
      <Button
        onClick={handleSignOut}
        disabled={loading}
      >
        <h1>Sign out</h1>
      </Button>
    </div>
  )
}

export default AccountPage