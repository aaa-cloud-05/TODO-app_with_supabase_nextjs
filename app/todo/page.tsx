'use client'

import Listview from '@/components/Listview';
import TodoSkelton from '@/components/TodoSkelton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react'

type Todo = { id: string; taskname: string; done: boolean};

const Page = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState<string>("")
  const url = "/api/todos"

  // 一覧取得
  const fetchTodos = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    setTodos(data ?? []);
  };
  
  // 起動時にfetch
  useEffect(() => {
    fetchTodos().finally(() => setLoading(false));
  },[])

  // 追加
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!text.trim()) return;

    // 仮のIDを設定して楽観的更新
    const optimisticTodo: Todo= {
      id: "temp-" + crypto.randomUUID(),
      taskname: text,
      done: false
    };
    setTodos(prev => [...prev, optimisticTodo]);
    setText("");

    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text }),
    });

    // ロールバック
    if(!res.ok) {
      setTodos(prev => prev.filter(t => t.id !== optimisticTodo.id));
      return;
    }

    const newTodo = await res.json();

    setTodos(prev =>
      prev.map(t => t.id === optimisticTodo.id ? newTodo : t)
    );
  };

  // 更新
  const toggleDone = async (id: string, done: boolean): Promise<void> => {
    setTodos(prev => 
      prev.map(t => t.id === id ? { ...t, done: !done } : t)
    );

    const res = await fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        id,
        done: !done,
      }),
    });
    
    if (!res.ok) {
      console.log("Update failed");
      setTodos(prev =>
        prev.map(t => t.id === id ? { ...t, done } : t)
      );
    }
  };

  // 削除
  const deleteTodo = async (id: string) => {
    const prev = [...todos];
    setTodos(prev.filter(t => t.id != id));

    const res = await fetch(url, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      setTodos(prev);
    }
  };

  const completionCount = (): number => {
    return todos.filter(todo => todo.done).length
  }

  return (
    <div className='flex items-strart justify-center'>
      <div className='flex-col flex justify-center items-center w-[90%] h-[90vh] md:w-[650px] md:h-[600px] '>
        <Card className='w-full h-full p-2 m-2'>
          <CardHeader>
            <div className='mt-4'>
              <CardTitle className='flex flex-row items-end justify-between'>
                <div className='w-full'>
                  <form onSubmit={addTodo} >
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
                  <h1 className='text-muted-foreground mb-1 text-sm italic'>{completionCount()}/{todos.length}</h1>
                </div>
            </CardTitle>
            </div>
          </CardHeader>
          <div>
            <CardContent className='overflow-y-auto max-h-[460px]'>
              {loading ? (
                <TodoSkelton/>
              ) : <Listview todos={todos} onDelete={deleteTodo} onToggle={toggleDone}/>}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Page