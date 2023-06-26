const errorMessages = {
  400: "Peticion incorrecta",
  401: "No autorizado",
  403: "Acceso denegado",
  404: "No encontrado",
  500: "Error del servidor",
};

class ErrorRepository extends Error {
  constructor(code, message) {
    super(message || errorMessages[code]);
    this.code = code;
  }
}

module.exports = ErrorRepository;
