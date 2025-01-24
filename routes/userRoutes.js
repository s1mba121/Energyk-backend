// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:userId", userController.getUserData);
router.put("/:userId", userController.editUserData);
router.post("/redeem", userController.redeemPromoCode);

module.exports = router;
