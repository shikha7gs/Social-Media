import { User } from "@/lib/model/User";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Session } from "@/lib/model/Session";

export async function POST(req) {
    try {
        const { emailOrUsername, password } = await req.json();
        await connectDb();

        const findUser = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { userName: emailOrUsername }
            ]
        });
        if (!findUser) {
            return NextResponse.json({ success: false, message: "Incorrect details" });
        }

        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: "Incorrect details" });
        }

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

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" });
    }
}
