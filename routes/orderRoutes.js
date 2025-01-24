// src/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/active/:userId", orderController.getActiveOrders);
router.get("/completed/:userId", orderController.getCompletedOrders);
router.post("/complete/:orderId", orderController.completeOrder);

module.exports = router;
