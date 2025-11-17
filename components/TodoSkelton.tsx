import React from 'react'
import { Skeleton } from './ui/skeleton'

const TodoSkelton = () => {
  return (
    <div className='space-y-3'>
      <Skeleton className='h-10 w-full rounded-xl'/>
      <Skeleton className='h-10 w-full rounded-xl'/>
      <Skeleton className='h-10 w-full rounded-xl'/>
    </div>
  )
}

export default TodoSkelton