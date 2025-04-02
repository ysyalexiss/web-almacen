import { Link } from 'react-router-dom'

export function Navigation(){
    return(
        <div className="flex justify-between py-3"> 
            <Link to="/tareas">
            <h1 className="font-bold text-3xl mb-4">Edita Tarea</h1>
            </Link>
            <button className="bg-indigo-500 px-3 py-2 rounded-lg">
            <Link to="/tareas-create">Crea Tarea</Link>
            </button>
        </div>
    )
}