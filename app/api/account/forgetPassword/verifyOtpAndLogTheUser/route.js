import { validateJWT } from "@/func/generate_token";
import { Otp } from "@/lib/model/Otp"
import { Session } from "@/lib/model/Session";
import { User } from "@/lib/model/User";
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "login");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try again after 5 minutes" });
        const { emailOrUserName, uuid, otp, id } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
        await connectDb()
        const verifyOtp = await Otp.findOne({ uuid: uuid })
        if (!verifyOtp) return NextResponse.json({ success: false, message: "Otp is expired, try again" })
        if (otp != verifyOtp.otp) return NextResponse.json({ success: false, message: "Wrong otp entered" })
        await Otp.deleteOne({ uuid: uuid });
        //console.log("verified ", emailOrUserName)
        const findUser = await User.findOne({
            $or: [
                { email: emailOrUserName },
                { userName: emailOrUserName }
            ]
        });
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const ipAddress = req.headers.get("x-forwarded-for") || req.connection.remoteAddress || "Unknown IP";
        const userAgent = req.headers.get("user-agent") || "Unknown User Agent";

        const newSession = new Session({
            sessionId: sessionId,
            userName: findUser.userName,
            expiresAt: expiresAt,
            ipAddress: ipAddress,
            userAgent: userAgent,
        });

        await newSession.save();
        const response = NextResponse.json({ success: true });
        response.cookies.set('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return response
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong , try again" })
    }
}