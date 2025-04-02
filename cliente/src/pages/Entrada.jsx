import React, { useState, useEffect, useRef } from "react";
import { getProveedores, getMateriales, verificarFactura, verificarFolioFiscal } from "../api/Entradas.api";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import NavBarAlmacen from "../components/NavBarAlmacen";
import { toast } from "react-hot-toast";

const Entrada = () => {
    const [proveedores, setProveedores] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [notaEntrada, setNotaEntrada] = useState({
        proveedor: "",
        factura: "",
        folioFiscal: "",
        fecha: new Date().toISOString().split("T")[0],
        departamento: "",
        detalles: [
            {   
                material: "",
                articulo: "",
                cantidad: "",
                unidad: "PZA",
                precioUnitario: 0,
                costoTotal: 0,
            },
        ],
    });
    const [facturaExistente, setFacturaExistente] = useState(false);
    const [folioFiscalExistente, setFolioFiscalExistente] = useState(false);
    const folioFiscalMask = "________-____-____-____-____________";
    const navigate = useNavigate();
    const folioFiscalRef = useRef(null);
    const [entradaGuardada, setEntradaGuardada] = useState(null); 
    const today = new Date();
    const minDate = new Date(2025, 0, 1) 
        .toISOString()
        .split("T")[0];

    const maxDate = new Date(2025, 11, 31) 
        .toISOString()
        .split("T")[0];

    useEffect(() => {
        getProveedores().then((response) => setProveedores(response.data));
        getMateriales().then((response) => setMateriales(response.data));
        
    }, []);

    const handleDepartamentoChange = (e) => {
        setNotaEntrada({ ...notaEntrada, departamento: e.target.value });
    };

    useEffect(() => {
        if (notaEntrada.folioFiscal && isValidFolioFiscal(notaEntrada.folioFiscal)) {
            const verificarFolioFiscalExistente = async () => {
                try {
                    const existe = await verificarFolioFiscal(notaEntrada.folioFiscal);
                    console.log("Folio fiscal existe:", existe); // Depuración
                    setFolioFiscalExistente(existe);
                } catch (error) {
                    console.error("Error al verificar el folio fiscal:", error);
                }
            };
            verificarFolioFiscalExistente();
        }
    }, [notaEntrada.folioFiscal]);

    useEffect(() => {
        if (notaEntrada.folioFiscal && isValidFolioFiscal(notaEntrada.folioFiscal)) {
            const verificarFolioFiscalExistente = async () => {
                try {
                    const existe = await verificarFolioFiscal(notaEntrada.folioFiscal);
                    console.log("Folio fiscal existe:", existe); // Depuracion
                    setFolioFiscalExistente(existe);
                } catch (error) {
                    console.error("Error al verificar el folio fiscal:", error);
                }
            };
            verificarFolioFiscalExistente();
        }
    }, [notaEntrada.folioFiscal]);

    const formatFolioFiscal = (value) => {
        const cleanedValue = value.replace(/-/g, "");
        const formattedValue = cleanedValue
            .replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5")
            .toUpperCase();
        return formattedValue;
    };

    const isValidFolioFiscal = (folioFiscal) => {
        const folioFiscalRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        return folioFiscalRegex.test(folioFiscal);
    };

    const formatFolioFiscalWithMask = (value) => {
        const cleanedValue = value.replace(/-/g, "").toUpperCase().slice(0, 32);
        let formatted = folioFiscalMask.split("");
        let index = 0;
    
        for (let i = 0; i < formatted.length; i++) {
            if (formatted[i] === "_" && index < cleanedValue.length) {
                formatted[i] = cleanedValue[index];
                index++;
            }
        }
    
        return formatted.join("");
    };
    
    const handleFolioFiscalChange = (e) => {
        const input = e.target;
        const value = input.value.replace(/[^0-9A-F]/gi, "");
        const formattedValue = formatFolioFiscalWithMask(value);
    
        setNotaEntrada({ ...notaEntrada, folioFiscal: formattedValue });
    
        setTimeout(() => {
            let nextCursorPosition = formattedValue.indexOf("_");
            if (nextCursorPosition === -1) nextCursorPosition = formattedValue.length;
            input.setSelectionRange(nextCursorPosition, nextCursorPosition);
        }, 0);
    };
    
    const handleFolioFiscalFocus = (e) => {
        if (!notaEntrada.folioFiscal.trim()) {
            setNotaEntrada({ ...notaEntrada, folioFiscal: folioFiscalMask });
        }
    
        setTimeout(() => {
            e.target.setSelectionRange(0, 0);
        }, 0);
    };
    
    const handleFolioFiscalKeyDown = (e) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const input = e.target;
            let value = notaEntrada.folioFiscal.replace(/_/g, "").replace(/-/g, "");
    
            if (value.length > 0) {
                value = value.slice(0, -1); 
            }
    
            const formattedValue = value.length === 0 ? "" : formatFolioFiscalWithMask(value);
            setNotaEntrada({ ...notaEntrada, folioFiscal: formattedValue });
    
            setTimeout(() => {
                let nextCursorPosition = formattedValue.indexOf("_");
                if (nextCursorPosition === -1) nextCursorPosition = formattedValue.length;
                input.setSelectionRange(nextCursorPosition, nextCursorPosition);
            }, 0);
        }
    };
    
    const handleProveedorChange = (e) => {
        setNotaEntrada({ ...notaEntrada, proveedor: e.target.value });
    };

    const handleDetalleChange = (index, field, value) => {
        if (field === "cantidad" && value < 0) return;
        if (field === "precioUnitario" && value < 0) return;

        const nuevosDetalles = [...notaEntrada.detalles];
        nuevosDetalles[index][field] = value;

        if (field === "cantidad" || field === "precioUnitario") {
            nuevosDetalles[index].costoTotal =
                nuevosDetalles[index].cantidad * nuevosDetalles[index].precioUnitario;
        }

        setNotaEntrada({ ...notaEntrada, detalles: nuevosDetalles });
    };

    const agregarFila = () => {
        setNotaEntrada({
            ...notaEntrada,
            detalles: [
                ...notaEntrada.detalles,
                { material: "", articulo: "", cantidad: 1, unidad: "PZA", precioUnitario: 0, costoTotal: 0 },
            ],
        });
    };

    const guardarEntrada = async () => {
        console.log("Validando folio fiscal existente:", folioFiscalExistente); // Depuración
        console.log("Validando factura existente:", facturaExistente); // Depuración
    
        // Verifica el folio fiscal nuevamente antes de guardar
        if (notaEntrada.folioFiscal && isValidFolioFiscal(notaEntrada.folioFiscal)) {
            const existeFolio = await verificarFolioFiscal(notaEntrada.folioFiscal);
            if (existeFolio) {
                toast.error("Ya existe una entrada con este folio fiscal.", {
                    position: "bottom-right",
                    style: {
                        background: "#101010", // Fondo negro
                        color: "#fff", // Letras rojas
                    },
                });
                return;
            }
        }
    
        // Verifica la factura nuevamente antes de guardar
        if (notaEntrada.factura) {
            const existeFactura = await verificarFactura(notaEntrada.factura);
            if (existeFactura) {
                toast.error("Ya existe una entrada con esta factura.", {
                    position: "bottom-right",
                    style: {
                        background: "#101010", // Fondo negro
                        color: "#ff0000", // Letras rojas
                    },
                });
                return;
            }
        }
    
        if (!notaEntrada.proveedor || !notaEntrada.factura || !notaEntrada.folioFiscal || !notaEntrada.fecha) {
            toast.error("Por favor, complete todos los campos.", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
            return;
        }
        if (!notaEntrada.folioFiscal.trim()) {
            toast.error("El folio fiscal es requerido.", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
            return;
        }
        if (folioFiscalExistente) { 
            toast.error("Ya existe una entrada con este folio fiscal.");
            return;
        }
        if (facturaExistente) {
            toast.error("Ya existe una entrada con esta factura.", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
            return;
        }
        if (!isValidFolioFiscal(notaEntrada.folioFiscal)) {
            toast.error("El folio fiscal no tiene un formato válido.");
            return;
        }
        for (const detalle of notaEntrada.detalles) {
            if (!detalle.material) {
                toast.error("Por favor, seleccione un material para todos los detalles.", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
                return;
            }
            if (detalle.precioUnitario <= 0) {
                toast.error("El precio unitario debe ser mayor que 0.", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
                return;
            }
        }
        try {
            const proveedorSeleccionado = proveedores.find(proveedor => proveedor.id === parseInt(notaEntrada.proveedor, 10));
            const nombreProveedor = proveedorSeleccionado ? proveedorSeleccionado.nombre_proveedor : '';
            const requestBody = {
                proveedor: nombreProveedor,
                factura: notaEntrada.factura,
                folio_fiscal: notaEntrada.folioFiscal,
                fecha: notaEntrada.fecha,
                detalles: notaEntrada.detalles.map(detalle => ({
                    material: parseInt(detalle.material, 10),
                    articulo: detalle.articulo,
                    cantidad: parseFloat(detalle.cantidad),
                    unidad: detalle.unidad,
                    precio_unitario: parseFloat(detalle.precioUnitario),
                    costo_total: parseFloat(detalle.costoTotal),
                })),
            };
            const response = await axios.post('http://localhost:8000/tareas/api/nota-entrada/', requestBody);
            toast.success('Nota de entrada guardada con éxito', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
            setEntradaGuardada(requestBody); // Almacena los datos enviados al servidor
            return requestBody; // Retorna los datos enviados
        } catch (error) {
            console.error('Error al crear la nota de entrada:', error.response ? error.response.data : error.message);
            toast.error('No puedes repetir una factura.', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await guardarEntrada();
    };

    const handleContinuarSalida = async (e) => {
        e.preventDefault();
        try {
            if (!entradaGuardada) {
                toast.error("Primero debes guardar la entrada.", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
                return;
            }

            navigate("/salidas", {
                state: {
                    entrada: entradaGuardada,  // Pasar los datos de la entrada guardada a la página de salida
                },
            });
        } catch (error) {
            console.error("Error al continuar a salida:", error);
        }
    };
    

    return (
        <NavBarAlmacen>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Nota de Entrada</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Proveedor</label>
                        <select
                            value={notaEntrada.proveedor}
                            onChange={handleProveedorChange}
                            className="w-90 p-2 border rounded"
                            required
                        >
                            <option value="" className="text-gray-900">Seleccione un proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id} value={proveedor.id}>
                                    {proveedor.nombre_proveedor}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Factura</label>
                        <input
                            type="text"
                            name="factura"
                            value={notaEntrada.factura}
                            onChange={(e) => {
                                const valorNumerico = e.target.value.replace(/\D/g, ""); 
                                setNotaEntrada({ ...notaEntrada, factura: valorNumerico });
                            }}
                            placeholder="Ingrese número de factura"
                            className="w-65 p-2 border rounded"
                            maxLength={20} 
                        />
                        {facturaExistente && (
                            <span className="text-red-500">Ya existe una entrada con esta factura.</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Folio Fiscal</label>
                        <input
                            type="text"
                            value={notaEntrada.folioFiscal}
                            onChange={handleFolioFiscalChange}
                            onFocus={handleFolioFiscalFocus}
                            onKeyDown={handleFolioFiscalKeyDown}
                            ref={folioFiscalRef}
                            className="w-90 p-2 border rounded"
                            required
                        />
                        {folioFiscalExistente && (
                            <span className="text-red-500">Ya existe una entrada con este folio fiscal.</span>
                        )}
                        {!isValidFolioFiscal(notaEntrada.folioFiscal) && notaEntrada.folioFiscal && (
                            
                            <span className="text-red-500"><br></br>El folio fiscal no tiene un formato válido.</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={notaEntrada.fecha}
                            onChange={(e) => setNotaEntrada({ ...notaEntrada, fecha: e.target.value })}
                            min={minDate}
                            max={maxDate}
                            className="p-1 border rounded"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={agregarFila}
                        className="bg-blue-500 text-white p-2 rounded mb-4"
                    >
                        Agregar Fila
                    </button>

                    <table className="w-full mb-4">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Artículo</th>
                                <th>Cantidad</th>
                                <th>Unidad</th>
                                <th>Precio Unitario</th>
                                <th>Costo Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notaEntrada.detalles.map((detalle, index) => (
                                <tr key={index}>
                                    <td>
                                        <select
                                            value={detalle.material || ""}
                                            onChange={(e) => handleDetalleChange(index, "material", e.target.value)}
                                            className="w-full p-2 border rounded"
                                            required
                                        >
                                            <option value="">Seleccione un material</option>
                                            {materiales.map((material) => (
                                                <option key={material.codigo} value={material.codigo}>
                                                    {material.codigo} - {material.material_servicio}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={detalle.articulo}
                                            onChange={(e) => handleDetalleChange(index, "articulo", e.target.value)}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={detalle.cantidad}
                                            onChange={(e) => handleDetalleChange(index, "cantidad", parseFloat(e.target.value))}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={detalle.unidad}
                                            onChange={(e) => handleDetalleChange(index, "unidad", e.target.value)}
                                            className="w-full p-2 border rounded"
                                            required
                                        >
                                            <option value="PZA">PZA</option>
                                            <option value="PAQ">PAQ</option>
                                            <option value="CAJA">CAJA</option>
                                            <option value="ROLLO">ROLLO</option>
                                            <option value="MTR">METRO</option>
                                            <option value="LT">LITRO</option>
                                            <option value="KILO">KILO</option>
                                            <option value="GALON">GALÓN</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={detalle.precioUnitario}
                                            onChange={(e) => handleDetalleChange(index, "precioUnitario", parseFloat(e.target.value))}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={detalle.costoTotal}
                                            readOnly
                                            className="w-full p-2 border rounded"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-green-500 text-white p-2 rounded flex-1"
                        >
                            Guardar Entrada
                        </button>
                        <button
                            type="button"
                            onClick={handleContinuarSalida}
                            className="bg-yellow-500 text-white p-2 rounded flex-1"
                            disabled={!entradaGuardada}
                        >
                            Continuar a Salida
                        </button>
                    </div>
                </form>
            </div>
        </NavBarAlmacen>
    );
};

export default Entrada;