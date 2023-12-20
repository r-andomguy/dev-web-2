import { useEffect, useState, RefObject } from "react"
import Header from "./Header"
import Input from "./Input"
import List from "./List"
import './App.css'

export type TTodoRestItem = { id: number, text: string, date_init: string, date_end: string, ref: RefObject<HTMLLIElement> }

export default function App() {
  const [todolist, setTodolist] = useState<TTodoRestItem[]>(
    JSON.parse(localStorage.getItem('todolist') ?? '[]')
  )

  useEffect(() => {
    fetch("http://localhost:3000/item")
      .then(response => response.json())
      .then(data => setTodolist(data))
      .catch(error => console.error('Erro:', error));
  }, [])

  return <>
    <div className='mainDiv'>
      <Header/>
      <Input setTodolist={setTodolist} todolist={todolist} />
      <List setTodolist={setTodolist} todolist={todolist} />
    </div>
  </>
}
