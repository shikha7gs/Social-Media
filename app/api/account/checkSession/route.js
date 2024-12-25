import { Session } from "@/lib/model/Session";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const sessionId = req.cookies.get('sessionId');
        if (!sessionId) return NextResponse.json({ success: false, message: "Not authenticated" })
        const findSession = await Session.findOne({ sessionId: sessionId.value })
        if (!findSession) {
            const response = NextResponse.json({ success: false, message: "Not authenticated" });
            response.cookies.set('sessionId', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 0,
                path: '/',
            });
            return response;
        }
        const ipAddress = req.headers.get("x-forwarded-for") || req.connection.remoteAddress || "Unknown IP";
        const userAgent = req.headers.get("user-agent") || "Unknown User Agent";
        if (ipAddress != findSession.ipAddress || userAgent != findSession.userAgent) {
            const response = NextResponse.json({ success: false, message: "Could not authenticate, found something wrong." })
            response.cookies.set('sessionId', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 0,
                path: '/',
            });
            return response;
        }
        if (new Date() > findSession.expiresAt) {
            const response = NextResponse.json({ success: false, message: 'Session expired' })
            response.cookies.set('sessionId', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 0,
                path: '/',
            });
            return response;
        }
        return NextResponse.json({ success: true, userDetails: findSession })
    } catch (error) {
        const response = NextResponse.json({ success: false, message: "Something went wrong" })
        response.cookies.set('sessionId', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 0,
            path: '/',
        });
        return response;
    }
}