// src/controllers/authController.js
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }],
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Email или телефон уже используются" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const generateNumericCode = (length) => {
            return Array.from({ length }, () =>
                Math.floor(Math.random() * 10)
            ).join("");
        };
        const kod = generateNumericCode(6);
        const kodExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newUser = new User({
            email,
            phone,
            password: hashedPassword,
            kod,
            kodExpires,
        });
        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Верификация аккаунта",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #132330;
                            padding: 20px;
                            text-align: center;
                            height: 25px;
                        }
                        .header img {
                            width: 100px;
                            height: auto;
                            position: relative;
                            top: -34px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h1 {
                            color: #333333;
                            font-size: 24px;
                        }
                        .content p {
                            color: #666666;
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .code {
                            font-size: 18px;
                            color: #132330;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .footer {
                            background-color: #f1f1f1;
                            text-align: center;
                            padding: 10px;
                            font-size: 12px;
                            color: #999999;
                        }
                        .footer a {
                            color: #4CAF50;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://i.imgur.com/FaTwjjS.png" alt="Energyk Logo">
                        </div>
                        <div class="content">
                            <h1>Подтвердите ваш Email</h1>
                            <p>Здравствуйте, ваш аккаунт почти готов. Пожалуйста, подтвердите ваш адрес электронной почты.</p>
                            <p>Ваш код для подтверждения:</p>
                            <div class="code">${kod}</div>
                            <p>Код действует в течение 24 часов.</p>
                        </div>
                        <div class="footer">
                            <p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>
                            <p>© 2025 Energyk</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        res.status(201).json({
            message:
                "Регистрация успешна. Проверьте вашу почту для завершения верификации.",
        });
    } catch (err) {
        res.status(500).json({
            error: "Ошибка регистрации",
            details: err.message,
        });
    }
};

exports.verifyUser = async (req, res) => {
    const { email, kod } = req.body;

    try {
        const user = await User.findOne({ email, kod });

        if (!user) {
            return res.status(400).json({ error: "Неверный код или email" });
        }

        if (user.kodExpires < new Date()) {
            return res
                .status(400)
                .json({ error: "Код истёк. Зарегистрируйтесь заново." });
        }

        user.verify = true;
        user.kod = 777;
        user.kodExpires = null;
        await user.save();

        res.status(200).json({ message: "Верификация успешна" });
    } catch (err) {
        res.status(500).json({
            error: "Ошибка верификации",
            details: err.message,
        });
    }
};

exports.login = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email }, { phone }] });
        if (!user) {
            return res
                .status(401)
                .json({ error: "Неправильные учетные данные" });
        }

        if (!user.verify) {
            return res.status(403).json({
                error: "Ваш аккаунт не верифицирован. Пожалуйста, подтвердите ваш email.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ error: "Неправильные учетные данные" });
        }

        if (user.ban) {
            return res.status(403).json({
                error: "Ваш аккаунт заблокирован. Свяжитесь с администрацией.",
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, admin: user.admin },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Вход выполнен успешно",
            token,
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone,
                balance: user.balance,
                coins: user.coins,
                admin: user.admin,
                timestamp: user.timestamp,
                coins: user.coins,
            },
        });
    } catch (err) {
        res.status(500).json({ error: "Ошибка входа", details: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, phone, password } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { email, phone, password },
            { new: true, runValidators: true }
        );
        if (!updatedUser)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            error: "Error updating user",
            details: err.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({
            error: "Error deleting user",
            details: err.message,
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({
            error: "Ошибка получения данных пользователей",
            details: err.message,
        });
    }
};
