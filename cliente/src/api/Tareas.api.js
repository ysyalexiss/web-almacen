import axios from 'axios'

const tareasApi = axios.create({
    baseURL: 'http://localhost:8000/tareas/api/v1/tareas/'
});



export const getAllTareas = () => tareasApi.get("/");

export const getTask = (id) => tareasApi.get(`/${id}/`);

export const crearTarea = (tarea) => tareasApi.post('/', tarea);

export const deleteTask = (id) => tareasApi.delete(`/${id}/`);

export const updateTarea = (id, tarea) => tareasApi.put(`/${id}/`, tarea);