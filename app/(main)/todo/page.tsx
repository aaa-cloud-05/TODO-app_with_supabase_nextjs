'use client'

import Listview from '@/components/Listview';
import TodoSkeleton from '@/components/TodoSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import React, { useEffect, useState } from 'react'

type Todo = { id: string; taskname: string; done: boolean};

const Page = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState<string>("")
  const url = "/api/todos"

  const { user, authLoading } = useSupabaseUser();

  const LOCAL_KEY = "local_todos";

  // 2025/11/23
  // 未ログインユーザー　＝　アカウントの有無にかかわらずログインしていないユーザー
  // 
  // これまでの構成：
  // ログインユーザーのみに対しての設計
  // CRUD操作で必ずAPIを叩く
  // 
  // 新たな構成(構想)：
  // 1.
  // ログインユーザー = APIを通した今まで通りの設計
  // 未ログインユーザー = ローカルストレージにTODOを保存, APIを叩かない
  // => ログイン時にローカルストレージの内容をDBに追加
  // 
  // 2.
  // ログインユーザー、未ログインユーザーともに、ページアクセス時にlocalStorageを参照する
  // => 初回アクセス時に発生するfetchによる遅延を減らす


  // 一覧取得
  const fetchTodos = async () => {
    if(!user) {
      // 未ログインユーザーの場合、localStorageから取得
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]")
      setTodos(local);
      return;
    }

    const res = await fetch(url);
    if (!res.ok) {
      setTodos([]);
    }

    const data = await res.json();
    setTodos(data);
  };
  
  useEffect(() => {
    // fetchTodos().finally(() => setLoading(false));
    fetchTodos();
  },[user])

  // 追加
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!text.trim()) return;

    setText("");

    if (!user) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        taskname: text,
        done: false
      }
      const updated = [...todos,newTodo];
      setTodos(updated);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return;
    }

    // 仮のIDを設定して楽観的更新
    const optimisticTodo: Todo= {
      id: "temp-" + crypto.randomUUID(),
      taskname: text,
      done: false
    };
    setTodos(prev => [...prev, optimisticTodo]);

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

    if (!user) {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]")
      const updated = local.map((t: Todo) => t.id === id ? {...t, done: !done } : t)
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return;
    }

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

    if (!user) {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]")
      const updated = local.filter((t: Todo) => t.id !== id)
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return;
    }

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
    <div className='flex items-start justify-center'>
      <div className='flex-col flex justify-center items-center w-[90%] h-[90vh] md:w-[650px] md:h-[600px] '>
        <Card className='w-full h-full p-2 m-2 border-none'>
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
              {authLoading ? (
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