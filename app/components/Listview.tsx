import React from 'react'
import Button from './Button';
import { Trash } from 'lucide-react';

type Todo = {
  id: string;
  taskname: string
  done: boolean
};

type ListviewProps = {
  todos: Todo[];
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, done: boolean) => Promise<void>;
};

const Listview = ({ todos, onDelete, onToggle }: ListviewProps) => {
  if (!todos) {
    return <p>タスクがありません</p>
  }
  return (
    <ul>
      {todos.map((todo: Todo) => {
        return <li key={todo.id} className='flex gap-4 m-4'>
          <span 
            onClick={() => onToggle(todo.id, todo.done)}
            className={` text-2xl ${todo.done ? "line-through text-gray-400" : ""}`}
          >
            {todo.taskname}
          </span>
          <Button onClick={() => onDelete(todo.id)}><Trash/></Button>
        </li>
      })}
    </ul>
  )
}

export default Listview