import React from 'react';
import '../../hojas-de-estilos/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} David Gordillo Pineda - BISAN. Todos los derechos reservados.</p>
        <ul>
          <li><a href="/pagina-terminos">Términos de Servicio</a></li>
          <li><a href="/pagina-privacidad">Política de Privacidad</a></li>
          <li><a href="/pagina-contacto">Contacto</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
