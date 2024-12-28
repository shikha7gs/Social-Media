import { validateJWT } from "@/func/generate_token"
import { MetaData } from "@/lib/model/MetaData"
import { Post } from "@/lib/model/Post"
import { User } from "@/lib/model/User"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { userName, id } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
        await connectDb()
        const findUserMetaData = await MetaData.findOne({ userName: userName })
        const findPost = await Post.findOne({ userName: userName })
        if (findUserMetaData && findPost) {
            return NextResponse.json({ success: true, data: findUserMetaData, posts: findPost })
        }
        const findFullName = await User.findOne({ userName: userName })
        const newMetaData = new MetaData({
            userName: userName,
            fullName: findFullName.fullName
        })
        await newMetaData.save()
        const newPost = new Post({
            userName: userName,
        })
        await newPost.save()
        return NextResponse.json({ success: true, reload: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "something went wrong" })
    }
}