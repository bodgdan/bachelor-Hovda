const express = require("express");
const router = express.Router();
const statsController = require("../controller/statsController");
const clientController = require("../controller/clientController");

router.get("/stats", clientController.verifyToken, statsController.getStats);

module.exports = router;
