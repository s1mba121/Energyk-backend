// src/routes/machineRoutes.js
const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController");

router.post("/set-expectation", machineController.setExpectation);
router.post("/respond-to-machine", machineController.respondToMachine);
router.post("/add-machine", machineController.addMachine);
router.get("/all", machineController.getAllMachines);
router.post("/cancel-expectation", machineController.cancelExpectation);
router.get("/status/:kod", machineController.getMachineStatus);

router.delete("/delete/:id", machineController.deleteMachineById);

module.exports = router;
