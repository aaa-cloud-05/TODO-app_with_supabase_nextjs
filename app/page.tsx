'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Todo from '../components/Todo';
import { Spinner } from '@/components/ui/spinner';


const Home = () => {
  const [user, setUser] = useState<User | null>(null);
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

  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className='text-primary'/>
      </div>
    )
  }
  if (!user) {
    return null;
  }
  return (
    <Todo/>
  )
}

export default Home