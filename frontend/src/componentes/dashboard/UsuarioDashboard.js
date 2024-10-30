import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../hojas-de-estilos/UsuarioDashboard.css";

const CURSOS_INSCRITOS = "http://localhost:3000/api/usuario/cursos-inscritos";

const UsuarioDashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingCursos, setLoadingCursos] = useState(false);

  const buscarUsuario = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(
        "No se encontró un token válido. Por favor, inicie sesión nuevamente."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuario(response.data);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      setError("No se pudo obtener la información del usuario.");
    } finally {
      setLoading(false);
    }
  };

  const obtenerCursosInscritos = async () => {
    setLoadingCursos(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No hay token disponible.");
      setLoadingCursos(false);
      return;
    }

    try {
      const response = await axios.get(`${CURSOS_INSCRITOS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCursosInscritos(response.data);
    } catch (error) {
      console.error("Error al obtener los cursos inscritos:", error);
      setError("No se pudo obtener la lista de cursos.");
    } finally {
      setLoadingCursos(false);
    }
  };

  useEffect(() => {
    buscarUsuario().catch((error) => console.error("Error:", error));
  }, []);

  if (loading) {
    return <p>Cargando información del usuario...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="contenedor-panel-usuario">
      {usuario && (
        <>
          <h1 className="titulo-bienvenida">
            Bienvenido, {usuario.nombre} {usuario.apellidos}
          </h1>
          <h2 className="titulo-informacion">Información Personal</h2>
          <ul className="lista-de-informacion">
            <li>
              <strong>Nombre:</strong> {usuario.nombre}
            </li>
            <li>
              <strong>Apellidos:</strong> {usuario.apellidos}
            </li>
            <li>
              <strong>Correo:</strong> {usuario.correo}
            </li>
            <li>
              <strong>Rol:</strong>{" "}
              {usuario.id_rol === 1 ? "Administrador" : "Usuario"}
            </li>
            <li>
              <strong>Fecha de Registro:</strong> {usuario.fecha_registro}
            </li>
          </ul>
          <div className="contenedor-btns">
            <button className="btn-editar-info" disabled>
              Editar Información
            </button>
            <button className="btn-eliminar-cuenta" disabled>
              Eliminar Cuenta
            </button>
            <button className="btn-tus-cursos" onClick={obtenerCursosInscritos}>
              Tus Cursos
            </button>
          </div>
          {/* Mostrar los cursos inscritos */}
          {loadingCursos ? (
            <p>Cargando cursos...</p>
          ) : (
            <div className="lista-cursos">
              {cursosInscritos.length > 0 ? (
                <ul>
                  {cursosInscritos.map((curso) => (
                    <li key={curso.id_curso}>
                      {/* Enlace al curso para acceder a los detalles y realizarlo */}
                      <Link to={`/curso/${curso.id_curso}/realizar`}>
                        {curso.nombre_curso}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No estás inscrito en ningún curso.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsuarioDashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../../hojas-de-estilos/UsuarioDashboard.css";

// const CURSOS_INSCRITOS = "http://localhost:3000/api/usuario/cursos-inscritos";

// const UsuarioDashboard = () => {
//   const [usuario, setUsuario] = useState(null); // Estado para almacenar la información del usuario
//   const [cursosInscritos, setCursosInscritos] = useState([]); // Estado para almacenar los cursos en los que está inscrito
//   const [loading, setLoading] = useState(true); // Estado para manejar la carga
//   const [error, setError] = useState(null); // Estado para manejar errores
//   const [loadingCursos, setLoadingCursos] = useState(false); // Para manejar la carga de cursos inscritos

//   // Función para obtener los datos del usuario
//   const buscarUsuario = async () => {
//     const token = localStorage.getItem("token"); // Obtener el token del localStorage
//     if (!token) {
//       setError(
//         "No se encontró un token válido. Por favor, inicie sesión nuevamente."
//       );
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get("/api/usuario", {
//         headers: { Authorization: `Bearer ${token}` }, // Token en los headers
//       });
//       setUsuario(response.data); // Actualizar el estado con los datos del usuario
//     } catch (error) {
//       console.error("Error al obtener los datos del usuario:", error);
//       setError("No se pudo obtener la información del usuario."); // Manejo de errores
//     } finally {
//       setLoading(false); // Asegurarse de actualizar el estado de carga en cualquier caso
//     }
//   };

//   const obtenerCursosInscritos = async () => {
//     setLoadingCursos(true);
//     const token = localStorage.getItem("token");

//     console.log("Token:", token); // Verifica que el token esté disponible

//     if (!token) {
//       setError("No hay token disponible.");
//       setLoadingCursos(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${CURSOS_INSCRITOS}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log(response.data); // Verifica los datos recibidos
//       setCursosInscritos(response.data); // Actualizar el estado con los cursos inscritos
//     } catch (error) {
//       console.error("Error al obtener los cursos inscritos:", error);
//       setError("No se pudo obtener la lista de cursos.");
//     } finally {
//       setLoadingCursos(false);
//     }
//   };

//   useEffect(() => {
//     buscarUsuario().catch((error) => console.error("Error:", error)); // Muestra cualquier error en la consola
//   }, []);

//   if (loading) {
//     return <p>Cargando información del usuario...</p>; // Mensaje mientras se cargan los datos
//   }

//   if (error) {
//     return <p>{error}</p>; // Mostrar error si hay alguno
//   }

//   return (
//     <div className="contenedor-panel-usuario">
//       {usuario && (
//         <>
//           <h1>Bienvenido, {usuario.nombre} {usuario.apellidos}</h1>
//           <h2>Información Personal</h2>
//           <ul>
//             <li>
//               <strong>Nombre:</strong> {usuario.nombre},
//             </li>
//             <li>
//               <strong>Apellidos:</strong> {usuario.apellidos}
//             </li>
//             <li>
//               <strong>Correo:</strong> {usuario.correo}
//             </li>
//             <li>
//               <strong>Rol:</strong>{" "}
//               {usuario.id_rol === 1 ? "Administrador" : "Usuario"}
//             </li>
//             <li>
//               <strong>Fecha de Registro:</strong> {usuario.fecha_registro}
//             </li>
//           </ul>
//           <button disabled>Editar Información</button>
//           <button disabled>Eliminar Cuenta</button>
//           {/* Botón para ver los cursos inscritos */}
//           <button onClick={obtenerCursosInscritos}>Tus Cursos</button>

//           {/* Mostrar los cursos inscritos */}
//           {loadingCursos ? (
//             <p>Cargando cursos...</p>
//           ) : (
//             <div>
//               {cursosInscritos.length > 0 ? (
//                 <ul>
//                   {cursosInscritos.map((curso) => (
//                     <li key={curso.id_curso}>
//                       {curso.nombre_curso} - {curso.descripcion}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No estás inscrito en ningún curso.</p>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default UsuarioDashboard;
