import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../hojas-de-estilos/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") !== null; // Verifica si hay un token
  const rol = localStorage.getItem("userRole"); // Obtiene el rol del almacenamiento local

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole"); // También elimina el rol al cerrar sesión
    navigate("/PaginaHome");
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/PaginaHome">Bisan</Link>
      </div>
      <nav className="header-nav">
        <ul>
          <li>
            <Link to="/PaginaCursos">Cursos</Link>
          </li>
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/PaginaInicioSesion">Iniciar Sesión</Link>
              </li>
              <li>
                <Link className="btn-regis" to="/PaginaRegistro">
                  Registrarse
                </Link>
              </li>
            </>
          )}
          {isAuthenticated &&
            rol === "1" && ( // Muestra solo si es administrador
              <>
                <li>
                  <Link to="/CrearCurso">Agregar un Curso</Link>
                </li>
                <li>
                  <Link to="/PaginaPanelAdmin">Gestión de Usuarios</Link>
                </li>
                <li>
                  <Link to="/ListaForos">Foros</Link>
                </li>
              </>
            )}
          {isAuthenticated &&
            rol === "2" && ( // Muestra opciones específicas para usuarios normales
              <>
                <li>
                  <Link to="/ListaForos">Foros</Link>
                </li>
                <li>
                  <Link to="/PaginaPanelUsuarios">Panel de Usuario</Link>{" "}
                </li>
              </>
            )}
          {isAuthenticated && (
            <>
              <li>
                <button className="btn-salir" onClick={handleLogout}>
                  Salir
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
