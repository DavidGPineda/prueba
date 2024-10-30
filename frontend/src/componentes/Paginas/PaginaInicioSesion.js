import React from "react";
import InicioSesion from "../autenticacion/InicioSesion";
import { useNavigate } from "react-router-dom";
import "../../hojas-de-estilos/PaginaInicioSesion.css";

const PaginaInicioSesion = () => {
  const navigate = useNavigate();

  const manejoEnvioInicioExitoso = (ruta) => {
    navigate(ruta); // Redirige a la ruta proporcionada por el componente hijo
  };

  return (
    <div className="contenedor-pagina-inicio-sesion">
      <InicioSesion onLoginSuccess={manejoEnvioInicioExitoso} />
    </div>
  );
};

export default PaginaInicioSesion;
