import { validateJWT } from "@/func/generate_token";
import { MetaData } from "@/lib/model/MetaData";
import { Post } from "@/lib/model/Post"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { data, viewerUserName, alreadyLiked, id } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
        await connectDb()
        if (!alreadyLiked) {
            await MetaData.findOneAndUpdate(
                { userName: viewerUserName },
                { $push: { likePosts: data.posts[0].uid } },
                { new: true }
            );
            await Post.findOneAndUpdate(
                { userName: data.userName, "posts.uid": data.posts[0].uid },
                { $push: { "posts.$.likes": viewerUserName } },
                { new: true }
            );
        } else {
            await MetaData.findOneAndUpdate(
                { userName: viewerUserName },
                { $pull: { likePosts: data.posts[0].uid } },
                { new: true }
            )
            await Post.findOneAndUpdate(
                { userName: data.userName, "posts.uid": data.posts[0].uid },
                { $pull: { "posts.$.likes": viewerUserName } },
                { new: true }
            );
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}