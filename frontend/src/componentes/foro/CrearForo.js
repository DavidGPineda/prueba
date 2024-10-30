import React, { useState } from "react";
import axios from "axios";
import "../../hojas-de-estilos/CrearForo.css";

const CrearForo = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const respuesta = await axios.post(
        "/api/foros",
        { titulo, descripcion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (respuesta.status === 201) {
        setMensaje("Foro creado con éxito!");
        setTitulo("");
        setDescripcion("");
      } else {
        setMensaje("Error al crear el foro.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Hubo un problema con la solicitud.");
    }
  };

  return (
    <div className="contenedor-foro">
      <h2>Crear Foro</h2>
      <form className="forum-foro" onSubmit={manejarEnvio}>
        <div>
          <label>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <button className="btn-crear-foro" type="submit">
          Crear Foro
        </button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CrearForo;
