import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { crearTarea, deleteTask, updateTarea, getTask } from "../api/Tareas.api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import NavBarAlmacen from "../components/NavBarAlmacen";

export function TareasForm() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams();

    const onSubmit = handleSubmit(async (data) => {
        console.log("Datos enviados:", data);
        try {
            if (params.id) {
                await updateTarea(params.id, data);
                toast.success("Tarea actualizada", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
            } else {
                await crearTarea(data);
                toast.success("Tarea creada", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
            }
            navigate("/tareas");
        } catch (error) {
            console.error("Error al guardar la tarea:", error);
            toast.error("Hubo un error al guardar la tarea", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
        }
    });

    useEffect(() => {
        async function loadTasks() {
            if (params.id) {
                const res = await getTask(params.id);
                console.log("Datos de la tarea cargados:", res.data); // Verifica los datos cargados
                setValue("titutlo", res.data.titutlo);
                setValue("descripcion", res.data.descripcion);
            }
        }
        loadTasks();
    }, [params.id, setValue]);

    return (
        <NavBarAlmacen>
            <div className="max-w-xl mx-auto p-4">
                <div className="flex justify-between py-3">
                    <Link to="/tareas">
                        <h1 className="font-bold text-3xl mb-4 text-gray-800"> Tarea</h1>
                    </Link>
                </div>

                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="Título"
                        {...register("titutlo", { required: true })}
                        className="bg-white border border-gray-300 p-3 rounded-lg block w-full mb-3 text-gray-800"
                    />
                    {errors.titutlo && <span className="text-red-500">Título es requerido</span>}
                    
                    <textarea
                        rows="3"
                        placeholder="Descripción"
                        {...register("descripcion", { required: true })}
                        className="bg-white border border-gray-300 p-3 rounded-lg block w-full mb-3 text-gray-800"
                    ></textarea>
                    {errors.descripcion && <span className="text-red-500">Descripción es requerida</span>}
                    
                    <button type="submit" className="bg-blue-500 p-3 rounded-lg block w-full mt-3 text-white hover:bg-blue-600">
                        Guardar
                    </button>
                </form>

                {params.id && (
                    <div className="flex justify-end">
                        <button
                            className="bg-red-500 p-3 rounded-lg w-48 mt-3 text-white hover:bg-red-600"
                            onClick={async () => {
                                const accepted = window.confirm("¿Estás seguro?");
                                if (accepted) {
                                    await deleteTask(params.id);
                                    toast.success("Tarea eliminada", {
                                        position: "bottom-right",
                                        style: {
                                            background: "#101010",
                                            color: "#fff",
                                        },
                                    });
                                    navigate("/tareas");
                                }
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </NavBarAlmacen>
    );
}