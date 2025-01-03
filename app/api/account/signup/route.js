import { validateJWT } from "@/func/generate_token";
import { User } from "@/lib/model/User"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"


function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}


export async function POST(params) {
    try {
        const isAllowed = await rateLimit(params, "signup");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Attempt is over, Try 5 minutes later" });
        const { email, password, fullName, userName, id } = await params.json()
        const token = params.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken =await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })

        if (
            !userName.includes(" ") &&
            userName.length >= 8 &&
            userName.length <= 20 &&
            /^[a-zA-Z0-9.]+$/.test(userName) &&
            isValidEmail(email) &&
            password.length >= 8 &&
            password.length <= 30 &&
            fullName.length >= 5 &&
            fullName.length <= 30
        );
        else {
            return NextResponse.json({ success: false, message: "any rule is avoided" })
        }
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
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}