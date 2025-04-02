import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import NavBarAlmacen from "../components/NavBarAlmacen";

const ListaEntradas = () => {
    const [entradas, setEntradas] = useState([]); 
    const [busqueda, setBusqueda] = useState(""); 
    const [entradasFiltradas, setEntradasFiltradas] = useState([]); // Lista filtrada de entradas
    const navigate = useNavigate(); 

 
    useEffect(() => {
        const fetchEntradas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tareas/api/nota-entrada/list/');
                
                // Ordenar por fecha descendente
                const entradasOrdenadas = response.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
                setEntradas(entradasOrdenadas);
                setEntradasFiltradas(entradasOrdenadas); // Mostrar las entradas ordenadas
            } catch (error) {
                console.error("Error al obtener las entradas:", error);
            }
        };
    
        fetchEntradas();
    }, []);
    

    // Función para  la búsqueda
    const handleBusqueda = (e) => {
        const valor = e.target.value;
        setBusqueda(valor);

       
        const filtradas = entradas.filter((entrada) =>
            entrada.factura.toLowerCase().includes(valor.toLowerCase())
        );
        setEntradasFiltradas(filtradas);
    };

    // Fver los detalles de una entrada
    const handleVerDetalles = (entrada) => {
        navigate("/salidas", { state: { entrada } });
    };

    return (
        <NavBarAlmacen> 
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Entradas Guardadas</h1>

                {/* Campo de búsqueda */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por número de factura"
                        value={busqueda}
                        onChange={handleBusqueda}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                </div>

                {/* Tabla de entradas */}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Proveedor</th>
                            <th className="border border-gray-300 p-2">Factura</th>
                            <th className="border border-gray-300 p-2">Folio Fiscal</th>
                            <th className="border border-gray-300 p-2">Fecha</th>
                            <th className="border border-gray-300 p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entradasFiltradas.map((entrada) => (
                            <tr key={entrada.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">{entrada.proveedor}</td>
                                <td className="border border-gray-300 p-2">{entrada.factura}</td>
                                <td className="border border-gray-300 p-2">{entrada.folio_fiscal}</td>
                                <td className="border border-gray-300 p-2">{entrada.fecha}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handleVerDetalles(entrada)}
                                        className="bg-blue-500 text-white p-2 rounded"
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </NavBarAlmacen>
    );
};

export default ListaEntradas;