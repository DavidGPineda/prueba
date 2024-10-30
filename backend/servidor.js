require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./src/config/bd"); // Conexión a la base de datos
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const moduloRoutes = require("./src/routes/moduloRoutes");
const leccionRoutes = require("./src/routes/leccionRoutes");
const evaluacionesRoutes = require("./src/routes/evaluacionesRoutes");
const forumRoutes = require("./src/routes/forumRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const localName = "localhost";

// Función para inicializar roles
async function initializeRoles() {
  try {
    const rolesExist = await pool.query(
      "SELECT * FROM roles WHERE nombre_rol IN ('administrador', 'estudiante')"
    );
    if (rolesExist[0].length === 0) {
      await pool.query(
        "INSERT INTO roles (nombre_rol) VALUES ('administrador'), ('estudiante')"
      );
      console.log("Roles inicializados");
    }
  } catch (error) {
    console.error("Error al inicializar roles:", error);
  }
}

// Ejecutar la función de inicialización antes de configurar rutas y escuchar en el puerto
initializeRoles()
  .then(() => {
    // Middleware
    app.use(cors());
    app.use(bodyParser.json());

    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });

    // Rutas
    app.use("/api", userRoutes);
    app.use("/api", authRoutes);
    app.use("/api", courseRoutes);
    app.use("/api", moduloRoutes);
    app.use("/api", leccionRoutes);
    app.use("/api", evaluacionesRoutes);
    app.use("/api", forumRoutes);

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${localName}:${PORT}...`);
    });
  })
  .catch((error) => {
    console.error("Error al inicializar el servidor:", error);
  });
