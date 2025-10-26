  // useEffect(() => {
  //   const saved = localStorage.getItem("myStorage");
  //   if (saved) {
  //     try {
  //       const parsed: Todo[] = JSON.parse(saved);
  //       setTodos(parsed);
  //     } catch {
  //       console.error("localStorage data is invalid");
  //     }
  //   };
  // },[])

  // useEffect(() => {
  //   localStorage.setItem("myStorage",JSON.stringify(todos));
  // },[todos])

  // const AddTask = (e: React.FormEvent): void => {
  //   e.preventDefault();
  //   const value = inner.trim();
  //   if(!value) return;
  //   if(!value) return;
  //   const newTodos: Todo = {
  //     id: crypto.randomUUID(),
  //     taskname: value,
  //   }
  //   setTodos([...todos, newTodos]);
  //   setInner("");
  // }

  // const DeleteTask = (id: string): void => {
  //   const newTodos: Todo[] = todos.filter((todo, _) => {
  //     return id !== todo.id;
  //   })
  //   setTodos(newTodos);
  // }

  {/* <button
          className='text-blue-500 m-2 hover:cursor-pointer'
          onClick={addTodo}
          type='submit'
        >Add</button> */}

  // // 一覧取得
  // const fetchTodos = async () => {
  //   const res = await fetch("/api/todos");
  //   const data = await res.json();
  //   setTodos(data);
  // }
  // try {
  //       const res = await fetch(url);
  //       if (!res.ok) {
  //         throw new Error(`status:${res.status}`)
  //       }
  //       const data = await res.json();
  //       setTodos(data);
  //     } catch (e: unknown){
  //       if (e instanceof Error) {
  //         console.error(e.message);
  //       } else {
  //         console.error("Unknown error: ", e);
  //       }
  //     }
  //   }