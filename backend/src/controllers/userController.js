const pool = require("../config/bd");
const jwt = require("jsonwebtoken");

// Controlador para obtener todos los usuarios
exports.obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Controlador para obtener el usuario actual
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token
    if (!token) {
      return res.status(403).json({ message: "No se proporcionó token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    const userId = decoded.id; // Obtener el ID del usuario desde el token

    console.log("ID del usuario:", userId); // Verifica el ID del usuario

    const [rows] = await pool.query(
      "SELECT id_usuario, nombre, apellidos, correo, id_rol, fecha_registro FROM usuarios WHERE id_usuario = ?",
      [userId]
    );

    if (rows.length > 0) {
      res.json(rows[0]); // Devolver los datos del usuario
    } else {
      res.status(404).json({ message: "Usuario no encontrado." });
    }
  } catch (error) {
    console.error("Error en obtenerUsuarioActual:", error); // Log del error
    res.status(500).json({ message: "Error en el servidor.", error });
  }
};

// Controlador para obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM usuarios WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// Controlador para actualizar un usuario (No implementado)
exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, apellidos, correo, contrasena, id_rol } = req.body;
    const [resultados] = await pool.query(
      "UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ?, contrasena = ?, id_rol = ? WHERE id_usuario = ?",
      [nombre, apellidos, correo, contrasena, id_rol, req.params.id]
    );
    if (resultados.affectedRows > 0) {
      res.json({ message: "Usuario actualizdo correctamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
};

// Este codigo para el Controller funciona perfecto. No lo cambies
exports.obtenerCursosInscritos = async (req, res) => {
  const userId = req.user.id; // Obteniendo el ID del usuario del token

  try {
    const [cursos] = await pool.query(
      "SELECT c.* FROM cursos c JOIN inscripcion_cursos ic ON c.id_curso = ic.id_curso WHERE ic.id_usuario = ?",
      [userId]
    );
    res.json(cursos); // Devolver la lista de cursos
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los cursos inscritos" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar el usuario" });
  }
};
