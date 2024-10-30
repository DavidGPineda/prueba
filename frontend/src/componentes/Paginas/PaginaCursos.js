import React from "react";
import ListaDeCursos from "../cursos/ListaDeCursos";
import "../../hojas-de-estilos/PaginaCursos.css";

const PaginaCursos = () => {
  return (
    <div className="contenedor-pagina-cursos">
      <h1 className="titulo-pagina-cursos">Lista de Cursos</h1>
      <ListaDeCursos />
    </div>
  );
};

export default PaginaCursos;
