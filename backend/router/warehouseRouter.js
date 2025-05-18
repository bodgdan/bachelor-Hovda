const express = require("express");
const router = express.Router();
const WarehouseController = require("../controller/warehhouseController");

router.get("/warehouses", WarehouseController.getAll);
router.post("/warehouses", WarehouseController.create);
router.put("/warehouses/:id", WarehouseController.update);
router.delete("/warehouses/:id", WarehouseController.delete);

module.exports = router;
