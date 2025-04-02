import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarker, FaIdBadge } from "react-icons/fa";
import NavBarAlmacen from "../components/NavBarAlmacen"; 

export default function Registro() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        telefono: "",
        direccion: "",
        rol: "comun"
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Función para validar que solo se ingresen números en el campo de teléfono
    const handleTelefonoChange = (e) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) { 
            setFormData({ ...formData, telefono: value });
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 

        try {
            const response = await fetch("http://localhost:8000/tareas/api/registro/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                navigate("/login"); // Redirigir al login si el registro es exitoso
            } else {
                
                if (data.username) {
                    setError("El nombre de usuario ya está registrado.");
                } else if (data.email) {
                    setError("El correo electrónico ya está registrado.");
                } else {
                    setError(data.error || "Error al registrar el usuario.");
                }
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor.");
        }
    };

    return (
        <NavBarAlmacen> {/* Envuelve el contenido con NavBarAlmacen */}
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Registro de Usuario</h1>
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
                        <form onSubmit={handleSubmit}>
                            {/* Campo Nombre */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaUser className="text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        placeholder="Nombre"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Campo Apellido */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaUser className="text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        placeholder="Apellido"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Campo Usuario */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaIdBadge className="text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        placeholder="Usuario"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Campo Contraseña */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaLock className="text-gray-400" />
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        placeholder="Contraseña"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Campo Email */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaEnvelope className="text-gray-400" />
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Campo Teléfono */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaPhone className="text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleTelefonoChange} 
                                        className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        placeholder="Teléfono"
                                        maxLength={10}
                                        minLength={10}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Campo Dirección */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaMapMarker className="text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        placeholder="Dirección"
                                        maxLength={40}
                                    />
                                </div>
                            </div>

                            {/* Campo Rol */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                                <select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                >
                                    <option value="comun">Común</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            {/* Mensaje de error */}
                            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                            {/* Botón de registro */}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                            >
                                Registrar
                            </button>

                            {/* Enlace para volver al login */}
                            <p className="text-sm text-center mt-4">
                                Volver Iniciar Sesión{" "}
                                <a href="/login" className="text-indigo-600 hover:underline">
                                    Vuelve
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </NavBarAlmacen>
    );
}