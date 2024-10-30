import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 
import "../../hojas-de-estilos/DetallesDelCurso.css";

const API_URL_CURSOS = "http://localhost:3000/api/cursos";

const DetallesCurso = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [curso, setCurso] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [yaInscrito, setYaInscrito] = useState(false);

  useEffect(() => {
    const obtenerDetallesCurso = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL_CURSOS}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurso(response.data.curso);
        setModulos(response.data.modulos);
      } catch (error) {
        console.error("Error al obtener los detalles del curso:", error);
      }
    };

    obtenerDetallesCurso();
  }, [id]);

  const handleInscribirse = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Por favor, inicia sesión para inscribirte en el curso.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/api/cursos/${id}/inscribir`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Inscripción exitosa");
      setYaInscrito(true); // Actualiza el estado después de la inscripción exitosa
    } catch (error) {
      console.error(
        "Error al inscribirse:",
        error.response?.data?.mensaje || error.message
      );
      alert("Error al inscribirse en el curso");
    }
  };

  useEffect(() => {
    const verificarInscripcion = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cursos/${id}/verificar-inscripcion`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setYaInscrito(response.data.estaInscrito); // Marca que el usuario ya está inscrito
      } catch (error) {
        console.error("Error al verificar la inscripción:", error);
      }
    };

    verificarInscripcion();
  }, [id]);

  if (!curso) {
    return <p>Cargando detalles del curso...</p>;
  }

  return (
    <div className="contenedor-detalles-curso">
      <h1 className="titulo-del-curso">{curso.nombre_curso}</h1>
      <p className="descripcion">Sobre Este Curso {curso.descripcion}</p>
      <p className="precio">Precio: ${curso.precio}</p>
      <p className="fecha-inicio">Fecha de Inicio: {curso.fecha_inicio}</p>
      <p className="fecha-fin">Fecha de Fin: {curso.fecha_fin}</p>
      <img
        className="img-curso"
        src={curso.imagen_url}
        alt={curso.nombre_curso}
      />

      <h2 className="titulo-modulos">Módulos Del Curso</h2>
      <ul className="lista-modulos">
        {modulos.map((modulo) => (
          <li key={modulo.id_modulo}>
            {modulo.nombre_modulo}: {modulo.descripcion}
          </li>
        ))}
      </ul>

      {!yaInscrito && (
        <button className="btn-inscribirse" onClick={handleInscribirse}>
          Inscribirse
        </button>
      )}
      {yaInscrito && (
        <>
          <p>Ya estás inscrito en este curso</p>
          <button onClick={() => navigate(`/curso/${id}/realizar`)}>
            Realizar Curso
          </button>
        </>
      )}
    </div>
  );
};

export default DetallesCurso;
