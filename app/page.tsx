'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
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
    }

    checkUser()
  }, [router, supabase])

  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return (
    <div className='flex flex-col mt-10'>
      <h1 className='flex justify-center text-muted-foreground text-sm'>This is home section</h1>
      {!user ? <p className='flex justify-center text-muted-foreground text-sm'>If you want to save data, please sign up.</p> : null}
    </div>
  )
}

export default Home