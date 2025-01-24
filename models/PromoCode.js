// src/models/PromoCode.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const promoCodeSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    code: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);
