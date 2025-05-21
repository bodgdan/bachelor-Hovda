const db = require("../db");
const jwt = require("jsonwebtoken"); // Needed if you verify via token here

class StatsController {
  async getStats(req, res) {
    try {
      const userId = req.userId; // Make sure this is set correctly via middleware

      const [warehouses, clients, goods, warehouseFill] = await Promise.all([
        db.query("SELECT COUNT(*) FROM warehouse WHERE user_id = $1", [userId]),
        db.query("SELECT COUNT(*) FROM clients WHERE user_id = $1", [userId]),
        db.query("SELECT COUNT(*) FROM goods WHERE user_id = $1", [userId]),
        db.query(
          `
          SELECT 
            w.name, 
            COALESCE(g.total_quantity, 0) AS quantity
          FROM warehouse w
          LEFT JOIN (
            SELECT 
              warehouse_id, 
              SUM(quantity) AS total_quantity
            FROM goods
            WHERE user_id = $1
            GROUP BY warehouse_id
          ) g ON w.id = g.warehouse_id
          WHERE w.user_id = $1
          ORDER BY w.id
          LIMIT 3
        `,
          [userId]
        ),
      ]);

      res.json({
        warehouses: parseInt(warehouses.rows[0].count, 10),
        clients: parseInt(clients.rows[0].count, 10),
        goods: parseInt(goods.rows[0].count, 10),
        warehouseFill: warehouseFill.rows.map(row => ({
          name: row.name,
          quantity: parseInt(row.quantity, 10),
        })),
      });
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new StatsController();
