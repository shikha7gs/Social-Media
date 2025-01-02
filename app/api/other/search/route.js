import { validateJWT } from "@/func/generate_token";
import { MetaData } from "@/lib/model/MetaData"
import { Post } from "@/lib/model/Post"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { id, type, searchedQuery } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })

        await connectDb()
        let resultArr = []
        if (type == "account") {
            const metaDatas = await MetaData.find({})
            // find in userName | return user meta data
            for (let MetaData of metaDatas) {
                if (MetaData.userName.toLowerCase().includes(searchedQuery.toLowerCase())) {
                    resultArr.push({
                        userName: MetaData.userName,
                        pic: MetaData.pic,
                        fullName: MetaData.fullName,
                    })
                }
            }
            return NextResponse.json({ success: true, result: resultArr, type: type })
        } else if (type == "post") {
            // find in title | return title and uid of post
            const rawAllPosts = await Post.find({})
            const allPosts = []
            for (let rawPost of rawAllPosts) {
                if (rawPost.posts.length !== 0) {
                    allPosts.push(rawPost.posts)
                }
            }
            const finalAllPosts = allPosts.flat(Infinity)
            for (let finalPost of finalAllPosts) {
                if (finalPost.title.toLowerCase().includes(searchedQuery.toLowerCase())) {
                    resultArr.push({ title: finalPost.title, uid: finalPost.uid })
                }
            }
            return NextResponse.json({ success: true, result: resultArr, type: type })
        } else {
            return NextResponse.json({ success: false, message: "Unknown type" })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something Went Wrong" })
    }
}