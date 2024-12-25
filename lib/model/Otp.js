import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
    otp: { type: Number, required: true },
    uuid: { type: String, required: true },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Otp =
    mongoose.models.otps || mongoose.model("otps", otpSchema);