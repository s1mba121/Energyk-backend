// src/models/User.js
const uuid = require('uuid');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: String, default: uuid.v4 },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    kod: { type: String, required: false },
    kodExpires: { type: Date, required: false },
    verify: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
    coins: { type: String, required: false },
    timestamp: { type: Date, default: Date.now },
    ban: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);