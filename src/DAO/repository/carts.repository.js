const logger = require("../../config/logs/logger.config");
const ErrorRepository = require("./error.repository");

class CartsRepository {
  async saveProduct(cart, product) {
    try {
      const itemIndex = cart.productos.findIndex((item) =>
        item.product._id.equals(product._id)
      );
      if (itemIndex !== -1) {
        cart.productos[itemIndex].quantity += 1;
      } else {
        cart.productos.push({
          product: product,
          quantity: 1,
        });
      }
      await cart.save();
      logger.debug("producto guardado con exito!");
    } catch (error) {
      logger.error("Error al agregar el producto al carrito", error);
      throw new ErrorRepository("Error al agregar producto al carrito", 400);
    }
  }
}

module.exports = CartsRepository;
