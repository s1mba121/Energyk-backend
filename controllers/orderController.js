const Order = require("../models/Order");

exports.getActiveOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const activeOrders = await Order.find({ userId, status: "active" })
            .populate("machineId", "description location kod")
            .populate("powerBankId", "status");

        if (!activeOrders.length) {
            return res.status(400).json({ message: "No active orders found." });
        }

        const ordersWithDetails = activeOrders.map((order) => ({
            orderId: order._id,
            machineDescription: order.machineId?.description || "N/A",
            machineLocation: order.machineId?.location || "N/A",
            machineCode: order.machineId?.kod || "N/A",
            initialCharge: order.initialCharge,
            startTime: order.startTime,
            powerBankStatus: order.powerBankId?.status || "N/A",
        }));

        res.status(200).json({
            message: "Active orders retrieved successfully.",
            orders: ordersWithDetails,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getCompletedOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const completedOrders = await Order.find({
            userId,
            status: { $in: ["completed", "canceled"] },
        })
            .populate("machineId", "location kod")
            .populate("powerBankId", "status");

        if (!completedOrders.length) {
            return res
                .status(404)
                .json({ message: "No completed orders found." });
        }

        res.status(200).json({
            message: "Completed orders retrieved successfully.",
            orders: completedOrders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.completeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.status !== "active") {
            return res.status(400).json({ message: "Order is not active." });
        }

        order.status = "completed";
        order.endTime = new Date();

        const rentalDuration = Math.ceil(
            (Date.now() - order.startTime) / 600000
        );
        const totalCharge = order.initialCharge + rentalDuration * 1;

        order.totalCharge = totalCharge;
        await order.save();

        res.status(200).json({
            message: "Order completed successfully.",
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};
