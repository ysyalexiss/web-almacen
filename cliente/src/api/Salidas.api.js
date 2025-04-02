// api/Salidas.api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/tareas/api/',
});

export const getSalidas = () => api.get('/salidas/');
export const crearSalida = (data) => api.post('/salidas/', data);


export const buscarSalidaPorFactura = async (factura) => {
    try {
        const response = await axios.get(`http://localhost:8000/tareas/api/salidas/buscar/?factura=${factura}`);
        return response.data; 
    } catch (error) {
        console.error("Error al buscar la salida:", error);
        throw error;
    }
};