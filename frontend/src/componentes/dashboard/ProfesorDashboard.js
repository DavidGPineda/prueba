import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../hojas-de-estilos/ProfesorDashboard.css";

const ProfesorDashboard = ({ usuario }) => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const response = await axios.get("/api/evaluaciones");
        setEvaluaciones(response.data);
      } catch (error) {
        console.error("Error al obtener las evaluaciones:", error);
      }
    };
    fetchEvaluaciones();
  }, []);

  return (
    <div className="contenedor-profesor-dashboard">
      <h1 className="titulo-profesor-dashboard">
        Bienvenido Al Panel De Profesores
      </h1>

      <div>
        <h2 disabled>Gestión de Cursos</h2>
        <button
          className="btns-profesor-dashboard"
          onClick={() => navigate("/CrearCurso")}
        >
          Crear Curso Nuevo
        </button>
        <button
          className="btns-profesor-dashboard"
          onClick={() => navigate("/ListaDeCursos")}
        >
          Ver Todos los Cursos
        </button>
        <button
          className="btns-profesor-dashboard"
          onClick={() => navigate("/CrearEvaluacion")}
        >
          Crear Evaluacion
        </button>
      </div>

      <div>
        <h2>Evaluaciones</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
              <th>Tipo</th>
              <th>Ponderación</th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((evaluacion) => (
              <tr key={evaluacion.id_evaluacion}>
                <td>{evaluacion.id_evaluacion}</td>
                <td>{evaluacion.titulo}</td>
                <td>{evaluacion.descripcion}</td>
                <td>{evaluacion.fecha_inicio}</td>
                <td>{evaluacion.fecha_fin}</td>
                <td>{evaluacion.tipo}</td>
                <td>{evaluacion.ponderacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Estudiantes</h2>
        <button disabled className="btns-profesor-dashboard"> 
          Ver Lista de Estudiantes
        </button>
      </div>

      <div>
        <h2>Opciones del Usuario</h2>
        <button className="btns-profesor-dashboard" disabled>Ver perfil</button>
        <button className="btns-profesor-dashboard" disabled>Configuración</button>
        <button className="btns-profesor-dashboard" disabled>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default ProfesorDashboard;
