import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    token: { type: String, required: true, unique: true },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 20 * 1000),
    },
}, { timestamps: true })

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Token =
    mongoose.models.tokens || mongoose.model("tokens", tokenSchema);