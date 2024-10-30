import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../hojas-de-estilos/ListaDeCursos.css";

const API_URL = "http://localhost:3000/api/cursos";

const ListaDeCursos = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(API_URL);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card-container">
      {courses.map((course) => (
        <div
          key={course.id_curso}
          className="course-card"
          onClick={() => navigate(`/curso/${course.id_curso}`)}
        >
          <img
            src={course.imagen_url}
            alt={course.nombre_curso}
            className="img"
          />

          <h3>{course.nombre_curso}</h3>
          <p>{course.descripcion}</p>
          <p>Profesor: {course.nombre_creador}</p>
        </div>
      ))}
    </div>
  );
};

export default ListaDeCursos;
