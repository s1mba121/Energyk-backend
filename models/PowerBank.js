// src/models/PowerBank.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const powerBankSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4, required: true },
    machineId: { type: String, ref: "Machine", required: true },
    status: {
        type: String,
        enum: ["available", "rented", "in_service", "defective"],
        default: "available",
    },
    userId: { type: String, ref: "User", default: null },
    rentedAt: { type: Date, default: null },
    location: {
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false },
    },
    timestamp: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

powerBankSchema.pre("save", async function (next) {
    this.updatedAt = Date.now();

    if (this.isModified("status")) {
        const Machine = mongoose.model("Machine");

        const machine = await Machine.findById(this.machineId);

        if (machine) {
            const defectiveCount = await mongoose
                .model("PowerBank")
                .countDocuments({
                    machineId: this.machineId,
                    status: "defective",
                });

            const inServiceCount = await mongoose
                .model("PowerBank")
                .countDocuments({
                    machineId: this.machineId,
                    status: "in_service",
                });

            machine.defectiveCount = defectiveCount;
            machine.inServiceCount = inServiceCount;
            await machine.save();
        }
    }

    next();
});

module.exports = mongoose.model("PowerBank", powerBankSchema);
