const CustomErrorRepository = require("../DAO/repository/error.repository");

function userAcces(req, res, next) {
  if (req.user.role === "usuario" || req.user.role === "administrador") {
    next();
  } else {
    next(new CustomErrorRepository(403));
  }
}

module.exports = userAcces;
