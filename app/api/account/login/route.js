import { User } from "@/lib/model/User"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function POST(params) {
    try {
        const { emailOrUsername, password } = await params.json()
        await connectDb()
        const findUser = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { userName: emailOrUsername }
            ]
        });
        if (!findUser) return NextResponse.json({ success: false, message: "Incorrect details" })
        const getPass = await bcrypt.compare(password, findUser.password);
        if (!getPass) return NextResponse.json({ success: false, message: "Incorrect details" })
        console.log(emailOrUsername, password)
        return NextResponse.json({ success: true, username: "giuyguuyg", message: "User logged in" })
    } catch (error) {
        //console.log(error.message)
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}