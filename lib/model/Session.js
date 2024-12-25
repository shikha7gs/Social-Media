import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true }
}, { timestamps: true })

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Session =
    mongoose.models.sessions || mongoose.model("sessions", sessionSchema);