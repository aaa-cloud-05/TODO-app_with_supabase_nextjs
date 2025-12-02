'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { createClient } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const AccountPage = () => {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const merging = useAuthStore((state) => state.merging);

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
    <div className='relative flex items-center justify-center min-h-screen overflow-hidden'>
      <div className="absolute top-1 left-1/5 w-96 h-96 bg-chart-1 rounded-full blur-3xl opacity-35 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-chart-2 rounded-full blur-3xl opacity-35 animate-pulse" style={{animationDelay: '1.2s'}}></div>
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-chart-3 rounded-full blur-3xl opacity-35 animate-pulse" style={{animationDelay: '2.4s'}}></div>
      <Card className='relative z-10 p-6 w-[90%] md:w-[600px] border-2 rounded-2xl shadow-xl bg-background/40'>
        <CardHeader>
          <CardTitle className='mt-4 text-center text-primary text-3xl font-semibold tracking-wide'>
            Create your Account.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center gap-1'>
            <Link className='text-primary text-sm' href={'/'}>Tidy</Link>
            <p className='text-muted-foreground text-sm'>- task management that feels light and natural.</p>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4 pb-4 pt-6'>
          <Button onClick={handleSignIn} className='w-full cursor-pointer'>
            {!merging && loading ? <Spinner className='text-current'/> : "Sign up with Google"}
          </Button>
          <button className='text-muted-foreground underline hover:text-primary transition text-sm cursor-pointer' onClick={handleSignOut}>
            Sign out
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AccountPage