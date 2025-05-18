const express = require('express');
const router = express.Router();
const GoodsController = require("../controller/goodsController");

router.post("/goods", GoodsController.verifyToken, GoodsController.addGood);
router.get("/goods", GoodsController.verifyToken, GoodsController.getGoodsByUser);

module.exports = router;
