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
  }, [router])

  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return (
    <div className='flex flex-col mx-8 my-6'>
      <div className='flex items-center'>
        <h3 className='scroll-m-20 text-3xl font-semibold tracking-normal'>Hello,&nbsp;<span className='scroll-m-20 text-3xl font-bold tracking-tight text-primary'>{user ? user.user_metadata.name :"Guest"}</span>.</h3>
      </div>
      <p className='mt-48 flex justify-center text-muted-foreground italic'>Nothing here.</p>
      <p className='mt-4 flex justify-center text-muted-foreground text-sm italic'>This page is used to verify session functionality across different pages.</p>
      <p className='mt-3 flex justify-center text-muted-foreground text-sm italic'>In the next app, here will be the start page, which displays a weekly calendar, graphs, etc.</p>
    </div>
  )
}

export default Home