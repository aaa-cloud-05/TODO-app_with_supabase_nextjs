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
        <h3 className='scroll-m-20 text-3xl font-semibold tracking-normal'>Hello,&nbsp;
          <span className='scroll-m-20 text-3xl font-bold tracking-tight text-primary'>
            {user ? user.user_metadata.name :"Guest"}
          </span>.
          
        </h3>
      </div>
      <div className='mt-40 text-center text-muted-foreground'>
        <p className='italic'>Nothing here.</p>
        <p className='mt-4 text-sm italic'>This application is designed with a large-scale structure in mind.</p>
        <p className='mt-4 text-sm italic'>This page is intentionally left empty to verify that the layout and navigation can scale as the app grows.</p>
        <p className='mt-4 text-sm italic'>In the finished application, this will become the start page, featuring a weekly calendar, graphs, and more.</p>
      </div>
      
    </div>
  )
}

export default Home