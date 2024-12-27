import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    posts: { type: Array, default: [] },
    userName: { type: String, required: true, unique: true }
}, { timestamps: true });

export const Post =
    mongoose.models.posts || mongoose.model("posts", postSchema);