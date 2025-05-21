const express = require("express");
const router = express.Router();
const clientController = require("../controller/clientController");

router.use(clientController.verifyToken);
router.get("/client", clientController.getAll);
router.post("/client", clientController.create);

module.exports = router;
