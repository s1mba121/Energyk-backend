// src/models/Machine.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const machineSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    powerBanks: [{ type: String, ref: "PowerBank" }],
    capacity: { type: Number, required: true, default: 6 },
    defectiveCount: { type: Number, default: 0 },
    inServiceCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["active", "inactive", "in_service", "expectation"],
        default: "active",
    },
    lastExpectationTime: Date,
    expectedByUser: { type: String, ref: "User" },
    kod: { type: String, requared: true },
    description: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

machineSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Machine", machineSchema);
