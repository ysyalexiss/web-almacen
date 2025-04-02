import { useEffect, useState } from "react";
import { getAllTareas } from "../api/Tareas.api";
import { TareasCard } from "./TareasCards";

export function ListaTareas() {
    const [tareas, setTasks] = useState([]);
  
    useEffect(() => {
      async function loadTasks() {
        const res = await getAllTareas();
        setTasks(res.data);
      }
      loadTasks();
    }, []);
  
    return (
      <div className="grid grid-cols-3 gap-3">
        {tareas.map((tarea) => (
            <TareasCard key={tarea.id} tarea ={tarea} />
        ))}
      </div>
    );
  }






