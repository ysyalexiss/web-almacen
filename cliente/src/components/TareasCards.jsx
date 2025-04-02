import { useNavigate } from 'react-router-dom';

export function TareasCard({tarea}){

    const navigate = useNavigate()
    return(
        <div className=" bg-white p-3 hover:bg-zinc-700 hover:cursor-pointer "
        
        onClick={() =>{
            navigate(`/tareas/${tarea.id}`)
        }}
        >
        <h1 className="font-bold text-black uppercase" >{tarea.titutlo}</h1>
        <p className="text-black ">{tarea.descripcion}</p>
        
    </div>
    )
}