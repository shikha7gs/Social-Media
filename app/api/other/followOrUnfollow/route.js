import { validateJWT } from "@/func/generate_token";
import { MetaData } from "@/lib/model/MetaData"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"


export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { id, To, From, alreadyFollowed } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
        await connectDb()
        if (!alreadyFollowed) {
            // add follower in to
            console.log("Followed to", To, "By", From)
            const getMetaData = await MetaData.findOne({ userName: To })
            getMetaData.followers.push(From)
            await getMetaData.save()
            // add following in from 
            const getMetaDataFrom = await MetaData.findOne({ userName: From })
            getMetaDataFrom.followings.push(To)
            await getMetaDataFrom.save()
            return NextResponse.json({ success: true })
        } else {
            // Unfollow
            // remove follower in to
            const getMetaData = await MetaData.findOne({ userName: To })
            getMetaData.followers = getMetaData.followers.filter(follower => follower !== From)
            getMetaData.save()
            // remove following in to
            const getMetaDataFrom = await MetaData.findOne({ userName: From })
            getMetaDataFrom.followings = getMetaDataFrom.followings.filter(following => following !== To)
            getMetaDataFrom.save()
            console.log("Unfollowed to", To, "By", From)
            return NextResponse.json({ success: true })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}