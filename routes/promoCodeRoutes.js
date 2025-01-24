// src/routes/promoCodeRoutes.js
const express = require("express");
const router = express.Router();
const promoCodeController = require("../controllers/promoCodeController");

router.post("/add", promoCodeController.addPromoCode);
router.get("/", promoCodeController.getAllPromoCodes);

module.exports = router;
