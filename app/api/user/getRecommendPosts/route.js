import { generateToken, validateJWT } from "@/func/generate_token";
import { MetaData } from "@/lib/model/MetaData"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"
import fetch from 'node-fetch';

const getCategoryFunc = async (likePosts) => {
    const { token, id } = await generateToken()
    const getCategoryReq = await fetch("http://localhost:3000/api/user/getRecommendPosts/getCategoriesOfPosts", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ likePosts: likePosts, id })
    })
    const getCategoryRes = await getCategoryReq.json()
    if (getCategoryRes.success) {
        return getCategoryRes.categories
    }
    throw new Error("Something Went Wrong");
}

const postsOfSameCategoriesOfFollowings = async (categories, followings) => {
    const { token, id } = await generateToken()
    const postsOfSameCategoriesOfFollowingsReq = await fetch("http://localhost:3000/api/user/getRecommendPosts/getPostsOfSameCategories", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ categories, followings, id })
    })
    const postsOfSameCategoriesOfFollowingsRes = await postsOfSameCategoriesOfFollowingsReq.json()
    if (postsOfSameCategoriesOfFollowingsRes.success) {
        return postsOfSameCategoriesOfFollowingsRes.posts
    } else {
        throw new Error("Something went wrong");
    }
}

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { userName, id } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })
        // Get metadata of user
        await connectDb()
        const metaData = await MetaData.findOne({ userName: userName })
        if (!metaData) return NextResponse.json({ success: false, message: "You neeed to login and make a profile" })
        const followings = metaData.followings;
        const likePosts = metaData.likePosts;

        // Get category of the posts in an object
        const getCategories = await getCategoryFunc(likePosts)// It will return like - {category1:5} , means 5 posts belongs from category1

        // Get posts Of Same Categories Of Followings
        const getPostsOfSameCategories = await postsOfSameCategoriesOfFollowings(getCategories, followings)

        return NextResponse.json({ success: true, Posts: getPostsOfSameCategories })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}