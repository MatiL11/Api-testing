const { Router } = require("express");
const router = Router();
const UserDTO = require("../DTO/users.dto");

router.get("/", (req, res) => {
  try {
    if (req.session && req.session.user) {
      const userSession = req.session.user;
      const UserDto = new UserDTO(userSession);
      return res.status(200).json(UserDto);
    }
    return res.json({
      message: "Usuario no autenticado, por favor inicia sesion o registrate.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
