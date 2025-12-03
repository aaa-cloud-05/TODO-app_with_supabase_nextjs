import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState } from 'react'

const LOCAL_KEY = "local_todos";
const url = "/api/todos"

type Todo = { id: string; taskname: string; done: boolean};

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [fetching, setFetching] = useState(false);

  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.authLoading);
  const merging = useAuthStore((state) => state.merging);

  // 一覧取得
  const fetchTodos = async () => {
    if (fetching) return;
    setFetching(true);

    try {
      if(!user) {
        // 未ログインユーザーの場合、localStorageから取得
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]")
        setTodos(local);
        return;
      }
      const res = await fetch(url);
      const data = await res.json();
      setTodos(data);
    } catch (e) {
      console.error("fetchTodos failed", e);
    } finally {
      setFetching(false);
    }
  };
  
  useEffect(() => {
    if (authLoading || merging) return;
    fetchTodos();
  },[authLoading, merging, user])

  // 追加
  const addTodo = async (taskname: string) => {
    if (!user) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        taskname: taskname,
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
      taskname: taskname,
      done: false
    };
    setTodos(prev => [...prev, optimisticTodo]);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ taskname }),
      });

      if (!res.ok) throw new Error("Add failed");
      const newTodo = await res.json();
      setTodos(prev =>
        prev.map(t => t.id === optimisticTodo.id ? newTodo : t)
      );
    } catch {
      setTodos(prev => prev.filter(t => t.id !== optimisticTodo.id));
    }
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

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id,
          done: !done,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch {
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

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Delete failed");
    } catch {
      setTodos(prev);
    }
  };

  const completionCount = todos.filter(todo => todo.done).length;

  return {
    todos,
    addTodo,
    toggleDone,
    deleteTodo,
    completionCount,
    isLoading: fetching || authLoading || merging
  };
}

export default useTodos