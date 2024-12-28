import { validateJWT } from "@/func/generate_token";
import { sendEmail } from "@/func/sendMail"
import { Otp } from "@/lib/model/Otp";
import { User } from "@/lib/model/User"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "login");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try again after 5 minutes"});
        const { emailOrUserName ,id} = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken =await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
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
        const newOtp = new Otp({
            otp: otp,
            uuid: uuid
        })
        newOtp.save()
        await sendEmail({ receiver: checkExistance.email, subject: "Otp for Social Media", text: `Hey ${checkExistance.fullName},\nRecently we got request for forget password from your gmail.\nYour OTP: ${otp}, It will be valid for 5 minutes only` })
        return NextResponse.json({ success: true, uuid: uuid })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong, ty again" })
    }
}