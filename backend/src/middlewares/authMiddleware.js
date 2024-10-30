

// Ese es el controlador que si funciona, dejalo, me toma el id_usuario perfecto.
// Me deja inscribirme a los cursos, dejalo, enserio.

const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.sendStatus(403); // No se proporcionó token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Token no válido
    }

    req.user = decoded; // Adjunta la información del usuario al request
    next(); // Continúa al siguiente middleware o ruta
  });
};



// const jwt = require('jsonwebtoken');

// exports.authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(403).json({ message: "Token no proporcionado" }); // Respuesta unificada
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Token no válido" }); // Respuesta unificada
//     }
    
//     req.user = decoded; // Adjunta la información del usuario al request
//     next(); // Continúa al siguiente middleware o ruta
//   });
// };


// ------------------------------------

// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Extrae el token del encabezado
//     if (!token) {
//         return res.status(403).json({ message: 'No se proporcionó el token' });
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Token no válido' });
//         }
//         req.user = decoded; // Almacena la información del usuario decodificada en la solicitud
//         next();
//     });
// };









