import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./componentes/common/Header";
import Footer from "./componentes/common/Footer";
import PaginaInicioSesion from "./componentes/Paginas/PaginaInicioSesion";
import PaginaRegistro from "./componentes/Paginas/PaginaRegistro";
import PaginaHome from "./componentes/Paginas/PaginaHome";
// Relacionado con Administradores
import PaginaPanelAdmin from "./componentes/Paginas/PaginaPanelAdmin";
// Relacionado con Usuarios
import PaginaPanelUsuarios from "./componentes/Paginas/PaginaPanelUsuarios";
import "./App.css";
import PaginaCursos from "./componentes/Paginas/PaginaCursos";
import CrearCurso from "./componentes/cursos/CrearCurso";
import DetallesDelCurso from "./componentes/cursos/DetallesDelCurso";
import ProfesorDashboard from "./componentes/dashboard/ProfesorDashboard";
import RealizarCurso from "./componentes/cursos/RealizarCurso";
import CrearEvaluacion from "./componentes/evaluacion/CrearEvaluacion";
import CrearForo from "./componentes/foro/CrearForo";
import ListaForos from "./componentes/foro/ListaForos";
import DetallesForo from "./componentes/foro/DetallesForo";

// Componente para proteger las rutas que requieren autenticación y roles específicos
const ProtectedRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // Si no hay token, redirige a la página de inicio de sesión
  if (!token) {
    return <Navigate to="/PaginaInicioSesion" />;
  }

  // Si se requiere un rol específico y no coincide, redirige a la página de inicio
  if (requiredRole && parseInt(userRole) !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Si tiene el token y cumple con el rol requerido, muestra el componente
  return element;
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PaginaHome />} />
        <Route path="/PaginaRegistro" element={<PaginaRegistro />} />
        <Route path="/PaginaInicioSesion" element={<PaginaInicioSesion />} />
        {/* Ruta protegida para administradores */}
        <Route
          path="/PaginaPanelAdmin"
          element={
            <ProtectedRoute element={<PaginaPanelAdmin />} requiredRole={1} />
          }
        />
        <Route
          path="/CrearCurso"
          element={<ProtectedRoute element={<CrearCurso />} requiredRole={1} />}
        />
        <Route
          path="/ProfesorDashboard"
          element={
            <ProtectedRoute element={<ProfesorDashboard />} requiredRole={1} />
          }
        />
        {/* Ruta protegida para usuarios */}
        <Route
          path="/PaginaPanelUsuarios"
          element={
            <ProtectedRoute
              element={<PaginaPanelUsuarios />}
              requiredRole={2}
            />
          }
        />
        <Route path="/PaginaHome" element={<PaginaHome />} />
        <Route path="/PaginaCursos" element={<PaginaCursos />} />
        <Route path="/curso/:id" element={<DetallesDelCurso />} />
        <Route path="/CrearEvaluacion" element={<CrearEvaluacion />} />
        <Route path="/curso/:id/realizar" element={<RealizarCurso />} />
        <Route path="/CrearForo" element={<CrearForo />} />
        <Route path="/ListaForos" element={<ListaForos />} />
        <Route path="/foros/:id" element={<DetallesForo />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
