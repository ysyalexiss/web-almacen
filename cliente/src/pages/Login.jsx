import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica si el usuario ya está autenticado
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch("http://localhost:8000/tareas/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // Guarda los tokens en localStorage
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
                sessionStorage.clear();
                console.log(localStorage.getItem('token')); 

                localStorage.setItem("username", data.username);

                // Redirige al usuario al dashboard o a la página principal
                navigate("/dashboard");
            } else {
                setError(data.error || "Credenciales inválidas");
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
                
                <div className="flex flex-col items-center mb-8">
                    <div className="flex space-x-4 mb-4">
                        <img
                            src="/src/imagenes/logotecnm.png" 
                            alt="Logo 1"
                            className="w-16 h-16"
                        />
                        <img
                            src="/src/imagenes/logo.png" 
                            alt="Logo 2"
                            className="w-16 h-16"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800">
                        INSTITUTO TECNOLÓGICO DE OAXACA
                    </h1>
                </div>

                {/* Formulario de inicio de sesión */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="Usuario"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="Contraseña"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                    >
                        Iniciar sesión
                    </button>
                    <p className="text-sm text-center mt-4">
                        ¿No recuerdas tu contraseña?{" "}
                        <a href="/password-reset" className="text-indigo-600 hover:underline">
                            Recuperar cuenta
                        </a>
                    </p>
                    
                </form>
            </div>
        </div>
    );

}