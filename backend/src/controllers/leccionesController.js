const pool = require("../config/bd");

exports.agregarLeccion = async (req, res) => {
  const { titulo, contenido, duracion, tipo_contenido, url_contenido } =
    req.body;
  const idModulo = req.params.idModulo;

  console.log("Datos de la lección recibidos:", {
    titulo,
    contenido,
    duracion,
    tipo_contenido,
    url_contenido,
    idModulo,
  });

  // Verifica que el id del módulo esté presente
  if (!idModulo) {
    console.error("Error: El id del módulo es requerido");
    return res.status(400).json({ mensaje: "El id del módulo es requerido" });
  }

  try {
    // Consulta para insertar una nueva lección
    const query = `
      INSERT INTO lecciones (titulo, contenido, duracion, tipo_contenido, url_contenido, id_modulo, completada) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Ejecutar la consulta
    const [result] = await pool.query(query, [
      titulo,
      contenido,
      duracion,
      tipo_contenido,
      url_contenido,
      idModulo,
      false,
    ]);
    console.log("Lección agregada con id:", result.insertId);

    // Responder con éxito, devolviendo el id de la lección recién creada
    return res.status(201).json({
      id_leccion: result.insertId,
      titulo,
      contenido,
      duracion,
      tipo_contenido,
      url_contenido,
      id_modulo: idModulo,
    });
  } catch (error) {
    // Manejo de errores
    console.error("Error al agregar lección:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al agregar lección", error: error.message });
  }
};

exports.marcarLeccionComoCompletada = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la lección desde la URL

  try {
    const [result] = await pool.query(
      "UPDATE lecciones SET completada = TRUE WHERE id_leccion = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json({ mensaje: "Lección marcada como completada" });
  } catch (error) {
    console.error("Error al marcar la lección como completada:", error);
    res
      .status(500)
      .json({ mensaje: "Error al marcar la lección como completada" });
  }
};
