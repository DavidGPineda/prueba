import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../hojas-de-estilos/PaginaPanelUsuarios.css";
import UsuarioDashboard from "../dashboard/UsuarioDashboard";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PaginaPanelUsuarios = () => {
  const [message, setMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("No tienes acceso a esta página");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decodedToken.exp < now) {
        setMessage("Token expirado, por favor inicia sesión de nuevo");
        setLoading(false);
        localStorage.removeItem("token");
        navigate("/");
        return;
      }
    } catch (err) {
      setMessage("Token inválido");
      setLoading(false);
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    axios
      .get("/api/student", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMessage(response.data.message);
        setHasAccess(true);
        setLoading(false);
      })
      .catch((error) => {
        setMessage("No tienes acceso a esta página");
        setHasAccess(false);
        setLoading(false);
        navigate("/");
      });
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="contenedor-componentes-usuario">
      <h1>{message}</h1>
      {hasAccess && <UsuarioDashboard />}{" "}
      {/* Mostrar el dashboard solo si tiene acceso */}
    </div>
  );
};

export default PaginaPanelUsuarios;
