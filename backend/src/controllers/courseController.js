const pool = require("../config/bd");

// Obtener todos los cursos

exports.getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cursos");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    res.status(500).json({ error: "Error al obtener los cursos" });
  }
};

exports.crearCurso = async (req, res) => {
  const {
    nombre_curso,
    descripcion,
    nombre_creador,
    precio,
    fecha_inicio,
    fecha_fin,
    imagen_url,
  } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO cursos (nombre_curso, descripcion, nombre_creador, precio, fecha_inicio, fecha_fin, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre_curso,
        descripcion,
        nombre_creador,
        precio,
        fecha_inicio,
        fecha_fin,
        imagen_url,
      ]
    );
    res.status(201).json({ id_curso: result.insertId }); // Devuelve el ID del curso creado
  } catch (error) {
    console.error("Error al crear curso:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear curso", error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  const idCurso = req.params.id;
  try {
    const [curso] = await pool.query(
      "SELECT * FROM cursos WHERE id_curso = ?",
      [idCurso]
    );

    if (!curso.length) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    const [modulos] = await pool.query(
      "SELECT * FROM modulos WHERE id_curso = ?",
      [idCurso]
    );

    res.status(200).json({ curso: curso[0], modulos });
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    res.status(500).json({
      mensaje: "Error al obtener los detalles del curso",
      error: error.message,
    });
  }
};

// Eliminar un curso por ID
exports.deleteCourse = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM cursos WHERE id_curso = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar el curso:", err);
      return res.status(500).json({ error: "Error al eliminar el curso" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
    res.json({ message: "Curso eliminado correctamente" });
  });
};

// Actualizar un curso
exports.updateCourse = (req, res) => {
  const { id } = req.params;
  const {
    nombre_curso,
    descripcion,
    precio,
    fecha_inicio,
    fecha_fin,
    id_profesor,
  } = req.body;
  const query =
    "UPDATE cursos SET nombre_curso = ?, descripcion = ?, precio = ?, fecha_inicio = ?, fecha_fin = ?, id_profesor = ? WHERE id_curso = ?";
  pool.query(
    query,
    [
      nombre_curso,
      descripcion,
      precio,
      fecha_inicio,
      fecha_fin,
      id_profesor,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el curso:", err);
        return res.status(500).json({ error: "Error al actualizar el curso" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }
      res.json({ message: "Curso actualizado correctamente" });
    }
  );
};

// Controlador para inscribir un usuario en un curso
exports.inscribirUsuario = async (req, res) => {
  const { id_curso } = req.params;
  const id_usuario = req.user.id;

  try {
    const [existeInscripcion] = await pool.query(
      "SELECT * FROM inscripcion_cursos WHERE id_usuario = ? AND id_curso = ?",
      [id_usuario, id_curso]
    );

    if (existeInscripcion.length > 0) {
      return res
        .status(400)
        .json({ mensaje: "Ya estás inscrito en este curso" });
    }

    // Insertar una nueva inscripción
    const [result] = await pool.query(
      "INSERT INTO inscripcion_cursos (id_usuario, id_curso, fecha_inscripcion) VALUES (?, ?, NOW())",
      [id_usuario, id_curso]
    );

    res.status(201).json({
      mensaje: "Inscripción exitosa",
      id_inscripcion: result.insertId,
    });
  } catch (error) {
    console.error("Error al inscribir usuario:", error);
    res.status(500).json({ mensaje: "Error al inscribir en el curso" });
  }
};

exports.verificarInscripcion = async (req, res) => {
  const { id_curso } = req.params;
  const id_usuario = req.userId;

  try {
    // Consulta para verificar si el usuario ya está inscrito
    const [inscripcion] = await pool.query(
      "SELECT * FROM inscripcion_cursos WHERE id_usuario = ? AND id_curso = ?",
      [id_usuario, id_curso]
    );

    // Si la inscripción existe, retornamos un estado de "inscrito"
    if (inscripcion.length > 0) {
      return res.status(200).json({ estaInscrito: true });
    }

    // Si no está inscrito
    res.status(200).json({ estaInscrito: false });
  } catch (error) {
    console.error("Error al verificar la inscripción:", error);
    res.status(500).json({ mensaje: "Error al verificar la inscripción" });
  }
};

exports.obtenerLeccionesPorModulo = async (req, res) => {
  const { idModulo } = req.params;

  try {
    const [lecciones] = await pool.query(
      "SELECT * FROM lecciones WHERE id_modulo = ?",
      [idModulo]
    );

    if (lecciones.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No hay lecciones para este módulo" });
    }

    res.json(lecciones);
  } catch (error) {
    console.error("Error al obtener lecciones:", error);
    res.status(500).json({ mensaje: "Error al obtener lecciones" });
  }
};

exports.obtenerCurso = async (req, res) => {
  const { id } = req.params;

  try {
    const [curso] = await pool.query(
      "SELECT * FROM cursos WHERE id_curso = ?",
      [id]
    );

    if (curso.length === 0) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    const [modulos] = await pool.query(
      "SELECT * FROM modulos WHERE id_curso = ?",
      [id]
    );

    // Obtener lecciones para todos los módulos
    const moduloIds = modulos.map((modulo) => modulo.id_modulo);
    const [lecciones] = await pool.query(
      "SELECT * FROM lecciones WHERE id_modulo IN (?)",
      [moduloIds]
    );

    // Agrupar lecciones por módulo
    const modulosConLecciones = modulos.map((modulo) => {
      const leccionesFiltradas = lecciones.filter(
        (leccion) => leccion.id_modulo === modulo.id_modulo
      );
      return { ...modulo, lecciones: leccionesFiltradas };
    });

    // Obtener evaluaciones asociadas al curso
    const [evaluaciones] = await pool.query(
      "SELECT * FROM evaluaciones WHERE id_curso = ?",
      [id]
    );

    res.json({ curso: curso[0], modulos: modulosConLecciones, evaluaciones });
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    res.status(500).json({ mensaje: "Error al obtener el curso" });
  }
};
