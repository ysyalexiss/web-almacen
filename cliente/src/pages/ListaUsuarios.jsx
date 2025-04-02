import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import NavBarAlmacen from "../components/NavBarAlmacen";
import { actualizarUsuario, obtenerUsuario } from "../api/Usuarios.api"; 

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [editando, setEditando] = useState(null); // ID del usuario 
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); 

    // Obtener la lista de usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:8000/tareas/api/usuarios/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                setUsuarios(response.data);
            } catch (err) {
                setError("No se pudo obtener la lista de usuarios.");
            }
        };

        fetchUsuarios();
    }, []);

    //  edición de un usuario
    const handleEditar = (usuario) => {
        console.log("ID del usuario seleccionado para editar:", usuario.id); 
        setEditando(usuario.id); //  ID del usuario en edición
        setFormData({
            username: usuario.username,
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            rol: usuario.rol,
            is_active: usuario.is_active,
        });
    };

    // Manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Guardar los cambios del usuario
    const handleGuardar = async (id) => {
        try {
            const response = await actualizarUsuario(id, formData); //  función de la API
            // Actualiza la lista de usuarios con los nuevos datos
            setUsuarios(usuarios.map((u) => (u.id === id ? response.data : u)));
            setEditando(null); 
        } catch (err) {
            setError("No se pudo actualizar el usuario.");
        }
    };

    // Cancelar la edición
    const handleCancelar = () => {
        setEditando(null);
    };

    // Redirigir a la vista de registro
    const handleRegistrarUsuario = () => {
        navigate("/registro");
    };

    return (
        <NavBarAlmacen>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
                    <button
                        onClick={handleRegistrarUsuario}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Registrar Usuario
                    </button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Usuario</th>
                            <th className="border border-gray-300 p-2">Nombre</th>
                            <th className="border border-gray-300 p-2">Email</th>
                            <th className="border border-gray-300 p-2">Teléfono</th>
                            <th className="border border-gray-300 p-2">Dirección</th>
                            <th className="border border-gray-300 p-2">Rol</th>
                            <th className="border border-gray-300 p-2">Activo</th>
                            <th className="border border-gray-300 p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">
                                    {editando === usuario.id ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        usuario.username
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {editando === usuario.id ? (
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        `${usuario.first_name} ${usuario.last_name}`
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {editando === usuario.id ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        usuario.email
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {editando === usuario.id ? (
                                        <input
                                            type="text"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        usuario.telefono
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {editando === usuario.id ? (
                                        <input
                                            type="text"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        usuario.direccion
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {editando === usuario.id ? (
                                        <select
                                            name="rol"
                                            value={formData.rol}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        >
                                            <option value="comun">Común</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    ) : (
                                        usuario.rol
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {editando === usuario.id ? (
                                        <select
                                            name="is_active"
                                            value={formData.is_active}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        >
                                            <option value={true}>Activo</option>
                                            <option value={false}>Inactivo</option>
                                        </select>
                                    ) : (
                                        usuario.is_active ? "Activo" : "Inactivo"
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {editando === usuario.id ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleGuardar(usuario.id)}
                                                className="bg-green-500 text-white p-1 rounded"
                                            >
                                                <FaSave />
                                            </button>
                                            <button
                                                onClick={handleCancelar}
                                                className="bg-red-500 text-white p-1 rounded"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEditar(usuario)}
                                            className="bg-blue-500 text-white p-1 rounded"
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </NavBarAlmacen>
    );
};

export default ListaUsuarios;