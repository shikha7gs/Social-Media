import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const sessionId = req.cookies.get('sessionId');
        if (!sessionId) return NextResponse.json({ success: true, authenticated: false })
        return NextResponse.json({ success: true, authenticated: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}