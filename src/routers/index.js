const productsController = require("../DAO/Controllers/controller.products");
const cartController = require("../DAO/Controllers/controller.carts");
const userController = require("../DAO/Controllers/controller.users");
const authController = require("../DAO/Controllers/controller.auth");
const currentSession = require("../DAO/Controllers/controller.sessions");
const messagesController = require("../DAO/Controllers/controller.messages");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorRepository) {
    const errorMessage = err.message || "Error desconocido";
    res.status(err.code).json({ error: errorMessage });
  } else {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

const router = (app) => {
  app.use("/api/register", userController);
  app.use("/api/login", authController);
  app.use("/api/dbProducts", productsController);
  app.use("/api/dbCarts", cartController);
  app.use("/api/sessions/current", currentSession);
  app.use("/api/messages", messagesController);
};

module.exports = router;
