import { MetaData } from "@/lib/model/MetaData"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes"});
        const { changes, newUserData } = await req.json()
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