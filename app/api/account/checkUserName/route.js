import { User } from "@/lib/model/User"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"


export async function POST(params) {
    try {
        const { userName } = await params.json()
        await connectDb()
        const checkUser = await User.findOne({ userName: userName })
        if (checkUser) return NextResponse.json({ success: false })
        else return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}