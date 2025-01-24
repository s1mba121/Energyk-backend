// src/models/Order.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4, required: true },
    machineId: { type: String, ref: "Machine", required: true },
    powerBankId: { type: String, ref: "PowerBank", required: true },
    userId: { type: String, ref: "User", required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: null },
    initialCharge: { type: Number, required: true, default: 3 },
    totalCharge: { type: Number, default: null },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active",
    },
    timestamp: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Order", orderSchema);
