import { validateJWT } from "@/func/generate_token";
import { Post } from "@/lib/model/Post"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";


export async function POST(req) {
    const isAllowed = await rateLimit(req, "checkAuthenticate");
    if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
    const { uid,id } = await req.json()
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
    const validateToken = await validateJWT(token, id)
    if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
    await connectDb()
    const find = await Post.find({})
    // Here I am checking the post by uid and returning user details with specific post
    const result = find.map(item => {
        const user = item._doc;
        if (!user) return null;
        const matchingPosts = user.posts.filter(post => post.uid === uid);
        if (matchingPosts.length > 0) {
            return {
                ...user,
                posts: matchingPosts
            };
        }
        return null;
    }).filter(user => user !== null);
    if (!result[0]) return NextResponse.json({ success: false, message: "No post found" })
    return NextResponse.json({ success: true, data: result[0] })
}