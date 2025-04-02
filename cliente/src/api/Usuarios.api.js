import axios from 'axios';


const usuariosApi = axios.create({
    baseURL: 'http://localhost:8000/tareas/api/', 
});

// Función para registrar un nuevo usuario
export const registrarUsuario = (usuario) => usuariosApi.post('/registro/', usuario);

// Función para iniciar sesión
export const iniciarSesion = (credenciales) => usuariosApi.post('/login/', credenciales);

// Función para obtener la información de un usuario específico
export const obtenerUsuario = (id) => usuariosApi.get(`/usuarios/${id}/`);

// Función para actualizar un usuario
export const actualizarUsuario = (id, usuario) => usuariosApi.put(`/usuarios/${id}/`, usuario, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
});

// Función para eliminar un usuario
export const eliminarUsuario = (id) => usuariosApi.delete(`/usuarios/${id}/`);


usuariosApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

       
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // refrescar el token
                const refreshToken = localStorage.getItem("refresh_token");
                const response = await axios.post('http://localhost:8000/tareas/api/token/refresh/', {
                    refresh: refreshToken,
                });

                // Guarda el nuevo access token
                localStorage.setItem("access_token", response.data.access);

                
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return usuariosApi(originalRequest);
            } catch (refreshError) {
                
                console.error("No se pudo refrescar el token:", refreshError);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login"; // Redirige al login
            }
        }

        return Promise.reject(error);
    }
);

export const obtenerUsuarios = () => usuariosApi.get('/usuarios/', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
});

