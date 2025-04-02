import React, { useEffect, useState } from "react";
import NavBarAlmacen from "../components/NavBarAlmacen";
import axios from "axios";

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [entradasHoy, setEntradasHoy] = useState(0);
    const [salidasHoy, setSalidasHoy] = useState(0);

    // nombre del usuario desde el localStorage
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // número de entradas y salidas realizadas hoy
    useEffect(() => {
        const fetchData = async () => {
            try {
                const entradasResponse = await axios.get("http://localhost:8000/tareas/api/entradas-hoy/");
                const salidasResponse = await axios.get("http://localhost:8000/tareas/api/salidas-hoy/");

                setEntradasHoy(entradasResponse.data.count);
                setSalidasHoy(salidasResponse.data.count);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <NavBarAlmacen>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Bienvenido, {username}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cuadro de entradas hoy */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Entradas hoy</h3>
                        <p className="text-3xl font-bold">{entradasHoy}</p>
                    </div>

                    {/* Cuadro de salidas hoy */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Salidas hoy</h3>
                        <p className="text-3xl font-bold ">{salidasHoy}</p>
                    </div>
                </div>
            </div>
        </NavBarAlmacen>
    );
};

export default Dashboard;