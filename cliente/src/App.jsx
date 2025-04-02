import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Tareas } from './pages/Tareas.jsx';
import { TareasForm } from './pages/tareasform.';
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import { Navigation } from './components/Navigation';
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Entrada from "./pages/Entrada.jsx";
import Salidas from "./pages/Salidas.jsx"; 
import PasswordResetRequestView from './pages/PasswordResetRequestView.jsx';
import ListaUsuarios from './pages/ListaUsuarios.jsx';
import ListaEntradas from "./pages/ListaEntradas";

function AppContent() {
    const location = useLocation();
    const hideNavRoutes = ["/login", "/registro", "/entrada", "/dashboard", "/tareas", "/tareas-create", "/tareas/:id", "/salidas" ]; // Rutas donde NO mostrar Navigation

    useEffect(() => {
        const handleBackButton = (e) => {
            e.preventDefault();
            window.history.pushState(null, "", window.location.pathname);
        };

        window.history.pushState(null, "", window.location.pathname);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, []);

    return (
        <div className="flex-1 flex flex-col bg-white overflow-auto">
        <Routes>
            <Route path="/" element={<Navigate to='/login' />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/tareas" element={<Tareas />} />
            <Route path="/tareas-create" element={<TareasForm />} />
            <Route path="/tareas/:id" element={<TareasForm />} />
            <Route path="/entrada" element={<Entrada />} />
            <Route path="/lista-entradas" element={<ListaEntradas />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/salidas" element={<Salidas />} />
                <Route path="/password-reset" element={<PasswordResetRequestView />} />
                <Route path="/usuarios" element={<ListaUsuarios />} />
                <Route path="/usuarios/:id" element={<ListaUsuarios />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster />
    </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;