import React from "react";
import { useNavigate } from "react-router-dom";
import Registro from "../autenticacion/Registro";
import "../../hojas-de-estilos/PaginaRegistro.css";

const PaginaRegistro = () => {
  const navigate = useNavigate();

  const manejoEnviRegistroExitoso = () => {
    navigate("/PaginaInicioSesion");
  };

  return (
    <div className="contenedor-pagina-registro">
      <Registro onLoginSuccess={manejoEnviRegistroExitoso} />
    </div>
  );
};

export default PaginaRegistro;
