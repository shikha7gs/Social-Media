import { sendEmail } from "@/func/sendMail"
import { Otp } from "@/lib/model/Otp";
import { User } from "@/lib/model/User"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const { emailOrUserName } = await req.json()
        await connectDb()
        const checkExistance = await User.findOne({
            $or: [
                { email: emailOrUserName },
                { userName: emailOrUserName }
            ]
        });
        if (!checkExistance) return NextResponse.json({ success: false, message: "User not found" })
        const uuid = uuidv4()
        const otp = Math.floor(100000 + Math.random() * 900000);
        const newOtp=new Otp({
            otp:otp,
            uuid:uuid
        })
        newOtp.save()
        await sendEmail({ receiver: checkExistance.email, subject: "Otp for Social Media", text: `Hey ${checkExistance.fullName},\nRecently we got request for forget password from your gmail.\nYour OTP: ${otp}, It will be valid for 5 minutes only` })
        return NextResponse.json({ success: true, uuid: uuid })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong, ty again" })
    }
}