import React from "react";
import { Link } from "react-router-dom";
import "../../hojas-de-estilos/PaginaHome.css";

const PaginaHome = () => {
  return (
    <div>
      <div className="contenedor-home">
        <div className="presentacion">
          <h1>BISAN</h1>
          <h2>Plataforma De Aprendizaje</h2>
          <h3>Virtual</h3>
        </div>
        <div className="conte-cursos estilos-cursos-foros">
          <h1>Cursos</h1>
          <Link className="enlaces" to="/PaginaCursos">
            Ver Mas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaginaHome;
