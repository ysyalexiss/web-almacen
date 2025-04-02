import { Link } from "react-router-dom";
import { ListaTareas } from "../components/ListaTareas";
import NavBarAlmacen from "../components/NavBarAlmacen"; 

export function Tareas() {
    return (
        <NavBarAlmacen>
            <div className="p-4">
                <div className="flex justify-between py-3">
                    <Link to="/tareas">
                        <h1 className="font-bold text-3xl mb-4 text-gray-800">Tareas Pendientes</h1> 
                    </Link>
                    <button className="bg-blue-500 px-3 py-2 rounded-lg text-white hover:bg-blue-600">
                        <Link to="/tareas-create">Crear Tarea</Link>
                    </button>
                </div>
                <ListaTareas />
            </div>
        </NavBarAlmacen>
    );
}