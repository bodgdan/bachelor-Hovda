const db = require("../db");
const jwt = require("jsonwebtoken");

class ClientController {
  verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.userId = decoded.id;
      next();
    });
  }

  async getAll(req, res) {
    try {
      const userId = req.userId;
      const result = await db.query(
        `SELECT * FROM clients WHERE user_id = $1`,
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching clients:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  async create(req, res) {
    try {
      const {
        name,
        contacts,
        address,
        code,
        head_of_office,
        requisites,
      } = req.body;

      if (!name || !contacts || !address || !code || !head_of_office || !requisites) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const userId = req.userId;

      const result = await db.query(
        `INSERT INTO clients (name, contacts, address, code, head_of_office, requisites, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, contacts, address, code, head_of_office, requisites, userId]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error creating client:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new ClientController();
