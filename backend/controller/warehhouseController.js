const db = require("../db");
const jwt = require('jsonwebtoken')

class WarehouseController {
    async getAll(req, res) {
        try {
          const token = req.cookies.token;
          
          if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
          }
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.id;
      
          const result = await db.query(`
            SELECT 
              w.*, 
              COALESCE(g.total_quantity, 0) AS count
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
          `, [userId]);
      
          res.json(result.rows);
        } catch (err) {
          console.error("Error getting warehouses:", err);
          res.status(500).json({ message: "Server error" });
        }
      }
    async create(req, res) {
        const {
            name,
            location,
            principle,
            sections
        } = req.body;

        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({
                    message: "No token provided"
                });
            }

            const decoded = jwt.verify(token, "rweqtwqfdsagqrwgfsre87423huiu2u243h932y4b38g28b");

            const userId = decoded.id;

            const result = await db.query(
                `INSERT INTO warehouse (name, location, principle, sections, user_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
                [name, location, principle, sections, userId]
            );

            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error("Error creating warehouse:", err);
            res.status(500).json({
                message: "Server error during creation"
            });
        }
    }

    async update(req, res) {
        const {
            id
        } = req.params;
        const {
            name,
            location,
            principle,
            sections
        } = req.body;

        try {
            const result = await db.query(
                "UPDATE warehouse SET name = $1, location = $2, principle = $3, sections = $4 WHERE id = $5 RETURNING *",
                [name, location, principle, sections, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Warehouse not found"
                });
            }

            res.json(result.rows[0]);
        } catch (err) {
            console.error("Error updating warehouse:", err);
            res.status(500).json({
                message: "Server error during update"
            });
        }
    }

    // DELETE warehouse by id
    async delete(req, res) {
        const {
            id
        } = req.params;

        try {
            const result = await db.query("DELETE FROM warehouse WHERE id = $1 RETURNING *", [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Warehouse not found"
                });
            }

            res.json({
                message: "Warehouse deleted successfully"
            });
        } catch (err) {
            console.error("Error deleting warehouse:", err);
            res.status(500).json({
                message: "Server error during deletion"
            });
        }
    }
}

module.exports = new WarehouseController();