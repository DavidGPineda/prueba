import React from "react";

const VideoLeccion = ({ url }) => {
  // Extraer el ID del video de YouTube de la URL
  const videoId = url?.split("v=")[1]?.split("&")[0];

  // Si no hay un video ID, no renderizar nada
  if (!videoId) {
    return <p>No se pudo cargar el video.</p>;
  }

  return (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="Video de lección"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  );
};

export default VideoLeccion;
