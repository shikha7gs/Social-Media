import { validateJWT } from "@/func/generate_token";
import { Post } from "@/lib/model/Post"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { uidArr, id } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })

        // Task find posts basewd on UID and return in array
        await connectDb()
        const postDB = await Post.find({})
        // console.log(postDB)
        let finalPosts = []
        await uidArr.map((uid) => {
            const result = postDB.map(item => {
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
            finalPosts.push(result[0])
        })
        return NextResponse.json({ success: true, postArr: finalPosts })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}