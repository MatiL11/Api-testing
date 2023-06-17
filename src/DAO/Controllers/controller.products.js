const { Router } = require("express");
const Products = require("../../models/Products.model");
const Cart = require("../../models/Carts.model");
const router = Router();
const privateAccess = require("../../middlewares/privateAccess.middleware");
const productSearch = require("../products.dao");
const adminAccess = require("../../middlewares/adminAccess.middleware");

router.get("/", privateAccess, async (req, res) => {
  try {
    const user = req.session.user;
    const message = user
      ? `Bienvenido ${user.role} ${user.first_name} ${user.last_name}!`
      : null;

    const cart = await Cart.findOne({ _id: user.cartId });

    const cartId = cart._id.toString();
    const products = await productSearch(req, message, cartId);

    res.render("products.handlebars", products);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

router.post("/", adminAccess, async (req, res) => {
  try {
    const newProduct = await Products.create(req.body);
    res.json({ message: newProduct });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:productId", adminAccess, async (req, res) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    res.json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error actualizando producto" });
  }
});

router.delete("/:productId", adminAccess, async (req, res) => {
  try {
    await Products.findByIdAndDelete(req.params.productId);
    res.json({
      message: `El producto con el id ${req.params.productId} fue eliminado`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error borrando producto" });
  }
});

module.exports = router;
