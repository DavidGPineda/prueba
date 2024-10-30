const pool = require("../config/bd");

exports.crearForo = async (req, res) => {
  const { titulo, descripcion } = req.body;
  const id_usuario = req.user.id;

  try {
    const [result] = await pool.query(
      "INSERT INTO foros (titulo, descripcion, id_usuario) VALUES (?, ?, ?)",
      [titulo, descripcion, id_usuario]
    );

    res.status(201).json({
      id_foro: result.insertId,
      titulo,
      descripcion,
      fecha_creacion: new Date(),
      id_usuario,
    });
  } catch (error) {
    console.error("Error al crear el foro:", error);
    res.status(500).json({ mensaje: "Error al crear el foro." });
  }
};

exports.obtenerForos = async (req, res) => {
  try {
    const [foros] = await pool.query(`
          SELECT foros.id_foro, foros.titulo, foros.fecha_creacion, usuarios.nombre AS nombre_usuario
          FROM foros
          JOIN usuarios ON foros.id_usuario = usuarios.id_usuario
          ORDER BY foros.fecha_creacion DESC
      `);
    res.status(200).json(foros);
  } catch (error) {
    console.error("Error al obtener foros:", error);
    res.status(500).json({ mensaje: "Error al obtener foros." });
  }
};

exports.agregarPublicacion = async (req, res) => {
  const { id_foro } = req.params;
  const { contenido } = req.body;
  const id_usuario = req.user.id;

  console.log("Contenido recibido:", contenido);
  console.log("ID de usuario recibido:", id_usuario);

  try {
    await pool.query(
      "INSERT INTO publicaciones (contenido, id_foro, id_usuario) VALUES (?, ?, ?)",
      [contenido, id_foro, id_usuario]
    );
    res.status(201).json({ mensaje: "Publicación creada exitosamente." });
  } catch (error) {
    console.error("Error al agregar publicación:", error);
    res.status(500).json({ mensaje: "Error al agregar publicación." });
  }
};

exports.obtenerForoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [foro] = await pool.query("SELECT * FROM foros WHERE id_foro = ?", [
      id,
    ]);
    if (foro.length === 0) {
      return res.status(404).json({ mensaje: "Foro no encontrado" });
    }
    res.status(200).json(foro[0]); // Devuelve el primer foro encontrado
  } catch (error) {
    console.error("Error al obtener el foro:", error);
    res.status(500).json({ mensaje: "Error al obtener el foro." });
  }
};

exports.obtenerPublicaciones = async (req, res) => {
  const { id } = req.params;
  console.log("ID del foro recibido:", id);

  try {
    const [publicaciones] = await pool.query(
      "SELECT p.contenido, p.fecha_publicacion, u.nombre AS autor FROM publicaciones p JOIN usuarios u ON p.id_usuario = u.id_usuario WHERE p.id_foro = ? ORDER BY p.fecha_publicacion DESC",
      [id]
    );

    console.log("Publicaciones encontradas:", publicaciones);
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ mensaje: "Error al obtener publicaciones." });
  }
};
