import { validateJWT } from "@/func/generate_token";
import { Post } from "@/lib/model/Post"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

async function categorizePosts(categories, followings) {
    const followingPost = [];
    const restPost = [];

    const fetchAndCategorizePosts = async () => {
        const postArr = await Post.find({});
        postArr.forEach((post) => {
            const targetArray = followings.includes(post.userName) ? followingPost : restPost;
            post.posts.forEach((item) => targetArray.push(item));
            // If viewer has userName? drop it or else no...
        });
    };

    await Promise.all(
        Object.keys(categories).map(() => fetchAndCategorizePosts())
    );

    return { followingPost, restPost };
}

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { categories, followings, id } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })

        await connectDb()
        // Task: Find same categories post in every followings account then same categories in rest accounts
        const ans = await categorizePosts(categories, followings)
        const combinedArray = [...ans.followingPost, ...ans.restPost];
        let selectedPosts = []
        combinedArray.map((i)=>{
            selectedPosts.push(i.uid)
        })
        return NextResponse.json({ success: true, posts: selectedPosts })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}