import { validateJWT } from "@/func/generate_token";
import { Post } from "@/lib/model/Post";
import connectDb from "@/lib/mongoose";
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "signup");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { title, description, category, id, userName } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
        await connectDb();
        const userPostDb = await Post.findOne({ userName: userName });
        const uuid = uuidv4()
        if (userPostDb) {
            userPostDb.posts.push({
                title: title,
                description: description,
                category: category,
                uid: uuid,
                likes: [],
                viewers: []
            });
            await userPostDb.save();
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ success: false, message: "User not found" })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}