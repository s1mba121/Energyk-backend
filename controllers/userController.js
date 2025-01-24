// src/controllers/userController.js
const User = require("../models/User");
const PromoCode = require("../models/PromoCode");

exports.getUserData = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.editUserData = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email, phone, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (password) user.password = password;

        await user.save();

        res.status(200).json({
            message: "User data updated successfully.",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.redeemPromoCode = async (req, res) => {
    try {
        const { userId, promoCode } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const code = await PromoCode.findOne({ code: promoCode });
        if (!code) {
            return res.status(404).json({ message: "Promo code not found." });
        }

        if (code.isUsed) {
            return res
                .status(400)
                .json({ message: "Promo code already used." });
        }

        user.balance += code.amount;
        code.isUsed = true;

        await user.save();
        await code.save();

        res.status(200).json({
            message: `Promo code redeemed. Balance increased by ${code.amount}.`,
            balance: user.balance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};
