import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkAuthenticate");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes"});
        const sessionId = req.cookies.get('sessionId');
        if (!sessionId) return NextResponse.json({ success: true, authenticated: false })
        return NextResponse.json({ success: true, authenticated: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}