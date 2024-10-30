import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../hojas-de-estilos/InicioSesion.css";
import axios from "axios";

const InicioSesion = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validarCampos = () => {
    // Validación del formato de correo
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
      setError("Por favor, ingresa un correo válido.");
      return false;
    }
    // Validación de longitud mínima de contraseña
    if (contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    setError(null);
    return true;
  };

  const manejoEnvioInicio = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      const respuesta = await axios.post("/api/login", { correo, contrasena });
      console.log("Respuesta del servidor:", respuesta.data);

      const token = respuesta.data.token;
      const userRole = respuesta.data.id_rol;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", userRole);

      if (!userRole) {
        setError("Error al obtener el rol de usuario");
        return;
      }

      if (userRole === "1") {
        onLoginSuccess("/PaginaPanelAdmin");
      } else {
        onLoginSuccess("/PaginaHome");
      }

      console.log("Token guardado en localStorage:", localStorage.getItem("token"));
      console.log("Rol guardado en localStorage:", localStorage.getItem("userRole"));
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="contenedor-inicio-sesion">
      <form onSubmit={manejoEnvioInicio} className="formulario-inicio-sesion">
        <h1 className="titulo-iniciar-sesion">Iniciar Sesión</h1>
        <div>
          <input
            type="email"
            placeholder="Correo"
            id="email"
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="btn-inicio-sesion">
          Login
        </button>
      </form>
    </div>
  );
};

export default InicioSesion;

