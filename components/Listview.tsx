import React from 'react'
import { Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';

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
    return <p>No tasks yet.</p>
  }
  return (
    <ul>
      {todos.map((todo: Todo) => (
        <li
          key={todo.id}
          className='border shadow-sm mb-3 rounded-2xl hover:shadow-lg hover:scale-[1.01] transition-all duration-300 active:scale-95 cursor-pointer'
          onClick={() => onToggle(todo.id, todo.done)}
        >
          <div className='flex items-center justify-between pl-4 pr-2 py-2'>
            <div className='flex items-center gap-3'>
              <Checkbox
                checked={todo.done}
                
              />
              <h4 className='scroll-m-20 text-lg font-medium tracking-tight text-primary'>{todo.taskname}</h4>
            </div>
            <Button variant="ghost" onClick={(e) => {e.stopPropagation(); onDelete(todo.id)}}><Trash className='text-destructive'/></Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Listview