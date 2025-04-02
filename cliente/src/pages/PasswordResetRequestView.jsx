import React, { useState } from "react";

export default function PasswordResetRequest() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await fetch("http://localhost:8000/tareas/api/password-reset/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Recuperar Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="Correo Electrónico"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                    {message && <p className="text-sm text-green-500 mb-4">{message}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                    >
                        Enviar Solicitud
                    </button>
                    <p className="text-sm text-center mt-4">
                        
                        <a href="/Login" className="text-indigo-600 hover:underline">
                            Volver
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}