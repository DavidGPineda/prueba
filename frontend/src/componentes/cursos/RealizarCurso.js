import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import VideoLeccion from "./VideoLeccion";
import "../../hojas-de-estilos/RealizarCurso.css";

const API_URL_CURSOS = "http://localhost:3000/api/cursos";
const API_URL_LECCIONES_COMPLETADAS = "http://localhost:3000/api/lecciones";
const API_URL_LECCIONES = "http://localhost:3000/api/lecciones";

const RealizarCurso = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerLecciones = async (idModulo) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL_LECCIONES}/${idModulo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener lecciones:", error);
      return [];
    }
  };

  const cargarLecciones = useCallback(async (modulos) => {
    const leccionesPromises = modulos.map(async (modulo) => {
      const lecciones = await obtenerLecciones(modulo.id_modulo);
      return { ...modulo, lecciones };
    });

    return await Promise.all(leccionesPromises);
  }, []);

  useEffect(() => {
    const obtenerDetallesCurso = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL_CURSOS}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);

        const { curso, modulos } = response.data;
        setCurso(curso);

        const modulosConLecciones = await cargarLecciones(modulos);
        setModulos(modulosConLecciones);
      } catch (error) {
        console.error("Error al obtener los detalles del curso:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDetallesCurso();
  }, [id, cargarLecciones]);

  const marcarLeccionComoCompletada = async (moduloId, leccionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL_LECCIONES_COMPLETADAS}/${leccionId}/completar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModulos((prevModulos) =>
        prevModulos.map((modulo) =>
          modulo.id_modulo === moduloId
            ? {
                ...modulo,
                lecciones: modulo.lecciones.map((leccion) =>
                  leccion.id_leccion === leccionId
                    ? { ...leccion, completada: true }
                    : leccion
                ),
              }
            : modulo
        )
      );
    } catch (error) {
      console.error("Error al marcar la lección como completada:", error);
    }
  };

  if (loading) {
    return <p>Cargando detalles del curso...</p>;
  }

  if (!curso) {
    return <p>No se encontraron detalles del curso.</p>;
  }

  return (
    <div className="realizar-curso">
      <h1 className="nombre-curso-realizar">{curso.nombre_curso}</h1>
      {/* <h2>Módulo</h2> */}
      <div className="contenedor-modulos-lecciones">
        {modulos.length > 0 ? (
          modulos.map((modulo) => (
            <div key={modulo.id_modulo} className="modulos">
              <h3 className="titulo-modulo-realizar">{modulo.nombre_modulo}</h3>
              <ul>
                {modulo.lecciones?.map((leccion) => (
                  <li key={leccion.id_leccion}>
                    <h4 className="titulo-leccion-realizar">{leccion.titulo}</h4>
                    <p className="contenido-leccion-realizar">{leccion.contenido}</p>
                    <div>
                      <VideoLeccion url={leccion.url_contenido} />
                    </div>
                    <button
                      className="btn-marcar"
                      onClick={() =>
                        marcarLeccionComoCompletada(
                          modulo.id_modulo,
                          leccion.id_leccion
                        )
                      }
                      disabled={leccion.completada}
                    >
                      {leccion.completada
                        ? "Completada"
                        : "Marcar como completada"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No hay módulos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default RealizarCurso;
