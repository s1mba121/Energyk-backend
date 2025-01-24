// src/controllers/promoCodeController.js
const PromoCode = require("../models/PromoCode");

exports.addPromoCode = async (req, res) => {
    try {
        const { code, amount } = req.body;

        if (!code || !amount) {
            return res
                .status(400)
                .json({ message: "Code and amount are required." });
        }

        const newPromoCode = new PromoCode({ code, amount });
        await newPromoCode.save();

        res.status(201).json({
            message: "Promo code created successfully.",
            promoCode: newPromoCode,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.status(200).json({ promoCodes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};
