const bcrypt = require("bcrypt");
const Users = require("../../models/Users.model");
const Cart = require("../../models/Carts.model");
const {
  admin_email,
  admin_password,
} = require("../../config/adminUser.config");

class UserRepository {
  async createUser(userInfo) {
    try {
      const { first_name, last_name, email, age, password } = userInfo;

      let role = "usuario";

      const passwordMatch = bcrypt.compare(password, admin_password);

      if (email === admin_email && passwordMatch) {
        role = "administrador";
      }

      const cart = new Cart();
      await cart.save();
      const cartId = cart._id;

      const newUserInfo = {
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cartId,
      };

      const user = await Users.create(newUserInfo);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;
