import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../hojas-de-estilos/Registro.css";
import axios from "axios";

const Registro = ({ onLoginSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [id_rol, setId_Rol] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validarCampos = () => {
    // Validación del nombre
    if (!/^[A-Za-z\s]{2,}$/.test(nombre)) {
      setError("El nombre debe tener al menos 2 caracteres y solo letras.");
      return false;
    }
    // Validación de los apellidos
    if (!/^[A-Za-z\s]{2,}$/.test(apellidos)) {
      setError(
        "Los apellidos deben tener al menos 2 caracteres y solo letras."
      );
      return false;
    }
    // Validación del correo
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
      setError("Por favor, ingresa un correo válido.");
      return false;
    }
    // Validación de la contraseña
    if (
      contrasena.length < 8 ||
      !/[A-Z]/.test(contrasena) ||
      !/[a-z]/.test(contrasena) ||
      !/\d/.test(contrasena)
    ) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos."
      );
      return false;
    }
    // Validación del ID de rol
    if (id_rol !== "1" && id_rol !== "2") {
      setError("El rol debe ser 1 (Admin) o 2 (Estudiante).");
      return false;
    }

    // Si todas las validaciones pasan
    setError(null);
    return true;
  };

  const manejoEnvioRegistro = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return; // Detiene el envío si hay errores

    try {
      const respuesta = await axios.post("/api/register", {
        nombre,
        apellidos,
        correo,
        contrasena,
        id_rol,
      });
      const token = respuesta.data.token;
      localStorage.setItem("token", token);
      onLoginSuccess();
    } catch (error) {
      setError("No se pudo hacer el registro");
    }
  };

  return (
    <div className="contenedor-registro">
      <form onSubmit={manejoEnvioRegistro} className="formulario-registro">
        <h1 className="titulo-registrarse">Registrarse</h1>
        <div>
          <input
            type="text"
            placeholder="Nombres"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Apellidos"
            name="apellidos"
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Correo"
            name="correo"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="div-contra">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            name="contrasena"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <span
            className="icono-ojo"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div>
          <input
            type="number"
            placeholder="Admin = (1) / Estudiante = (2)"
            name="id_rol"
            id="id_rol"
            value={id_rol}
            onChange={(e) => setId_Rol(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-registrarse">
          Sign Up
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Registro;
