import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../hojas-de-estilos/CrearCurso.css";

const API_URL_CURSOS = "http://localhost:3000/api/cursos";
const API_URL_MODULOS = "http://localhost:3000/api/modulos";
const API_URL_LECCIONES = "http://localhost:3000/api/lecciones";

const CrearCurso = () => {
  const [course, setCourse] = useState({
    nombre_curso: "",
    descripcion: "",
    nombre_creador: "",
    precio: 0,
    fecha_inicio: "",
    fecha_fin: "",
    imagen_url: "",
    modulos: [{ nombre_modulo: "", descripcion: "", lecciones: [] }], // Módulo inicial
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica que haya al menos un módulo
    if (course.modulos.length === 0) {
      alert("Debes agregar al menos un módulo.");
      return;
    }

    // Verifica que cada módulo tenga al menos una lección
    for (const modulo of course.modulos) {
      if (modulo.lecciones.length === 0) {
        alert("Cada módulo debe tener al menos una lección.");
        return;
      }
    }
    const token = localStorage.getItem("token");
    console.log("Token de autenticación:", token);

    try {
      console.log("Datos del curso a enviar:", course); // Log para verificar los datos

      // Crear el curso
      const cursoResponse = await axios.post(API_URL_CURSOS, course, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta del curso:", cursoResponse.data); // Log para la respuesta del curso
      const cursoId = cursoResponse.data.id_curso; // Este es el ID del curso que se acaba de crear

      // Enviar módulos y lecciones
      await Promise.all(
        course.modulos.map(async (modulo, index) => {
          console.log("Enviando módulo:", modulo);
          const moduloResponse = await axios.post(
            `${API_URL_MODULOS}/${cursoId}`,
            {
              ...modulo,
              orden: index + 1, // Agregar orden
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const idModulo = moduloResponse.data.id_modulo;
          // Enviar lecciones del módulo
          await Promise.all(
            modulo.lecciones.map(async (leccion) => {
              console.log("Enviando lección:", leccion);
              await axios.post(
                `${API_URL_LECCIONES}/${idModulo}`,
                {
                  ...leccion,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
            })
          );
        })
      );

      // Limpiar los campos
      setCourse({
        nombre_curso: "",
        descripcion: "",
        nombre_creador: "",
        precio: 0,
        fecha_inicio: "",
        fecha_fin: "",
        imagen_url: "",
        modulos: [],
      });

      navigate("/PaginaPanelUsuarios");
    } catch (error) {
      console.error(
        "Error al agregar curso:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleAddModulo = () => {
    setCourse({
      ...course,
      modulos: [
        ...course.modulos,
        { nombre_modulo: "", descripcion: "", lecciones: [] }, // Agregar lecciones iniciales si es necesario
      ],
    });
  };

  const handleModuloChange = (index, value, field) => {
    const updatedModulos = course.modulos.map((modulo, i) => {
      if (i === index) {
        return { ...modulo, [field]: value };
      }
      return modulo;
    });
    setCourse({ ...course, modulos: updatedModulos });
  };

  const handleAddLeccion = (moduloIndex) => {
    const updatedModulos = course.modulos.map((modulo, i) => {
      if (i === moduloIndex) {
        return {
          ...modulo,
          lecciones: [
            ...modulo.lecciones,
            {
              titulo: "",
              contenido: "",
              duracion: 0,
              tipo_contenido: "texto",
              url_contenido: "",
            },
          ],
        };
      }
      return modulo;
    });
    setCourse({ ...course, modulos: updatedModulos });
  };

  const handleLeccionChange = (moduloIndex, leccionIndex, value, field) => {
    const updatedModulos = course.modulos.map((modulo, i) => {
      if (i === moduloIndex) {
        const updatedLecciones = modulo.lecciones.map((leccion, j) => {
          if (j === leccionIndex) {
            return { ...leccion, [field]: value };
          }
          return leccion;
        });
        return { ...modulo, lecciones: updatedLecciones };
      }
      return modulo;
    });
    setCourse({ ...course, modulos: updatedModulos });
  };

  return (
    <div className="contenedor-agregar-cursos">
      <form onSubmit={handleSubmit} className="form-agregar-cursos">

        <div className="div-para-agregar-curso">
          <h1 className="titulo-agregar-curso">Agregar Curso</h1>

          <div className="nombre-creador">
            <input
              id="nombre-creador"
              name="nombre_creador"
              placeholder="Ingresa Tu Nombre"
              onChange={handleChange}
              value={course.nombre_creador}
              required
            />
          </div>
          <div className="nombre-curso">
            <input
              type="text"
              id="nombre-curso"
              name="nombre_curso"
              placeholder="Ingresa El Nombre del Curso"
              onChange={handleChange}
              value={course.nombre_curso}
              required
            />
          </div>
          <div className="text-area-descripcion">
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Agrega Una Descripción Del CURSO"
              onChange={handleChange}
              value={course.descripcion}
              required
            />
          </div>
          <div className="fecha-inicio-cc">
            <label htmlFor="fecha_inicio">Fecha de Inicio Del Curso</label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              onChange={handleChange}
              value={course.fecha_inicio}
              required
            />
          </div>
          <div className="fecha-fin-cc">
            <label htmlFor="fecha_fin">Fecha de Fin Del Curso</label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              onChange={handleChange}
              value={course.fecha_fin}
              required
            />
          </div>
          <div className="imagen-url">
            <input
              type="text"
              id="imagen_url"
              name="imagen_url"
              placeholder="Ingresa la URL de la imagen"
              onChange={handleChange}
              value={course.imagen_url}
              required
            />
          </div>
          <div className="precio-cc">
            <input
              type="number"
              id="precio"
              name="precio"
              placeholder="Agrega el Costo del CURSO"
              onChange={handleChange}
              value={course.precio || ""}
              required
            />
          </div>
        </div>

        <div className="contenedor-para-agregar-modulos-lecciones">
          <h2 className="titulo-modulos">Módulos</h2>
          <button
            className="btn-agregar-modulo btn"
            type="button"
            onClick={handleAddModulo}
          >
            Agregar Módulo
          </button>
          {course.modulos.map((modulo, moduloIndex) => (
            <div key={moduloIndex} className="modulo">
              <input
                className="nombre-modulo"
                type="text"
                id={`nombre_modulo_${moduloIndex}`}
                placeholder="Nombre del Módulo"
                value={modulo.nombre_modulo}
                onChange={(e) =>
                  handleModuloChange(
                    moduloIndex,
                    e.target.value,
                    "nombre_modulo"
                  )
                }
                required
              />
              <textarea
                className="descripcion-modulo"
                placeholder="Descripción del Módulo"
                value={modulo.descripcion}
                onChange={(e) =>
                  handleModuloChange(moduloIndex, e.target.value, "descripcion")
                }
                required
              />

              <button
                className="agregar-leccion btn"
                type="button"
                onClick={() => handleAddLeccion(moduloIndex)}
              >
                Agregar Lección
              </button>

              {/* Parte de lecciones */}
              {modulo.lecciones.map((leccion, leccionIndex) => (
                <div key={leccionIndex} className="leccion">
                  <input
                    className="nombre-leccion"
                    type="text"
                    placeholder="Nombre de la Lección"
                    value={leccion.titulo}
                    onChange={(e) =>
                      handleLeccionChange(
                        moduloIndex,
                        leccionIndex,
                        e.target.value,
                        "titulo"
                      )
                    }
                    required
                  />
                  <textarea
                    className="descripcion-leccion"
                    placeholder="Contenido de la Lección"
                    value={leccion.contenido}
                    onChange={(e) =>
                      handleLeccionChange(
                        moduloIndex,
                        leccionIndex,
                        e.target.value,
                        "contenido"
                      )
                    }
                    required
                  />
                  <input
                    className="duracion-leccion"
                    type="number"
                    value={leccion.duracion || ""}
                    placeholder="Duración (en minutos)"
                    onChange={(e) =>
                      handleLeccionChange(
                        moduloIndex,
                        leccionIndex,
                        Number(e.target.value),
                        "duracion"
                      )
                    }
                    required
                  />
                  <select
                    className="tipo-leccion"
                    value={leccion.tipo_contenido}
                    onChange={(e) =>
                      handleLeccionChange(
                        moduloIndex,
                        leccionIndex,
                        e.target.value,
                        "tipo_contenido"
                      )
                    }
                  >
                    <option value="texto">Texto</option>
                    <option value="video">Video</option>
                    <option value="archivo">Archivo</option>
                  </select>
                  <input
                    className="url-contenido"
                    type="text"
                    placeholder="URL del Contenido (si aplica)"
                    value={leccion.url_contenido}
                    onChange={(e) =>
                      handleLeccionChange(
                        moduloIndex,
                        leccionIndex,
                        e.target.value,
                        "url_contenido"
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <button className="btn-crear-curso btn" type="submit">
          Crear Curso
        </button>
      </form>
    </div>
  );
};

export default CrearCurso;
