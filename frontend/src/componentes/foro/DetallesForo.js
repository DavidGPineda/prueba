import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../hojas-de-estilos/DetallesForo.css";

const DetalleForo = () => {
  const { id } = useParams();
  const [foro, setForo] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleRedireccion = () => {
    navigate("/CrearForo");
  };

  const obtenerPublicaciones = useCallback(async () => {
    try {
      const respuesta = await axios.get(`/api/foros/${id}/publicaciones`);
      setPublicaciones(respuesta.data);
    } catch (err) {
      console.error("Error al obtener publicaciones:", err);
    }
  }, [id]);

  useEffect(() => {
    const obtenerForo = async () => {
      try {
        const respuesta = await axios.get(`/api/foros/${id}`);
        setForo(respuesta.data);
      } catch (err) {
        console.error("Error al obtener el foro:", err);
        setError("Error al cargar el foro");
      }
    };

    console.log("ID del foro:", id);
    obtenerForo();
    obtenerPublicaciones();
  }, [id, obtenerPublicaciones]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const respuesta = await axios.post(
        `/api/foros/${id}/publicaciones`,
        { contenido: mensaje },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (respuesta.status === 201) {
        setFeedback("¡Publicación creada con éxito!");
        setMensaje("");
        setMostrarFormulario(false);
        obtenerPublicaciones();
      } else {
        setFeedback("Error al crear la publicación.");
      }
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      setFeedback("Hubo un problema con la solicitud.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!foro) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="contenedor-general-foro">
      <button className="btn-crear-foro-detalles" onClick={handleRedireccion}>
        Crear Foro
      </button>
      <div className="contenedor-foro-detalles">
        <h1 className="foro-titulo-detalles">{foro.titulo}</h1>
        <p className="foro-descripcion-detalles">
          Descripción: {foro.descripcion}
        </p>
        <p className="foro-fecha-creacion-detalles">
          Fecha de creación: {foro.fecha_creacion}
        </p>

        {/* Botón para mostrar/ocultar el formulario de publicación */}
        <button
          className="btn-mostrar-formulario"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario
            ? "Cancelar publicación"
            : "Publicar un comentario"}
        </button>

        {mostrarFormulario && (
          <form className="formulario-publicacion" onSubmit={manejarEnvio}>
            <textarea
              className="text-area-detalles-publicacion"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tu comentario aquí"
              required
            />
            <button type="submit" className="btn-enviar-publicacion">
              Enviar
            </button>
          </form>
        )}

        {/* Mensaje de feedback */}
        {feedback && <p className="mensaje-feedback">{feedback}</p>}

        {/* Lista de publicaciones */}
        <div className="publicaciones-detalles-foro">
          <h3>Comentarios</h3>
          {publicaciones.length > 0 ? (
            publicaciones.map((pub, index) => (
              <div key={index} className="publicacion-detalles">
                <p>
                  <strong>{pub.autor}</strong> comentó:
                </p>
                <p className="d-contenido-p">{pub.contenido}</p>
                <p className="fecha-publicacion">
                  {new Date(pub.fecha_publicacion).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No hay comentarios aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleForo;
