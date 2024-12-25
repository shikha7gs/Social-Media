import { User } from "@/lib/model/User"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"

export async function POST(params) {
    try {
        const { email, password, fullName, userName } = await params.json()
        await connectDb()
        const checkUser = await User.findOne({ email: email })
        if (checkUser) return NextResponse.json({ success: false, message: "Account with same email id exists" })
        const newUser = new User({
            email,
            password,
            fullName,
            userName
        })
        await newUser.save()
        //console.log(email, password, fullName, userName)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}