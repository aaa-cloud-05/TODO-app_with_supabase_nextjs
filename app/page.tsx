'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';


const Home = () => {
  const [user, setUser] = useState<User | any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (!user) {
        router.push('/login')
      }
    }

    checkUser()

    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }
  if (!user) {
    return null;
  }

  return (
    <div>
      <div>
        <h1>Welcome to my website</h1>
      </div>
      <button
        onClick={handleSignOut}
        className='border'
      >
        Sign out
      </button>
      <a href="/todo" className='underline text-blue-500'>todo-app</a>
    </div>
  )
}

export default Home