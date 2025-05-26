const db = require("../db");
const jwt = require("jsonwebtoken");

class GoodsController {
  async verifyToken(req, res, next) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(403).json({
          message: "No token provided"
        });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Unauthorized"
          });
        }
        req.userId = decoded.id;
        next();
      });
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(500).json({
        message: "Server error"
      });
    }
  }

  // Add a new good for the authenticated user
  async addGood(req, res) {
    try {
      const {
        name,
        code,
        unit,
        quantity,
        arrival_date,
        storage_term,
        client_id,
        warehouse_id,
        section,
      } = req.body;

      if (
        !name ||
        !code ||
        !unit ||
        quantity === undefined ||
        !arrival_date ||
        !storage_term ||
        !client_id ||
        !warehouse_id ||
        !section
      ) {
        return res.status(400).json({
          message: "All fields are required"
        });
      }

      const query = `
  INSERT INTO goods (
    name, code, unit, quantity, arrival_day,
    storage_term, company_id, warehouse_id, section, user_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING id;
`;

      const values = [
        name,
        code,
        unit,
        quantity,
        arrival_date, // note: inserted as arrival_day in DB
        storage_term,
        client_id, // inserted as company_id in DB
        warehouse_id,
        section,
        req.userId,
      ];

      const result = await db.query(query, values);

      return res.status(201).json({
        message: "Good added successfully",
        goodId: result.rows[0].id,
      });
    } catch (err) {
      console.error("Add good error:", err);
      return res.status(500).json({
        message: "Server error"
      });
    }
  }

  async getGoodsByUser(req, res) {
    try {
      const userId = req.userId;
      console.log("Fetching goods for user ID:", userId);

      const query = `
        SELECT 
          goods.id,
          goods.name,
          goods.code,
          goods.unit,
          goods.quantity,
          goods.arrival_day,
          goods.storage_term,
          goods.company_id,
          clients.name AS client_name,
          goods.section,
          warehouse.name AS warehouse_name
        FROM goods
        LEFT JOIN warehouse ON goods.warehouse_id = warehouse.id
        LEFT JOIN clients ON goods.company_id = clients.id
        WHERE goods.user_id = $1;
      `;

      const values = [userId];

      const result = await db.query(query, values);

      return res.status(200).json({
        goods: result.rows
      });
    } catch (err) {
      console.error("Get goods error:", err);
      return res.status(500).json({
        message: "Server error"
      });
    }
  }
}

module.exports = new GoodsController();