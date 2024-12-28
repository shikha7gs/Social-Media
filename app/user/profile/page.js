"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateToken } from '@/func/generate_token';

const page = () => {
    const isEffectExecuted = useRef(false);
    const { toast } = useToast();
    const [posts, setPosts] = useState([])
    const [userData, setUserData] = useState({})
    const router = useRouter();

    useEffect(() => {
        if (isEffectExecuted.current) return;
        isEffectExecuted.current = true;

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
                    console.log(sessionResult.userDetails);
                    const { token, id } = await generateToken()
                    const userDetailsResponse = await fetch("/api/account/fetchUserDetails", {
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
                        setPosts(userDetailsResult?.posts?.posts)
                        setUserData(userDetailsResult?.data)
                        console.log(userDetailsResult);
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
    }, [router]);


    return (
        <div className='h-screen flex flex-col items-center'>
            <div className=' w-full h-[30%] flex items-center'>
                <div className='icon h-40 w-40 bg-black absolute ml-20 rounded-full z-50'>
                    <img src={userData?.pic || "NA"} alt="User Photo" className='h-full w-full rounded-full' />
                </div>
                <div className='banner w-full h-full bg-blue-700'>
                    <img src={userData?.banner || "NA"} alt='Banner' className='w-full h-full' />
                </div>
            </div>
            <div className=' w-full h-[17%]'>
                <ul className='m-6'>
                    <li className='text-xl'>Name:<strong>&nbsp;{userData?.fullName || "NA"}</strong></li>
                    <li className='text-xl'>Profession:<strong>&nbsp;{userData?.profession || "NA"}</strong></li>
                    <li className='text-xl'>Description:<strong>&nbsp;{userData?.description || "NA"}</strong></li>
                </ul>
            </div>
            <div className=' w-full h-[5%]'>
                <ul className='flex gap-6 items-center w-full h-full ml-6'>
                    <Link href=""><strong>{userData?.followers?.length || "0"}</strong>&nbsp;Followers</Link>
                    <Link href=""><strong>{userData?.followings?.length || "0"}</strong>&nbsp;Following</Link>
                    <Link className='hover:bg-gray-100 p-1 border rounded-lg' href="/user/profile/modify">Modify</Link>
                </ul>
            </div>
            <div className='w-full border-t flex flex-wrap justify-center mt-1'>
                {posts.length > 0 ? (posts.map((item) => {
                    return (
                        <div key={item.id} className='border h-32 w-96 my-5 mx-20 rounded-lg flex justify-center items-center'>
                            <h1>{item.title}</h1>
                        </div>
                    )
                })) : "No post was created"}
            </div>
        </div>
    );
};


export default page