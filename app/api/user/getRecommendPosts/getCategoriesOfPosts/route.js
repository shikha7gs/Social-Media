import { validateJWT } from "@/func/generate_token";
import { Post } from "@/lib/model/Post"
import connectDb from "@/lib/mongoose"
import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const isAllowed = await rateLimit(req, "checkSession");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, try after 5 minutes" });
        const { likePosts, id } = await req.json()
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })

        await connectDb()
        const allPosts = await Post.find({})
        const categoriesArr = allPosts.flatMap(post =>
            post.posts
                .filter(item => likePosts.includes(item.uid))
                .map(item => item.category)
        );
        //ai_ml:5,dev:15
        let categories = {}
        //Checking wether the category exists or not
        categoriesArr.map((i) => {
            // If exists , Increase value by 1
            if (categories.hasOwnProperty(i)) {
                categories[i] += 1;
            } else {
                // If new, Create one key with value 1
                categories[i] = 1
            }
        })
        // Target: Not same but similar categories.
        const commonCategories = [
            [
                "gadgets",
                "software",
                "ai_ml",
                "cybersecurity",
                "programming",
                "gaming"
            ],
            [
                "health_fitness",
                "travel",
                "personal_development",
                "home_living",
                "food_drink",
                "fashion_beauty",
                "relationships",
                "parenting"
            ],
            [
                "entrepreneurship",
                "investing",
                "personal_finance",
                "marketing",
                "real_estate",
                "productivity"
            ],
            [
                "study_tips",
                "online_learning",
                "career_advice",
                "teaching",
                "language_learning",
                "college_university"
            ],
            [
                "movies_tv",
                "music",
                "celebrity",
                "pop_culture",
                "events_festivals",
                "theater"
            ],
            [
                "recipes",
                "cooking_tips",
                "food_reviews",
                "baking",
                "vegan",
                "food_trends"
            ],
            [
                "space_astronomy",
                "climate_change",
                "physics_chemistry",
                "biology",
                "medical_research"
            ],
            [
                "art_design",
                "photography",
                "writing_literature",
                "crafts_diy",
                "film_media",
                "music_composition"
            ]
        ];
        let finalArr = []
        Object.keys(categories).forEach((category) => {
            finalArr.push(...commonCategories.filter(item => item.includes(category)));
        });
        return NextResponse.json({ success: true, categories: finalArr.flat(Infinity) })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}