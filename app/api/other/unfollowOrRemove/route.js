import { validateJWT } from "@/func/generate_token";
import { MetaData } from "@/lib/model/MetaData"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        // from = us, we
        // to = other 
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { id, action, To, from } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
        await connectDb()
        const getMetaData = await MetaData.findOne({ userName: To })
        const getMetaDataFrom = await MetaData.findOne({ userName: from })
        if (action == "unfollow") {
            // Remove `from` from `to` followers
            getMetaData.followers = getMetaData.followers.filter(follower => follower !== from)
            // Remove `to` from `from` followings
            getMetaDataFrom.followings = getMetaDataFrom.followings.filter(following => following !== To)
            getMetaData.save()
            getMetaDataFrom.save()
        } else {
            // Remove `to` from `from` followers
            getMetaDataFrom.followers = getMetaDataFrom.followers.filter(follower => follower !== To)
            // Remove `from` from `to` followings
            getMetaData.followings = getMetaData.followings.filter(following => following !== from)
            getMetaData.save()
            getMetaDataFrom.save()
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}