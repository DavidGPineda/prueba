import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../hojas-de-estilos/ListaForos.css";

const ListaForos = () => {
  const [foros, setForos] = useState([]);
  const navigate = useNavigate();

  const handleRedireccion = () => {
    navigate("/CrearForo");
  };

  useEffect(() => {
    const obtenerForos = async () => {
      try {
        const respuesta = await axios.get("/api/foros");
        setForos(respuesta.data);
      } catch (err) {
        console.error("Error al cargar foros:", err);
      }
    };

    obtenerForos();
  }, []);

  return (
    <div className="contenedor-lista-foros">
      <button className="btn-crear-foro-lista" onClick={handleRedireccion}>
        Crear Foro
      </button>
      <h2>Foros</h2>
      <ul className="ul-lista-foros">
        {foros.map((foro) => (
          <li className="li-foro" key={foro.id_foro}>
            <Link
              className="link-foro"
              to={`/foros/${foro.id_foro}`}
              onClick={() => console.log(`ID del foro: ${foro.id_foro}`)}
            >
              {foro.titulo}
            </Link>
            <h4>
              <span className="span">(</span>
              <span className="nombre-usuario-foro">
                Creado por: {foro.nombre_usuario}
              </span>
              <span className="span">)</span>
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaForos;
