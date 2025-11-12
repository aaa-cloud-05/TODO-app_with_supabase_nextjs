'use client'

import React, { useEffect, useState } from 'react'
import Listview from './Listview';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { createClient } from '@/lib/supabase';
import { Button } from './ui/button';
import { User } from 'lucide-react';
import { ModeToggle } from './Themebutton';

type Todo = { id: string; taskname: string; done: boolean};

const Todo = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState<string>("")
  const url = "../api/todos"

  // 一覧取得
  const fetchTodos = async () => {
    const res = await fetch(url);
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      setTodos([]);
      return;
    }
    setTodos(data);
  };
  
  // 起動時にfetch
  useEffect(() => {
    fetchTodos();
  },[])

  // 追加
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!text.trim()) return;
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos,newTodo]);
    setText("");
  };

  // 更新
  const toggleDone = async (id: string, done: boolean): Promise<void> => {
    const trg = todos.find((t) => t.id === id);
    if(!trg) return;
    await fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id, taskname: trg.taskname, done: !done})
    });
    fetchTodos();
  };

  // 削除
  const deleteTodo = async (id: string) => {
    await fetch(url, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id }),
    })
    setTodos(todos.filter((t) => t.id !== id));
  };

  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className='flex items-strart mt-16 justify-center min-h-screen '>
      <div className='flex-col flex justify-center items-center w-[90%] h-[80vh] md:w-[600px] md:h-[500px]'>
        <div className='flex flex-row gap-2 items-center justify-between w-full px-2 mb-2'>
          <p className='scroll-m-20 text-xl text-shadow-sm font-normal tracking-tight first:mt-0 text-current'>
            TODO-app
          </p>
          <div className="flex gap-1">
            <ModeToggle/>
            <Button
              onClick={handleSignOut}
              variant="ghost"
            >
              <User />
            </Button>
          </div>
        </div>
        <Card className='w-full h-full p-2 m-2'>
          <CardHeader>
            <div className='mt-4'>
              <CardTitle>
                <form onSubmit={addTodo} >
                  <Input
                    type='text'
                    placeholder='Enter...'
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                    autoFocus={true}
                  />
                </form>
            </CardTitle>
            </div>
            
          </CardHeader>
          <div>
            <CardContent>
              <Listview todos={todos} onDelete={deleteTodo} onToggle={toggleDone}/>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
    
  )
}

export default Todo