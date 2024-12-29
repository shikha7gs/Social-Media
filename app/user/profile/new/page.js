"use client"
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { generateToken } from '@/func/generate_token';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';


const page = () => {
    const [description, setDescription] = useState("**Hello world!!!**");
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [userName, setUserName] = useState("")
    const { toast } = useToast()
    const [error, setError] = useState(false)
    const router = useRouter()
    useEffect(() => {
        const checkSessionAndFetchUserDetails = async () => {
            try {
                const sessionResponse = await fetch("/api/account/checkSession", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(),
                });
                const sessionResult = await sessionResponse.json();

                if (sessionResult.success) {
                    const { token, id } = await generateToken()
                    const userDetailsResponse = await fetch("/api/user/fetchUserDetails", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ userName: sessionResult?.userDetails?.userName, id }),
                    });
                    const userDetailsResult = await userDetailsResponse.json();
                    if (userDetailsResult.success) {
                        if (userDetailsResult.reload) {
                            window.location.reload()
                            return
                        }
                        setUserName(userDetailsResult?.data?.userName)
                        return
                    } else {
                        toast({ description: `❌ ${userDetailsResult.message}` });
                    }
                } else if (sessionResult.redirect) {
                    toast({ description: `❌ ${sessionResult.message}` });
                    router.push("/rest");
                } else {
                    toast({ description: `❌ ${sessionResult.message}` });
                    router.push("/account/login");
                }
            } catch (error) {
                console.error("An error occurred during the session check:", error);
                toast({ description: `❌ An unexpected error occurred.` });
            }
        };
        checkSessionAndFetchUserDetails();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { token, id } = await generateToken()
        const req = await fetch("/api/user/newPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, category, id, userName }),
        });
        const res = await req.json()
        if (res.success) {
            toast({ description: `✅ published` });
            router.push("/user/profile")
        } else {
            toast({ description: `❌ ${res.message}` });
        }
    }

    useEffect(() => {
        if (title.length > 10 && description.length > 100 && category.length !== 0 && userName.length !== 0) {
            setError(false)
        } else {
            setError(true)
        }
    }, [title, description, category, userName])
    return (
        <div className='flex flex-col justify-center items-center gap-6 min-h-screen'>
            <h1 className='text-2xl font-bold'>New Post</h1>
            <form className='flex flex-col gap-9 w-1/2'>
                <Input value={title} onChange={(e) => { setTitle(e.target.value) }} placeholder="Title" />
                <Select value={category} onValueChange={(e) => { setCategory(e) }}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Tech</SelectLabel>
                            <SelectItem value="gadgets">Gadgets & Devices</SelectItem>
                            <SelectItem value="software">Software & Apps</SelectItem>
                            <SelectItem value="ai_ml">Artificial Intelligence & Machine Learning</SelectItem>
                            <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                            <SelectItem value="programming">Programming & Development</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Lifestyle</SelectLabel>
                            <SelectItem value="health_fitness">Health & Fitness</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="personal_development">Personal Development</SelectItem>
                            <SelectItem value="home_living">Home & Living</SelectItem>
                            <SelectItem value="food_drink">Food & Drink</SelectItem>
                            <SelectItem value="fashion_beauty">Fashion & Beauty</SelectItem>
                            <SelectItem value="relationships">Relationships</SelectItem>
                            <SelectItem value="parenting">Parenting</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Business & Finance</SelectLabel>
                            <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                            <SelectItem value="investing">Investing & Stocks</SelectItem>
                            <SelectItem value="personal_finance">Personal Finance</SelectItem>
                            <SelectItem value="marketing">Marketing & Branding</SelectItem>
                            <SelectItem value="real_estate">Real Estate</SelectItem>
                            <SelectItem value="productivity">Productivity & Time Management</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Education & Learning</SelectLabel>
                            <SelectItem value="study_tips">Study Tips & Techniques</SelectItem>
                            <SelectItem value="online_learning">Online Learning</SelectItem>
                            <SelectItem value="career_advice">Career Advice</SelectItem>
                            <SelectItem value="teaching">Teaching & Education</SelectItem>
                            <SelectItem value="language_learning">Language Learning</SelectItem>
                            <SelectItem value="college_university">College & University</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Entertainment</SelectLabel>
                            <SelectItem value="movies_tv">Movies & TV Shows</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="celebrity">Celebrity Gossip</SelectItem>
                            <SelectItem value="pop_culture">Pop Culture</SelectItem>
                            <SelectItem value="events_festivals">Events & Festivals</SelectItem>
                            <SelectItem value="theater">Theater & Performing Arts</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Food</SelectLabel>
                            <SelectItem value="recipes">Recipes</SelectItem>
                            <SelectItem value="cooking_tips">Cooking Tips & Techniques</SelectItem>
                            <SelectItem value="food_reviews">Food Reviews</SelectItem>
                            <SelectItem value="baking">Baking</SelectItem>
                            <SelectItem value="vegan">Vegan & Vegetarian</SelectItem>
                            <SelectItem value="food_trends">Food Trends</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Science</SelectLabel>
                            <SelectItem value="space_astronomy">Space & Astronomy</SelectItem>
                            <SelectItem value="climate_change">Environment & Climate Change</SelectItem>
                            <SelectItem value="physics_chemistry">Physics & Chemistry</SelectItem>
                            <SelectItem value="biology">Biology & Genetics</SelectItem>
                            <SelectItem value="medical_research">Medical Research</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Creative Arts</SelectLabel>
                            <SelectItem value="art_design">Art & Design</SelectItem>
                            <SelectItem value="photography">Photography</SelectItem>
                            <SelectItem value="writing_literature">Writing & Literature</SelectItem>
                            <SelectItem value="crafts_diy">Crafts & DIY</SelectItem>
                            <SelectItem value="film_media">Film & Media</SelectItem>
                            <SelectItem value="music_composition">Music Composition</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <MDEditor
                    value={description}
                    onChange={setDescription}
                />
                <Button disabled={error} onClick={handleSubmit} varient="outline">Publish</Button>
            </form>
        </div>
    )
}

export default page