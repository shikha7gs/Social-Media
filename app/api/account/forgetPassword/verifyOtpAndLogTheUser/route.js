import { Otp } from "@/lib/model/Otp"
import { Session } from "@/lib/model/Session";
import { User } from "@/lib/model/User";
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const { emailOrUserName, uuid, otp } = await req.json()
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