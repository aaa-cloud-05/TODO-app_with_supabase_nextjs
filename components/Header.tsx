'use client'

import { Button } from './ui/button'
import { ModeToggle } from './Themebutton'
import Link from 'next/link'
import { SidebarTrigger } from './ui/sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { Check, UserRoundCheck, UserRoundMinus, X } from 'lucide-react'
import { useSupabaseUser } from '@/hooks/useSupabaseUser'
import { useState } from 'react'

const Header = () => {
  const router = useRouter();
  const pathname = usePathname()
  const user = useSupabaseUser()

  const goAccountSetting = () => {
    router.push('/account');
  }

  const [ showBanner, setShowBanner ] = useState<boolean>(true);

  return (
    <div>
      <div className='flex flex-row border-b shadow-xs items-center justify-between w-full px-3 py-2'>
        <div className="flex items-center justify-between gap-2">
          <SidebarTrigger/>
          <Link className='scroll-m-20 text-xl text-shadow-lg font-normal tracking-wider text-current select-none'
            href={"/"}
          >
            Tidy
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <ModeToggle/>
          <Button
            onClick={goAccountSetting}
            variant="ghost"
          >
            {user ? <UserRoundCheck /> : <UserRoundMinus/>}
          </Button>
        </div>
      </div>
      <div>
        {!user && showBanner && pathname === "/todo" ?
        (
          <div className='flex items-center justify-between gap-2 bg-accent rounded-b-md px-[0.3rem] py-[0.2rem] text-sm font-semibold shadow-2xs'>
            <div className='ml-2 flex items-center gap-3'>
              <Check size={18}/>
              <div className='text-muted-foreground text-sm'>Your data is now stored locally. <span className='border-b-2 cursor-pointer text-primary' onClick={() => router.push('/account')}>Sign in</span> to sync it across devices.</div>
            </div>
            <button onClick={() => setShowBanner(false)} className='mr-2 flex cursor-pointer'>
              <X size={18} />
            </button>
          </div>
        )
          : null
        }
      </div>
    </div>
  )
}

export default Header