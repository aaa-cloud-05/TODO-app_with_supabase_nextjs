'use client'

import Listview from '@/components/Listview';
import TodoSkeleton from '@/components/TodoSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useTodos from '@/hooks/useTodos';
import React, { useState } from 'react'

const Page = () => {
  const [text, setText] = useState<string>("");

  const {
    todos,
    addTodo,
    toggleDone,
    deleteTodo,
    completionCount,
    isLoading,
  } = useTodos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setText("");
    await addTodo(text);
  }

  return (
    <div className='flex items-start justify-center'>
      <div className='flex-col flex justify-center items-center w-[90%] h-[90vh] md:w-[650px] md:h-[600px] '>
        <Card className='w-full h-full p-2 m-2 border-none'>
          <CardHeader>
            <div className='mt-4'>
              <CardTitle className='flex flex-row items-end justify-between'>
                <div className='w-full'>
                  <form onSubmit={handleSubmit} >
                    <Input
                      type='text'
                      placeholder='Enter...'
                      value={text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                      autoFocus={true}
                    />
                  </form>
                </div>
                <div className='mx-4'>
                  <h1 className='text-muted-foreground mb-1 text-sm italic'>{completionCount}/{todos.length}</h1>
                </div>
            </CardTitle>
            </div>
          </CardHeader>
          <div>
            <CardContent className='overflow-y-auto max-h-[460px]'>
              {isLoading ? (
                <TodoSkeleton/>
              ) : <Listview todos={todos} onDelete={deleteTodo} onToggle={toggleDone}/>}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Page