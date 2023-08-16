const logger = require("../../config/logs/logger.config");
const ErrorRepository = require("./error.repository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../../models/Users.model");
const { secret_key } = require("../../config/app.config");
const mailerDao = require("../mailer.dao");

class ResetPasswordRepository {
  async sendPasswordResetEmail(email) {
    const resetLink = `http://localhost:8080/api/login/forgot-password/${email}`;

    const mailOptions = {
      from: "diegoedvflores03@gmail.com",
      to: email,
      subject: "Restablecimiento de contraseña",
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
    };

    await mailerDao.sendMail(mailOptions);
  }

  async createToken(email, res) {
    try {
      const token = jwt.sign({ email }, secret_key, { expiresIn: "1h" });

      await this.sendPasswordResetEmail(email);

      res.cookie("resetToken", token, { maxAge: 3600000, httpOnly: true });
      logger.info("Token generado con exito", token);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(newPassword, token, email) {
    try {
      const decodecToken = jwt.verify(token, secret_key);
      if (decodecToken.email !== email) {
        return new ErrorRepository(
          "El usuario no coincide con el email de solicitud.",
          401
        );
      }
      const user = await Users.findOne({ email: email });
      const passwordMatch = bcrypt.compareSync(newPassword, user.password);

      if (passwordMatch) {
        alert("La contraseña debe ser diferente a la anterior");
        return res.status(401).json({
          error: "La nueva contraseña debe ser diferente a la anterior",
        });
      }
      const hashedPass = await bcrypt.hash(newPassword, 10);

      user.password = hashedPass;
      await user.save();

      logger.info("Contraseña actualizada con exito");
    } catch (error) {
      throw new ErrorRepository("Error al actualizar la contraseña", 500);
    }
  }
}

module.exports = ResetPasswordRepository;
