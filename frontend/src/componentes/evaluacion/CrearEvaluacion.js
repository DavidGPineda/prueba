import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../hojas-de-estilos/CrearEvaluacion.css";

const Evaluacion = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState("quiz");
  const [ponderacion, setPonderacion] = useState("");
  const [preguntas, setPreguntas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [idCurso, setIdCurso] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/cursos");
        setCursos(response.data);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        alert(
          "No se pudieron cargar los cursos. Por favor, recarga la página."
        );
      }
    };
    fetchCursos();
  }, []);

  const handleAgregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      {
        pregunta: "",
        tipo: "opcion_multiple",
        opciones: [],
      },
    ]);
  };

  const handleAgregarOpcion = (index) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].opciones.push({
      texto: "",
      es_correcta: false,
    });
    setPreguntas(nuevasPreguntas);
  };

  const handleOpcionChange = (preguntaIndex, opcionIndex, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones[opcionIndex][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const handleOpcionCorrectaChange = (preguntaIndex, opcionIndex) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones.forEach((opcion, index) => {
      opcion.es_correcta = index === opcionIndex;
    });
    setPreguntas(nuevasPreguntas);
  };

  const handlePreguntaChange = (index, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].pregunta = valor;
    setPreguntas(nuevasPreguntas);
  };

  const handleTipoPreguntaChange = (index, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].tipo = valor;
    setPreguntas(nuevasPreguntas);
  };

  const handleGuardarEvaluacion = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Validar datos básicos
      if (
        !titulo ||
        !descripcion ||
        !fechaInicio ||
        !fechaFin ||
        !ponderacion ||
        !idCurso
      ) {
        throw new Error("Por favor complete todos los campos requeridos");
      }

      // 2. Validar que haya al menos una pregunta
      if (preguntas.length === 0) {
        throw new Error("Debe agregar al menos una pregunta");
      }

      // 3. Crear la evaluación
      console.log("Enviando datos de evaluación:", {
        titulo,
        descripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        tipo,
        ponderacion,
        id_curso: idCurso,
      });

      const evaluacionResponse = await axios.post(
        "http://localhost:3000/api/evaluaciones",
        {
          titulo,
          descripcion,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          tipo,
          ponderacion,
          id_curso: idCurso,
        }
      );

      console.log("Respuesta de evaluación:", evaluacionResponse.data);
      const idEvaluacion = evaluacionResponse.data.id_evaluacion;

      if (!idEvaluacion) {
        throw new Error("No se recibió el ID de la evaluación del servidor");
      }

      // 4. Guardar cada pregunta y sus opciones
      for (const [preguntaIndex, pregunta] of preguntas.entries()) {
        // Validar pregunta
        if (!pregunta.pregunta.trim()) {
          throw new Error(`La pregunta ${preguntaIndex + 1} está vacía`);
        }

        console.log(`Procesando pregunta ${preguntaIndex + 1}:`, pregunta);

        const preguntaData = {
          id_evaluacion: idEvaluacion,
          pregunta: pregunta.pregunta.trim(),
          tipo: pregunta.tipo,
        };

        console.log("Enviando datos de pregunta:", preguntaData);
        const preguntaResponse = await axios.post(
          "http://localhost:3000/api/preguntas",
          preguntaData
        );

        console.log("Respuesta de pregunta:", preguntaResponse.data);
        const idPregunta = preguntaResponse.data.id_pregunta;

        if (!idPregunta) {
          throw new Error(`Error al guardar la pregunta ${preguntaIndex + 1}`);
        }

        // 5. Guardar las opciones de la pregunta
        if (pregunta.tipo === "opcion_multiple") {
          if (!pregunta.opciones || pregunta.opciones.length === 0) {
            throw new Error(
              `La pregunta ${preguntaIndex + 1} necesita al menos una opción`
            );
          }

          let tieneOpcionCorrecta = false;

          for (const [opcionIndex, opcion] of pregunta.opciones.entries()) {
            if (!opcion.texto.trim()) {
              throw new Error(
                `La opción ${opcionIndex + 1} de la pregunta ${
                  preguntaIndex + 1
                } está vacía`
              );
            }

            if (opcion.es_correcta) {
              tieneOpcionCorrecta = true;
            }

            const opcionData = {
              id_pregunta: idPregunta,
              opcion: opcion.texto.trim(),
              es_correcta: Boolean(opcion.es_correcta),
            };

            console.log(`Enviando opción ${opcionIndex + 1}:`, opcionData);

            try {
              const opcionResponse = await axios.post(
                "http://localhost:3000/api/opciones",
                opcionData
              );
              console.log(
                `Respuesta de opción ${opcionIndex + 1}:`,
                opcionResponse.data
              );

              if (!opcionResponse.data.id_opcion) {
                throw new Error(
                  `Error al guardar la opción ${opcionIndex + 1}`
                );
              }
            } catch (error) {
              console.error(
                `Error al guardar la opción ${opcionIndex + 1}:`,
                error
              );
              throw new Error(
                `Error al guardar la opción ${opcionIndex + 1}: ${
                  error.message
                }`
              );
            }
          }

          if (!tieneOpcionCorrecta) {
            throw new Error(
              `La pregunta ${
                preguntaIndex + 1
              } debe tener al menos una opción correcta`
            );
          }
        }
      }

      alert("Evaluación creada con éxito");
      navigate("/ProfesorDashboard");
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Respuesta del servidor:", error.response?.data);

      let mensajeError = "Error al guardar la evaluación: ";
      if (error.response?.data?.error) {
        mensajeError += error.response.data.error;
      } else {
        mensajeError += error.message;
      }

      alert(mensajeError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contenedor-crear-evaluacion">
      <h2 className="titulo-crear-evaluacion">Crear Evaluación</h2>
      <form
        className="formulario-evaluacion"
        onSubmit={handleGuardarEvaluacion}
      >
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          className="textarea-evaluacion"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <div className="fecha-container">
          <label>Fecha de inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <div className="fecha-container">
          <label>Fecha de fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />
        </div>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value="quiz">Quiz</option>
          <option value="examen">Examen</option>
          <option value="tarea">Tarea</option>
        </select>
        <input
          type="number"
          placeholder="Ponderación"
          value={ponderacion}
          onChange={(e) => setPonderacion(e.target.value)}
          required
          min="0"
          max="100"
        />
        <select
          value={idCurso}
          onChange={(e) => setIdCurso(e.target.value)}
          required
        >
          <option value="">Selecciona un Curso</option>
          {cursos.map((curso) => (
            <option key={curso.id_curso} value={curso.id_curso}>
              {curso.nombre_curso}
            </option>
          ))}
        </select>

        <button
          className="btn-agregar-pregunta"
          type="button"
          onClick={handleAgregarPregunta}
          disabled={isLoading}
        >
          Agregar Pregunta
        </button>

        {preguntas.map((pregunta, preguntaIndex) => (
          <div key={preguntaIndex} className="pregunta-container">
            <input
              type="text"
              placeholder={`Pregunta ${preguntaIndex + 1}`}
              value={pregunta.pregunta}
              onChange={(e) =>
                handlePreguntaChange(preguntaIndex, e.target.value)
              }
              required
            />
            <select
              value={pregunta.tipo}
              onChange={(e) =>
                handleTipoPreguntaChange(preguntaIndex, e.target.value)
              }
            >
              <option value="opcion_multiple">Opción Múltiple</option>
              <option value="verdadero_falso">Verdadero/Falso</option>
              <option value="respuesta_corta">Respuesta Corta</option>
            </select>

            {pregunta.tipo === "opcion_multiple" && (
              <>
                <button
                  className="btn-agregar-opcion"
                  type="button"
                  onClick={() => handleAgregarOpcion(preguntaIndex)}
                  disabled={isLoading}
                >
                  Agregar Opción
                </button>

                {pregunta.opciones.map((opcion, opcionIndex) => (
                  <div key={opcionIndex} className="opcion-container">
                    <input
                      type="text"
                      placeholder={`Opción ${opcionIndex + 1}`}
                      value={opcion.texto}
                      onChange={(e) =>
                        handleOpcionChange(
                          preguntaIndex,
                          opcionIndex,
                          "texto",
                          e.target.value
                        )
                      }
                      required
                    />
                    <label>
                      <input
                        type="radio"
                        name={`pregunta-${preguntaIndex}-opcion`}
                        checked={opcion.es_correcta}
                        onChange={() =>
                          handleOpcionCorrectaChange(preguntaIndex, opcionIndex)
                        }
                      />
                      Correcta
                    </label>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}

        <button
          className="btn-guardar-evaluacion"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar Evaluación"}
        </button>
      </form>
    </div>
  );
};

export default Evaluacion;
