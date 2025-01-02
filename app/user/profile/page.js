"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateToken } from '@/func/generate_token';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Link2Icon, Trash } from 'lucide-react';

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
                        setPosts(userDetailsResult?.posts?.posts)
                        setUserData(userDetailsResult?.data)
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

    const deletePost = async (uid) => {
        const { token, id } = await generateToken()
        const req = await fetch("/api/user/deletePost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ uid: uid, id, userName: userData.userName }),
        });
        const res = await req.json()
        if (res.success) {
            window.location.reload()
        } else {
            toast({ description: `❌ ${res.message}` });
        }
    }


    return (
        <div className='h-screen flex flex-col items-center'>
            <div className=' w-full h-[30%] flex items-center'>
                <div className='icon h-40 w-40 bg-black absolute ml-20 rounded-full z-40'>
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
                    <Link href="/user/profile/ff"><strong>{userData?.followers?.length || "0"}</strong>&nbsp;Followers</Link>
                    <Link href="/user/profile/ff"><strong>{userData?.followings?.length || "0"}</strong>&nbsp;Following</Link>
                    <Link className='hover:bg-gray-100 p-1 border rounded-lg' href="/user/profile/modify">Modify</Link>
                </ul>
            </div>
            <div className='w-full border-t flex flex-wrap justify-center mt-1 relative'>
                <Link href={"/user/profile/new"} className="absolute right-5 top-2 border  rounded-lg h-7 w-7 text-center">+</Link>
                {posts.length > 0 ? (posts.map((item) => {
                    return (
                        <div key={item.uid} className='border h-32 w-96 my-5 mx-20 rounded-lg flex flex-col justify-center overflow-x-auto items-center gap-5 relative'>
                            <Link href={`http://localhost:3000/post/${item.uid}`} className='font-bold text-lg px-8'>{item.title}</Link>
                            <div>{item.category}</div>
                            <div className='absolute top-0 right-0'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(`localhost:3000/post/${item.uid}`); toast({ description: `✅ Copied` }); }}>Save Link<Link2Icon /></DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { deletePost(item.uid) }}>Delete<Trash /></DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )
                })) : <p className='m-2'>No post was created</p>}
            </div>
        </div>
    );
};


export default page