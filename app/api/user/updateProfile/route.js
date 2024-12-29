import { validateJWT } from "@/func/generate_token";
import { MetaData } from "@/lib/model/MetaData"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { changes, newUserData, id } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
        await connectDb()
        // Here I am finding changes then updating the value from newUserData
        const update = await MetaData.findOneAndUpdate(
            { userName: newUserData.userName },
            {
                "$set": changes.reduce((acc, key) => {
                    if (newUserData.hasOwnProperty(key)) {
                        acc[key] = newUserData[key];
                    }
                    return acc;
                }, {})
            }
        );
        if (!update) return NextResponse.json({ success: false, message: "Found any problem" })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}