const productsController = require("../DAO/Controllers/controller.products");
const cartController = require("../DAO/Controllers/controller.carts");
const userController = require("../DAO/Controllers/controller.users");
const authController = require("../DAO/Controllers/controller.auth");
const currentSession = require("../DAO/Controllers/controller.sessions");
const messagesController = require("../DAO/Controllers/controller.messages");

const router = (app) => {
  app.use("/api/register", userController);
  app.use("/api/login", authController);
  app.use("/api/dbProducts", productsController);
  app.use("/api/dbCarts", cartController);
  app.use("/api/sessions/current", currentSession);
  app.use("/api/messages", messagesController);
};

module.exports = router;
