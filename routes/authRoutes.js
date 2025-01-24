// src/routes/authRoutes.js
const express = require("express");
const userController = require("../controllers/authController");

const router = express.Router();

router.post("/register", userController.register);
router.post("/verify", userController.verifyUser);
router.post("/login", userController.login);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);
router.get("/all", userController.getAllUsers);

module.exports = router;
