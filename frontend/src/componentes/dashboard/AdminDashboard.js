import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../hojas-de-estilos/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/usuarios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setLoading(false);
    }
  };

  const eliminarUsuario = async (idUsuario) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${idUsuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(
        usuarios.filter((usuario) => usuario.id_usuario !== idUsuario)
      );
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  useEffect(() => {
    buscarUsuarios().catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    console.log("Estado de usuarios:", usuarios);
  }, [usuarios]);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="contenedor-panel-admin">
      <h1>Gestión de Usuarios</h1>
      <button
        className="btn-navegar-profesor"
        onClick={() => navigate("/ProfesorDashboard")}
      >
        Ir a Panel De Profesores
      </button>
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellidos}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.id_rol}</td>
              <td>{usuario.estado}</td>
              <td>{usuario.fecha_registro}</td>
              <td>
                <button
                  className="btn-eliminar-usuario"
                  onClick={() => eliminarUsuario(usuario.id_usuario)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
