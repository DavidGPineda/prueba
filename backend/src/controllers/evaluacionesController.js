const pool = require("../config/bd");

exports.crearEvaluacion = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      fecha_inicio,
      fecha_fin,
      tipo,
      ponderacion,
      id_curso,
    } = req.body;

    const [result] = await pool.query(
      "INSERT INTO evaluaciones (titulo, descripcion, fecha_inicio, fecha_fin, tipo, ponderacion, id_curso) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        titulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        tipo,
        ponderacion,
        id_curso,
      ]
    );

    res.json({
      id_evaluacion: result.insertId,
      mensaje: "Evaluación creada exitosamente",
    });
  } catch (error) {
    console.error("Error al crear evaluación:", error);
    res.status(500).json({ error: "Error al crear la evaluación" });
  }
};

exports.enviarPreguntas = async (req, res) => {
  console.log(req.body);
  const { id_evaluacion, pregunta, tipo } = req.body;

  if (!id_evaluacion || !pregunta || !tipo) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO preguntas (id_evaluacion, pregunta, tipo) VALUES (?, ?, ?)",
      [id_evaluacion, pregunta, tipo]
    );
    res.json({
      id_pregunta: result.insertId,
      mensaje: "Preguntas almacenadas exitosamente",
    });
  } catch (error) {
    console.error("Error al insertar pregunta", error);
    res.status(500).json({ error: "Error al guardar la pregunta" });
  }
};

exports.crearOpcion = async (req, res) => {
  const { id_pregunta, opcion, es_correcta } = req.body;

  if (!id_pregunta || !opcion || es_correcta === undefined) {
    return res.status(400).json({
      error:
        "Faltan campos requeridos. Se necesitan: id_pregunta, opcion y es_correcta",
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO opciones (id_pregunta, opcion, es_correcta) VALUES (?, ?, ?)",
      [id_pregunta, opcion, es_correcta]
    );
    res.json({
      id_opcion: result.insertId,
      mensaje: "Opciones creadas exitosamente",
    });
  } catch (error) {
    console.error("Error al insertar opción", error);
    res.status(500).json({ error: "Error al guardar la opción" });
  }
};

exports.enviarOpciones = async (req, res) => {
  try {
    // 1. Validar que todos los campos requeridos estén presentes
    const { id_pregunta, opcion, es_correcta } = req.body;

    if (!id_pregunta || !opcion || es_correcta === undefined) {
      return res.status(400).json({
        error:
          "Faltan campos requeridos. Se necesitan: id_pregunta, opcion y es_correcta",
      });
    }

    // 2. Validar que id_pregunta sea un número válido
    if (isNaN(id_pregunta) || id_pregunta <= 0) {
      return res.status(400).json({
        error: "El id_pregunta debe ser un número válido mayor que 0",
      });
    }

    // 3. Verificar que la pregunta existe antes de insertar la opción
    const [preguntaExistente] = await pool.query(
      "SELECT id_pregunta FROM preguntas WHERE id_pregunta = ?",
      [id_pregunta]
    );

    if (!preguntaExistente || preguntaExistente.length === 0) {
      return res.status(404).json({
        error: `No se encontró la pregunta con id: ${id_pregunta}`,
      });
    }

    // 4. Insertar la opción
    const [result] = await pool.query(
      "INSERT INTO opciones (id_pregunta, opcion, es_correcta) VALUES (?, ?, ?)",
      [id_pregunta, opcion, es_correcta]
    );

    // 5. Verificar que la inserción fue exitosa
    if (!result.insertId) {
      throw new Error("Error al insertar la opción en la base de datos");
    }

    // 6. Obtener la opción recién creada para confirmar
    const [opcionCreada] = await pool.query(
      "SELECT * FROM opciones WHERE id_opcion = ?",
      [result.insertId]
    );

    // 7. Enviar respuesta exitosa
    res.status(201).json({
      mensaje: "Opción creada exitosamente",
      id_opcion: result.insertId,
      opcion: opcionCreada[0],
    });
  } catch (error) {
    console.error("Error en enviarOpciones:", error);

    // 8. Manejar errores específicos de MySQL
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        error: "La pregunta referenciada no existe",
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Ya existe una opción igual para esta pregunta",
      });
    }

    // 9. Error general
    res.status(500).json({
      error: "Error al guardar la opción",
      detalle: error.message,
    });
  }
};

exports.getEvaluaciones = async (req, res) => {
  try {
    const [evaluaciones] = await pool.query("SELECT * FROM evaluaciones");
    res.json(evaluaciones);
  } catch (error) {
    console.error("Error obteniendo las evaluaciones:", error);
    res.status(500).json({ error: "Error al obtener las evaluaciones" });
  }
};
