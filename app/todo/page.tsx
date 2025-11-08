'use client'

import React, { useEffect, useState } from 'react'
import Listview from '../components/Listview';

type Todo = { id: string; taskname: string; done: boolean};

const Todo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>("");
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
    const todo = todos.find((t) => t.id === id);
    if(!todo) return;
    await fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id, taskname: todo.taskname, done: !done})
    });
    fetchTodos();
  };

  // // 削除
  const deleteTodo = async (id: string) => {
    await fetch(url, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id }),
    })
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className='flex-col min-h-screen flex justify-center items-center bg-blue-200'>
      <h2 className='scroll-m-20 text-center text-4xl mb-4 font-bold tracking-tight text-balance text-blue-500'>
        Fullstack TODO-app
      </h2>
      <div className='bg-gray-100 flex flex-col justify-start items-start w-100 h-120 p-8 shadow-2xl rounded-2xl '>
        <form onSubmit={addTodo} >
          <input
          type='text'
            className='border rounded-xl p-2 border-blue-300 '
            placeholder='Enter...'
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            autoFocus={true}
          />
        </form>
        <div>
          <Listview todos={todos} onDelete={deleteTodo} onToggle={toggleDone}/>
        </div>
      </div>
    </div>
  )
}

export default Todo