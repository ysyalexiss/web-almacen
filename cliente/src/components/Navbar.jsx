// components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Elimina los tokens de localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Redirige al usuario a la página de inicio de sesión
        navigate("/login");
    };

    return (
        <nav>
            <h1>Mi Aplicación</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
    );
};

export default Navbar;