import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/tareas/api/',
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Error de respuesta:', error.response.data);
        } else if (error.request) {
            console.error('Error de red:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const getProveedores = () => api.get('/proveedores/');

export const getMateriales = () => api.get('/materiales/');

export const crearNotaEntrada = (data) => api.post('/nota-entrada/', data);

export const verificarFactura = async (factura) => {
    try {
        const response = await api.post("/verificar-factura/", {
            factura: factura,
        });
        return response.data.existe; 
    } catch (error) {
        console.error("Error al verificar la factura:", error);
        return false; // asumimos que la factura no existe
    }
};

export const verificarFolioFiscal = async (folioFiscal) => {
    try {
        const response = await api.post("/verificar-folio-fiscal/", {
            folio_fiscal: folioFiscal,
        });
        console.log("Respuesta del backend:", response.data); // depuración
        return response.data.existe;
    } catch (error) {
        console.error("Error al verificar el folio fiscal:", error);
        return false;
    }
};