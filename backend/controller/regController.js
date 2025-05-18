const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../midleware/emailService')

class RegistrationController {
  async register(req, res) {
    const { name, surname, email, password } = req.body

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" })
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        })
      }

      const existingUser = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      )

      if (existingUser.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await db.query(
        "INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4)",
        [name, surname, email, hashedPassword]
      )

      res.json({ message: "User was registered successfully" })

    } catch (err) {
      console.error("Registration error:", err)
      res.status(500).json({ message: "Server error during registration" })
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
  
    try {
      const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  
      if (user.rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
  
      if (!validPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      const token = jwt.sign(
        { id: user.rows[0].id, email: user.rows[0].email },
        "rweqtwqfdsagqrwgfsre87423huiu2u243h932y4b38g28b",
        { expiresIn: '1d' }
      );
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.json({ message: "Login successful", token: token });
  
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
  

  async resetPasswordRequest(req, res) {
    const { email } = req.body;

    try {
      const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

      if (user.rows.length === 0) {
        return res.status(404).json({ message: "User with this email does not exist" });
      }

      const resetToken = jwt.sign(
        { id: user.rows[0].id },
        "rwerwet-wertwerewtewrtwerr23-tweerwetewrtew ",
        { expiresIn: '1h' }
      );

      const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

      await sendEmail(
        email,
        "Password Reset Request",
        `Hello ${user.rows[0].name},\n\nClick the link below to reset your password:\n\n${resetLink}\n\nThis link is valid for 1 hour.\n\nIf you didn't request a password reset, ignore this email.`
      );

      res.json({ message: "Password reset email sent" });

    } catch (err) {
      console.error("Reset request error:", err);
      res.status(500).json({ message: "Server error during password reset request" });
    }
  }

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
  
    try {
      const decoded = jwt.verify(token, "rwerwet-wertwerewtewrtwerr23-tweerwetewrtew ");
  
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await db.query("UPDATE users SET password = $1 WHERE id = $2", [
        hashedPassword,
        decoded.id,
      ]);
  
      res.json({ message: "Password has been reset successfully" });
  
    } catch (err) {
      console.error("Reset password error:", err);
      res.status(400).json({ message: "Invalid or expired token" });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      console.error("Logout error:", err);
      res.status(500).json({ message: "Server error during logout" });
    }
  }

}

module.exports = new RegistrationController()
