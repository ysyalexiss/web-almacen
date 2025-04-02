import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavBarAlmacen = ({ children }) => {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Obtener el nombre del usuario desde localStorage
    const username = localStorage.getItem("username") || "Usuario";

    const verifyToken = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        try {
            const response = await fetch("http://localhost:8000/tareas/api/token/verify/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: refreshToken }),
            });
    
            if (!response.ok) {
                console.warn("El refresh token ya expiró. Se eliminarán las credenciales.");
                localStorage.clear();
                navigate("/login");
            }
        } catch (error) {
            console.error("Error verificando el token:", error);
        }
    };
    
    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
    
            const response = await fetch("http://localhost:8000/tareas/api/logout/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh_token: refreshToken }) // Enviar en el cuerpo
            });
    
            if (response.ok) {
                localStorage.clear();
                navigate("/login");
            } else {
                const errorData = await response.json();
                console.error("Error during logout:", errorData);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Menú lateral */}
            <div
                className={`bg-blue-800 text-white ${isMenuCollapsed ? "w-16" : "w-64"
                    } h-screen transition-all duration-300 ease-in-out`}
            >
                <div className="p-4 flex justify-between items-center">
                    {!isMenuCollapsed && (
                        <span className="text-lg font-bold">Menú</span>
                    )}
                    <button
                        onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                        className="p-2 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
                <nav className="mt-4">
                    <ul>
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    navigate("/dashboard"); 
                                }}
                                className="flex items-center p-4 hover:bg-blue-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                </svg>

                                {!isMenuCollapsed && (
                                    <span className="ml-2">Dashboard</span>
                                )}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    navigate("/entrada"); 
                                }}
                                className="flex items-center p-4 hover:bg-blue-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>

                                {!isMenuCollapsed && (
                                    <span className="ml-2">Entrada</span>
                                )}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/lista-entradas"); 
                                }}
                                className="flex items-center p-4 hover:bg-blue-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>

                                {!isMenuCollapsed && (
                                    <span className="ml-2">Salidas</span>
                                )}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    navigate("/tareas"); 
                                }}
                                className="flex items-center p-4 hover:bg-blue-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>

                                {!isMenuCollapsed && (
                                    <span className="ml-2">Tareas</span>
                                )}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    navigate("/usuarios"); 
                                }}
                                className="flex items-center p-4 hover:bg-blue-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                </svg>

                                {!isMenuCollapsed && (
                                    <span className="ml-2">Usuarios</span>
                                )}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col bg-white h-screen overflow-auto p-6">
                {/* Encabezado superior */}
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    {/* Lado izquierdo: Logo y texto */}
                    <div className="flex items-center space-x-4">
                        <img
                            src="/src/imagenes/logo.png"
                            alt="Logo"
                            className="h-10 w-10 rounded-full"
                        />
                        <h1 className="text-xl font-bold text-gray-800">ALMACÉN ITO</h1>
                    </div>

                    {/* Lado derecho: Nombre del usuario y menú desplegable */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 focus:outline-none"
                        >
                            <span className="text-gray-800 font-medium">{username}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-800"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Menú desplegable */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Contenido de la página */}
                <main className="flex-1 p-4 bg-gray-50 text-gray-800">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default NavBarAlmacen;