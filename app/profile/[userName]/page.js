"use client"
import { generateToken } from '@/func/generate_token'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { EllipsisVertical, Link2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const page = ({ params }) => {
    const [metaData, setMetaData] = useState()
    const [viewerData, setViewerData] = useState()
    const { toast } = useToast();
    const [posts, setPosts] = useState({})
    useEffect(() => {
        const getProfileDetails = async () => {
            const userName = (await params).userName;
            const { token, id } = await generateToken()
            const req = await fetch("/api/other/getProfileDetails", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userName, id })
            })
            const res = await req.json()
            if (res.success) {
                setMetaData(res.metaData)
                setPosts(res.post)
            } else {
                alert(res.message)
            }
        }
        const getViewetData = async () => {
            const req = await fetch("/api/account/checkSession", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify()
            })
            const res = await req.json()
            if (res.success) {
                setViewerData({ logged: true, userName: res?.userDetails?.userName })
            } else {
                setViewerData({ logged: false })
            }
            getProfileDetails()
        }
        getViewetData()
    }, [])

    const handleFollowAndUnfollow = async () => {
        if (viewerData) {
            if (!viewerData.logged) {
                alert("Firstly signup")
                return
            }
            if (metaData.userName == viewerData.userName) {
                alert("couldn't follow to ourself")
            }
            const alreadyFollowed = metaData.followers.includes(viewerData.userName)
            const { token, id } = await generateToken()
            const req = await fetch("/api/other/followOrUnfollow", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ To: metaData.userName, From: viewerData.userName, alreadyFollowed, id })
            })
            const res = await req.json()
            if (res.success) {
                window.location.reload()
            } else {
                alert(res.message)
            }
        }
    }
    return (
        <div>
            <div className='h-screen flex flex-col items-center'>
                <div className=' w-full h-[30%] flex items-center'>
                    <div className='icon h-40 w-40 bg-black absolute ml-20 rounded-full z-40'>
                        <img src={metaData?.pic || "NA"} alt="User Photo" className='h-full w-full rounded-full' />
                    </div>
                    <div className='banner w-full h-full bg-blue-700'>
                        <img src={metaData?.banner || "NA"} alt='Banner' className='w-full h-full' />
                    </div>
                </div>
                <div className=' w-full h-[17%]'>
                    <ul className='m-6'>
                        <li className='text-xl'>Name:<strong>&nbsp;{metaData?.fullName || "NA"}</strong></li>
                        <li className='text-xl'>Profession:<strong>&nbsp;{metaData?.profession || "NA"}</strong></li>
                        <li className='text-xl'>Description:<strong>&nbsp;{metaData?.description || "NA"}</strong></li>
                    </ul>
                </div>
                <Button varient="outline" onClick={handleFollowAndUnfollow}>{(metaData && (metaData.followers?.includes(viewerData.userName) ? "Unfollow" : "Follow")) || ""}</Button>

                <div className=' w-full h-[5%]'>
                    <ul className='flex gap-6 items-center w-full h-full ml-6'>
                        <Link href=""><strong>{metaData?.followers?.length || "0"}</strong>&nbsp;Followers</Link>
                        <Link href=""><strong>{metaData?.followings?.length || "0"}</strong>&nbsp;Following</Link>
                    </ul>
                </div>
                <div className='w-full border-t flex flex-wrap justify-center mt-1'>
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
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        )
                    })) : <p className='m-2'>No post was created</p>}
                </div>
            </div>
        </div>
    )
}

export default page