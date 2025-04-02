import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { crearSalida } from "../api/Salidas.api"; 
import NavBarAlmacen from "../components/NavBarAlmacen";

const Salidas = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [entrada, setEntrada] = useState(null);
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); 
    const [subtotal, setSubtotal] = useState(0);
    const [observaciones, setObservaciones] = useState({}); 
    const [guardado, setGuardado] = useState(false); 
    useEffect(() => {
        // Obtener los datos de la entrada desde el estado de la navegación
        if (location.state && location.state.entrada) {
            console.log("Datos de la entrada recibidos:", location.state.entrada);
            setEntrada(location.state.entrada);
            calcularSubtotal(location.state.entrada.detalles);

            
            const obsInicial = location.state.entrada.detalles.reduce((acc, detalle, index) => {
                acc[index] = detalle.observaciones || "";
                return acc;
            }, {});
            setObservaciones(obsInicial);

            // Verificar si la entrada ya ha sido guardada
            if (location.state.entrada.guardado) {
                setGuardado(true);
            }
        }
    }, [location.state]);

    const calcularSubtotal = (detalles) => {
        const total = detalles.reduce((sum, detalle) => sum + parseFloat(detalle.costo_total), 0);
        setSubtotal(total);
    };

    // Función para manejar cambios en las observaciones
    const handleObservacionesChange = (index, value) => {
        setObservaciones((prev) => ({
            ...prev,
            [index]: value, 
        }));
    };

    const handleGuardarSalida = async () => {
        if (!entrada) {
            alert("No hay datos de entrada para guardar la salida.");
            return;
        }

        const salidaData = {
            proveedor: entrada.proveedor,
            factura: entrada.factura,
            folio_fiscal: entrada.folio_fiscal,
            fecha: fecha,
            subtotal: subtotal,
            detalles: entrada.detalles.map((detalle, index) => ({
                descripcion: detalle.articulo,
                unidad: detalle.unidad,
                cantidad: parseFloat(detalle.cantidad),
                precio_unitario: parseFloat(detalle.precio_unitario),
                importe: parseFloat(detalle.costo_total),
                observaciones: observaciones[index] || "", 
            })),
        };

       
        console.log("Datos que se enviarán:", salidaData);

        try {
            await crearSalida(salidaData);
            alert("Salida guardada con éxito");
            setGuardado(true); 
            navigate("/dashboard"); 
        } catch (error) {
            console.error("Error al guardar la salida:", error);
            alert("Hubo un error al guardar la salida. Verifica la consola para más detalles.");
        }
    };

    if (!entrada) {
        return <div className="p-4 text-center">Cargando...</div>;
    }

    return (
        <NavBarAlmacen>
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Salida de Almacén</h1>

                {/* Indicador de que la entrada ya ha sido guardada */}
                {guardado && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                        <p className="font-bold">Entrada Guardada</p>
                        <p>Esta entrada ya ha sido guardada. Puedes editar las observaciones si es necesario.</p>
                    </div>
                )}

                {/* Sección de información general */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-700 font-semibold">Proveedor:</p>
                            <p className="text-gray-900">{entrada.proveedor || "No disponible"}</p>
                        </div>
                        <div>
                            <p className="text-gray-700 font-semibold">No. Factura:</p>
                            <p className="text-gray-900">{entrada.factura}</p>
                        </div>
                        <div>
                            <p className="text-gray-700 font-semibold">Folio Fiscal:</p>
                            <p className="text-gray-900">{entrada.folio_fiscal}</p>
                        </div>
                        <div>
                            <p className="text-gray-700 font-semibold">Fecha:</p>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="border rounded p-2 text-gray-900 w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla de detalles */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left text-gray-700">Descripción del Producto</th>
                                <th className="p-3 text-left text-gray-700">Unidad</th>
                                <th className="p-3 text-left text-gray-700">Cantidad</th>
                                <th className="p-3 text-left text-gray-700">Precio Unitario</th>
                                <th className="p-3 text-left text-gray-700">Importe</th>
                                <th className="p-3 text-left text-gray-700">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entrada.detalles.map((detalle, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-3 text-gray-900">{detalle.articulo}</td>
                                    <td className="p-3 text-gray-900">{detalle.unidad}</td>
                                    <td className="p-3 text-gray-900">{detalle.cantidad}</td>
                                    <td className="p-3 text-gray-900">${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                                    <td className="p-3 text-gray-900">${parseFloat(detalle.costo_total).toFixed(2)}</td>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            value={observaciones[index] || ""}
                                            onChange={(e) => handleObservacionesChange(index, e.target.value)} 
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Observaciones"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sección de subtotal y botón de guardar */}
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                    <p className="text-xl font-semibold text-gray-800">Subtotal: ${subtotal.toFixed(2)}</p>
                    <button
                        onClick={handleGuardarSalida}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Guardar Salida
                    </button>
                </div>
            </div>
        </NavBarAlmacen>
    );
};

export default Salidas;