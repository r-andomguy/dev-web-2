import { KeyboardEvent, useRef, useState } from "react";
import { TTodoRestItem } from "./App";

type TProps = {
  todolist: TTodoRestItem[];
  setTodolist: (todolist: TTodoRestItem[]) => void;
};

export default function TodoForm(props: TProps) {
  const { todolist, setTodolist } = props;
  const [dateInit, setDateInit] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');

  const ref = useRef<HTMLLIElement>(null);

  const onKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const todoValue = event.currentTarget.value;
      
      if (!dateInit || !dateEnd) {
        console.error("Por favor, preencha as datas.");
        return;
      }
      
      console.log('data', dateInit, dateEnd);
      event.currentTarget.value = '';

      const newTodolist = [
        { id: -1, text: todoValue, ref, date_init: dateInit, date_end: dateEnd },
        ...todolist,
      ];
      setTodolist(newTodolist);

      const request = await fetch("http://localhost:3000/item", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: todoValue, date_init: dateInit, date_end: dateEnd }),
      });

      const response = await request.json();

      if (ref.current) {
        ref.current.dataset.id = response.lastID;
        ref.current.className = 'synced';
      }
    }
  };

  return (
    <div className="div">
      <input className="input-action" type="text" placeholder="O que você fará depois?" onKeyDown={onKeyDown} />
      <input className="input-action" type="date" placeholder="Quando você inicia?" value={dateInit} onChange={(e) => setDateInit(e.target.value)} />
      <input className="input-action" type="date" placeholder="Quando você termina?" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
    </div>
  );
}
