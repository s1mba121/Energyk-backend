// src/controllers/machineController.js
const Machine = require("../models/Machine");
const User = require("../models/User");
const PowerBank = require("../models/PowerBank");
const Order = require("../models/Order");

exports.setExpectation = async (req, res) => {
    try {
        const { kod } = req.body;

        const machine = await Machine.findOne({ kod });
        if (!machine) {
            return res.status(404).json({ message: "Machine not found" });
        }

        machine.status = "expectation";
        machine.lastExpectationTime = new Date();
        machine.expectedByUser = null;
        await machine.save();

        console.log(`Machine with kod ${kod} is now in expectation mode.`);
        res.status(200).json({
            message: "Machine is waiting for a response.",
            machine,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.respondToMachine = async (req, res) => {
    try {
        const { userId, kod } = req.body;

        const machine = await Machine.findOne({ kod, status: "expectation" });
        if (!machine) {
            return res.status(404).json({
                message: "Machine not found or not in expectation mode.",
            });
        }

        const user = await User.findById(userId);
        if (!user || user.ban) {
            return res
                .status(400)
                .json({ message: "User not found or banned." });
        }

        if (user.balance < 10) {
            return res.status(400).json({
                message: "Your balance is too low. It must be at least 20byn.",
            });
        }

        const powerBank = await PowerBank.findOne({
            machineId: machine._id,
            status: "available",
        });
        if (!powerBank) {
            return res
                .status(404)
                .json({ message: "No available power banks." });
        }

        powerBank.status = "rented";
        powerBank.userId = user._id;
        powerBank.rentedAt = new Date();
        await powerBank.save();

        const order = new Order({
            machineId: machine._id,
            powerBankId: powerBank._id,
            userId: user._id,
            initialCharge: 3,
        });
        await order.save();

        user.balance -= 3;
        await user.save();

        machine.status = "active";
        machine.expectedByUser = user._id;
        await machine.save();

        console.log(`Order ${order._id} created for user ${userId}.`);
        res.status(200).json({
            message: "Power bank rented successfully. Order created.",
            order,
            powerBank,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.addMachine = async (req, res) => {
    try {
        const { location, latitude, longitude, capacity, kod, description } =
            req.body;

        if (!location || !kod || !capacity) {
            return res
                .status(400)
                .json({ message: "Location, kod, and capacity are required." });
        }

        const newMachine = new Machine({
            location,
            latitude,
            longitude,
            capacity,
            kod,
            description,
        });

        await newMachine.save();

        const powerBanks = [];
        for (let i = 0; i < capacity; i++) {
            powerBanks.push({
                machineId: newMachine._id,
                status: "available",
            });
        }

        const createdPowerBanks = await PowerBank.insertMany(powerBanks);

        newMachine.powerBanks = createdPowerBanks.map((pb) => pb._id);
        await newMachine.save();

        console.log(
            `New machine added with ID: ${newMachine._id} and ${capacity} power banks.`
        );

        res.status(201).json({
            message: "Machine and power banks added successfully.",
            machine: newMachine,
            powerBanks: createdPowerBanks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getMachineStatus = async (req, res) => {
    try {
        const { kod } = req.params;

        const machine = await Machine.findOne({ kod }).populate(
            "expectedByUser"
        );

        if (!machine) {
            return res.status(404).json({ message: "Machine not found." });
        }

        const rentedPowerBank = await PowerBank.findOne({
            machineId: machine._id,
            userId: machine.expectedByUser?._id,
            status: "rented",
        });

        res.status(200).json({
            message: "Machine status retrieved successfully.",
            status: machine.status,
            expectedByUser: machine.expectedByUser,
            rentedPowerBank,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getAllMachines = async (req, res) => {
    try {
        const machines = await Machine.find();

        if (!machines || machines.length === 0) {
            return res.status(404).json({ message: "No machines found." });
        }

        res.status(200).json({
            message: "Machines retrieved successfully.",
            machines,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.cancelExpectation = async (req, res) => {
    try {
        const { kod } = req.body;

        const machine = await Machine.findOne({ kod });
        if (!machine) {
            return res.status(404).json({ message: "Machine not found." });
        }

        if (machine.status !== "active") {
            return res
                .status(400)
                .json({ message: "Machine is not in expectation mode." });
        }

        machine.status = "active";
        machine.expectedByUser = null;
        await machine.save();

        console.log(
            `Expectation for machine with kod ${kod} has been canceled.`
        );
        res.status(200).json({
            message: "Expectation has been canceled.",
            machine,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.deleteMachineById = async (req, res) => {
    try {
        const { id } = req.params;

        const machine = await Machine.findByIdAndDelete(id);
        if (!machine) {
            return res.status(404).json({ error: "Machine not found." });
        }

        console.log(`Machine with ID ${id} has been deleted.`);
        res.status(200).json({
            message: `Machine with ID ${id} deleted successfully.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};
