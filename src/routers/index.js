const productsController = require("../DAO/Controllers/controller.products");
const cartController = require("../DAO/Controllers/controller.carts");
const userController = require("../DAO/Controllers/controller.users");
const authController = require("../DAO/Controllers/controller.auth");
const currentSession = require("../DAO/Controllers/controller.sessions");
const messagesController = require("../DAO/Controllers/controller.messages");
const loggerTest = require("../DAO/Controllers/controller.logger");
const ErrorRepository = require("../DAO/repository/error.repository.js");
const adminPanel = require("../DAO/Controllers/controller.adminPanel");
const registerController = require("../DAO/Controllers/controller.register");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorRepository) {
    const errorMessage = err.message || "Error desconocido";
    res.status(err.code).json({ error: errorMessage });
  } else {
    console.error(err);
    res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
};

const router = (app) => {
  app.use("/api/register", registerController);
  app.use("/api/login", authController);
  app.use("/api/dbProducts", productsController);
  app.use("/api/dbCarts", cartController);
  app.use("/api/user", userController);
  app.use("/api/messages", messagesController);
  app.use("/api/loggerTest", loggerTest);
  app.use("/api/adminPanel", adminPanel);
  app.use("/api/sessions/current", currentSession);
  app.use(errorHandler);
};

module.exports = router;
