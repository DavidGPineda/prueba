const pool = require("../config/bd");

exports.agregarModulo = async (req, res) => {
  const { nombre_modulo, descripcion, orden } = req.body;
  const cursoId = req.params.cursoId; 

  console.log("Datos recibidos:", {
    nombre_modulo,
    descripcion,
    orden,
    cursoId,
  });

  if (!nombre_modulo || !descripcion || !orden) {
    console.error("Faltan datos en la solicitud:", {
      nombre_modulo,
      descripcion,
      orden,
    });
    return res.status(400).json({ mensaje: "Faltan datos requeridos" });
  }

  // Verifica si el cursoId es válido
  if (!cursoId) {
    console.error("Error: El id del curso es requerido");
    return res.status(400).json({ mensaje: "El id del curso es requerido" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO modulos (nombre_modulo, descripcion, id_curso, orden) VALUES (?, ?, ?, ?)",
      [nombre_modulo, descripcion, cursoId, orden]
    );
    console.log("Módulo agregado con ID:", result.insertId);
    res
      .status(201)
      .json({ id_modulo: result.insertId, nombre_modulo, descripcion, orden });
  } catch (error) {
    console.error("Error al agregar módulo:", error);
    res
      .status(500)
      .json({ mensaje: "Error al agregar módulo", error: error.message });
  }
};

// Obtener módulos de un curso
exports.obtenerModulosPorCurso = async (req, res) => {
  const cursoId = req.params.id;
  console.log("Obteniendo módulos para el curso con ID:", cursoId);

  try {
    const [modulos] = await pool.query(
      "SELECT * FROM modulos WHERE id_curso = ?",
      [cursoId]
    );
    console.log("Módulos obtenidos:", modulos);
    res.status(200).json(modulos);
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener módulos", error: error.message });
  }
};

// Obtener los módulos de un curso por su idCurso
exports.getModulesByCourseId = async (req, res) => {
  const { idCurso } = req.params;
  const query = "SELECT * FROM modulos WHERE id_curso = ?";

  try {
    const [rows] = await pool.query(query, [idCurso]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron módulos para este curso" });
    }
    res.json(rows); // Devuelve los módulos encontrados
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    res.status(500).json({ message: "Error al obtener los módulos" });
  }
};
