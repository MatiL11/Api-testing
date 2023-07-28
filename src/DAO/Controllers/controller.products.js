const { Router } = require("express");
const Products = require("../../models/Products.model");
const Cart = require("../../models/Carts.model");
const router = Router();
const privateAccess = require("../../middlewares/privateAccess.middleware");
const productSearch = require("../products.dao");
const adminAccess = require("../../middlewares/adminAccess.middleware.js");
const userAcces = require("../../middlewares/userAccess.middleware.js");
const ProductsRepository = require("../repository/products.repository");
const logger = require("../../config/logs/logger.config");
const ErrorRepository = require("../repository/errors.repository");

router.get("/", privateAccess, async (req, res, next) => {
  try {
    const user = req.session.user;
    const message = user
      ? `Bienvenido ${user.role} ${user.first_name} ${user.last_name}!`
      : null;
    const cart = await Cart.findOne({ _id: user.cartId });
    const cartId = cart._id.toString();
    const products = await productSearch(req, message, cartId);

    logger.info("Productos cargados con exito", products);

    res.status(200).render("products.handlebars", products);
  } catch (error) {
    logger.error("Error al cargar los productos", error);
    next(error);
  }
});

router.get("/mockingProducts", userAcces, async (req, res, next) => {
  try {
    const productsRepository = new ProductsRepository();
    const mockProducts = await productsRepository.generateMockProducts();
    res.json({ Productos: mockProducts });
  } catch (error) {
    logger.error("Error al generar los productos", error);
    next(error);
  }
});

router.post("/", adminAccess, async (req, res, next) => {
  try {
    if (
      req.session.user.role !== "premium" &&
      req.session.user.role !== "administrador"
    ) {
      throw new ErrorRepository("Rol de usuario rechazado", 401);
    }

    if (req.body.owner === null) {
      req.body.owner === "administrador";
    }

    req.body.owner = req.session.user.email;

    const newProduct = await Products.create(req.body);
    logger.info("Se agrego un producto a la db", newProduct);
    res.status(200).json({ message: newProduct });
  } catch (error) {
    logger.error("Error al agregar producto", error);
    next(error);
  }
});

router.put("/:productId", adminAccess, async (req, res, next) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    logger.info("Producto actualizado con exito", updatedProduct);
    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    logger.error("Error al actualizar el producto");
    next(error);
  }
});

router.delete("/:productId", adminAccess, async (req, res, next) => {
  try {
    await Products.findByIdAndDelete(req.params.productId);
    logger.info("Producto eliminado", req.params.productId);
    res.json({
      message: `Product with ID ${req.params.productId} has been deleted`,
    });
  } catch (error) {
    logger.error("Error al eliminar el producto", error);
    next(error);
  }
});

module.exports = router;
