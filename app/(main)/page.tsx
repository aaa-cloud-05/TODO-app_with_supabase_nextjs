'use client'

import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/stores/useAuthStore';

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.authLoading);
  
  if (authLoading) {
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