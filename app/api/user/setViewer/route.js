import { Post } from "@/lib/model/Post"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"


export async function POST(req) {
    try {
        const { userName, Uid, viewerUserName } = await req.json()
        await connectDb()
        const findPostAccount = await Post.findOne({ userName: userName })
        if (!findPostAccount.posts.find(post => post.uid === Uid).viewers.includes(viewerUserName)) {//if user already doesn't has watched, it will be triggered
            findPostAccount.posts.find(post => post.uid === Uid).viewers.push(viewerUserName);
            findPostAccount.markModified('posts') 
            await findPostAccount.save()
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}