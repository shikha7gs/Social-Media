"use server"
import { Token } from "@/lib/model/Tokens";
import connectDb from "@/lib/mongoose";
import { v4 as uuidv4 } from "uuid";

function generate(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return token;
}

export async function generateToken() {
    try {
        const userId = uuidv4()
        const token = generate(50)
        await connectDb()
        const check = await Token.findOne({
            $or: [
                { userId: userId },
                { token: token }
            ]
        })
        if (!check) {
            const addToken = new Token({
                userId: userId,
                token: token
            })
            await addToken.save()
            return { success: true, userId: userId,token:token }
        } else {
            await generateToken()
        }
    } catch (error) {
        return {success:false,message:error.message}
    }
}