'use client'

import React from 'react'
import { Button } from './ui/button'
import { ModeToggle } from './Themebutton'
import { User } from 'lucide-react'
import Link from 'next/link'
import { SidebarTrigger } from './ui/sidebar'
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter();

  const goAccountSetting = () => {
    router.push('/account');
  }

  return (
    <div className='flex flex-row border-b shadow-xs items-center justify-between w-full px-3 py-3'>
      <div className="flex items-center justify-between gap-2">
        <SidebarTrigger/>
        <Link className='scroll-m-20 text-xl text-shadow-sm font-normal tracking-tight text-current'
          href={"/"}
        >
          TODO
        </Link>
      </div>
      <div className="flex items-center gap-1">
        
        <ModeToggle/>
        <Button
          onClick={goAccountSetting}
          variant="ghost"
        >
          <User />
        </Button>
      </div>
    </div>
  )
}

export default Header