const verificarAdmin = (req, res, next) => {
    if (req.user.id_rol === 1) { // 1 es Admin, 2 es Estudiante
      next();
    } else {
      return res.status(403).send('Acceso denegado: No eres administrador');
    }
  };
  
  module.exports = verificarAdmin;
  