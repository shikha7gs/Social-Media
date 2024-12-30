import { validateJWT } from "@/func/generate_token";
import { MetaData } from "@/lib/model/MetaData"
import { Post } from "@/lib/model/Post"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

export async function POST(req) {
    const isAllowed = await rateLimit(req, "checkSession");
    if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
    const { userName, id } = await req.json()
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
    const validateToken = await validateJWT(token, id)
    if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
    await connectDb()
    const userExistanceByMetaData = await MetaData.findOne({ userName: userName })
    const userExistanceByPost = await Post.findOne({ userName: userName })
    if (!userExistanceByMetaData || !userExistanceByPost) return NextResponse.json({ success: false, message: "User not found" })
    return NextResponse.json({ success: true, metaData: userExistanceByMetaData, post: userExistanceByPost.posts })
}