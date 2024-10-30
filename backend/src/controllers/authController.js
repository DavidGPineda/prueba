const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/bd");

// Función para generar tokens JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id_usuario, id_rol: user.id_rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Mensajes de respuesta
const MESSAGES = {
  USER_EXISTS: "El correo ya está registrado",
  SERVER_ERROR: "Error en el servidor",
  USER_REGISTERED: "Usuario registrado exitosamente",
};

// Registrar usuario
exports.registroUsuario = async (req, res) => {
  const { nombre, apellidos, correo, contrasena, id_rol } = req.body;

  // const rolPorDefecto = 2;
  // const rolFinal = id_rol || rolPorDefecto; // Si id_rol es undefined o null, usa rolPorDefecto

  try {
    const [existeUsuario] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (existeUsuario.length > 0) {
      return res.status(400).json({ message: MESSAGES.USER_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    console.log("Contraseña original:", contrasena);
    console.log("Contraseña hasheada:", hashedPassword.trim());
    console.log("Hash antes de insertar:", hashedPassword);

    await pool.query(
      "INSERT INTO usuarios (nombre, apellidos, correo, contrasena, id_rol) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellidos, correo, hashedPassword, id_rol]
    );

    res.status(201).json({ message: MESSAGES.USER_REGISTERED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

// Iniciar sesión
exports.loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // Verificamos si el usuario existe
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [
      correo,
    ]);

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const user = rows[0];

    // Mostrar la contraseña ingresada y la contraseña en la base de datos
    console.log("Contraseña ingresada:", contrasena);
    console.log("Contraseña en BD (hash):", user.contrasena);

    // Comparamos la contraseña ingresada con la almacenada
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      rows[0].contrasena
    );

    if (!contrasenaValida) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    // Generar el token y devolverlo junto con el rol
    const token = generateToken(user);
    return res.json({ token, id_rol: user.id_rol }); // Asegúrate de devolver el id_rol
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Ruta protegida para administradores
exports.accesoAdmin = (req, res) => {
  if (req.user.id_rol !== 1) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  res.json({ message: "Bienvenido al panel de administrador" });
};

// Ruta protegida para usuarios
exports.accesoUser = (req, res) => {
  if (req.user.id_rol !== 2) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  res.json({ message: "Bienvenido al panel de usuario" });
};

exports.logout = (req, res) => {
  // Si estás utilizando sesiones, destruye la sesión
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión." });
    }
    res.status(200).json({ message: "Sesión cerrada." });
  });
};
