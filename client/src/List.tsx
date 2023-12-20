import { KeyboardEvent, MouseEvent } from "react"
import { TTodoRestItem } from "./App"

type TProps = {
  todolist: TTodoRestItem[],
  setTodolist: (todolist: TTodoRestItem[]) => void
}

export default function (props: TProps) {
  const { todolist, setTodolist } = props

  const removeItem = async (event: MouseEvent<HTMLButtonElement>) => {
    const id = Number(event.currentTarget.dataset.id) as number
    const li = event.currentTarget.closest('li') as HTMLLIElement
    li.className = 'pending'
    await fetch(`http://localhost:3000/item/${id}`, { method: 'DELETE' })
    const newTodolist = todolist.filter((val, _key) => val.id !== id)
    setTodolist(newTodolist)
  }

  const keyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const li = event.currentTarget.closest('li') as HTMLLIElement
      li.className = 'pending'
      const value = event.currentTarget.value;
      const id = event.currentTarget.dataset.id;
      const field = event.currentTarget.name;

      const todoItem = todolist.find((todo) => todo.id === Number(id));
      if (!todoItem) return;
      
      const requestBody = {
        todo: field === 'todo' ? value : todoItem.text,
        date_init: field === 'date_init' ? value : todoItem.date_init,
        date_end: field === 'date_end' ? value : todoItem.date_end,
      };

      const request = await fetch(`http://localhost:3000/item/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      const response = await request.json()
      console.log(response)
      li.className = 'synced'
    }
  }

  return <>
    <div className='div' id='list'>
      <ul>
        {/* <li className="pending">pending</li> */}
        {/* <li className="synced">synced</li> */}
        {/* <li className="error">error</li> */}
        {todolist.map((todo, _key) =>
          <li ref={todo.ref} key={todo.id} data-id={todo.id} className={todo.id < 0 ? "pending" : "synced"}>
            <button data-id={todo.id} onClick={removeItem}>x</button>
            <input className="listInput" data-id={todo.id} name="todo" defaultValue={todo.text} onKeyDown={keyDown} />
            <input className="listInput" data-id={todo.id} name="date_init" defaultValue={todo.date_init} onKeyDown={keyDown} />
            <input className="listInput" data-id={todo.id} name="date_end" defaultValue={todo.date_end} onKeyDown={keyDown} />
          </li>
        )}
      </ul>
    </div>

  </>
}