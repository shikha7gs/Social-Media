"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const page = () => {
    const [userData, setUserData] = useState({})
    const [newUserData, setNewUserData] = useState({})
    const { toast } = useToast();
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
                    console.log(sessionResult.userDetails);

                    const userDetailsResponse = await fetch("/api/account/fetchUserDetails", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userName: sessionResult?.userDetails?.userName }),
                    });
                    const userDetailsResult = await userDetailsResponse.json();
                    if (userDetailsResult.success) {
                        if (userDetailsResult.reload) {
                            window.location.reload()
                            return
                        }
                        setUserData(userDetailsResult?.data)
                        setNewUserData(userDetailsResult?.data)
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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newUserData == userData) {
            alert("no changes made")
            return
        }
        let changes = [];
        for (let key in newUserData) {
            if (newUserData[key] !== userData[key]) {
                changes.push(key);
            }
        }
        const req = await fetch("/api/account/updateProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ changes, newUserData }),
        })
        const res=await req.json()
        if(res.success){
            toast({ description: `✅ Changed` });
            router.push("/user/profile")
        }else{
            toast({ description: `❌ ${res.message}` });
        }
    }
    return (
        <div className='h-screen max-w-screen flex justify-center items-center'>
            <form className='w-5/6 h-1/2 border flex flex-col justify-center items-center gap-5'>
                <div className=' w-full h-[30%] flex items-center'>
                    <div className='icon border h-20 w-20 bg-black absolute left-[47%] rounded-full z-50 group'>
                        <img
                            src={newUserData?.pic || "NA"}
                            alt="User Photo"
                            className='h-full w-full rounded-full transition-opacity duration-300 group-hover:opacity-40'
                        />
                        <Dialog >
                            <DialogTrigger asChild>
                                <Button className='absolute m-5 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold w-1/2'>Edit</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Pic then click at cross</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="link" className="text-right">
                                            Link
                                        </Label>
                                        <Input id="link" placeholder="Link" value={newUserData?.pic} className="col-span-3" onChange={(e) => setNewUserData({ ...newUserData, pic: e.target.value })} />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className='banner w-full h-full bg-black relative group'>
                        <img
                            src={newUserData?.banner || "NA"}
                            alt='Banner'
                            className='w-full h-full transition-opacity duration-300 group-hover:opacity-70'
                        />
                        <Dialog >
                            <DialogTrigger asChild>
                                <Button className='absolute top-4 right-4 px-4 py-2 text-white font-bold rounded  opacity-0 group-hover:opacity-100 transition-opacity duration-300'>Edit</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Banner then click at cross</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="link" className="text-right">
                                            Link
                                        </Label>
                                        <Input id="link" placeholder="Link" value={newUserData?.banner} className="col-span-3" onChange={(e) => setNewUserData({ ...newUserData, banner: e.target.value })} />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                </div>
                <Input value={newUserData?.fullName || ""} placeholder="Name" onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })} />
                <Input value={newUserData?.profession || ""} onChange={(e) => { setNewUserData({ ...newUserData, profession: e.target.value }) }} placeholder="Profession" />
                <Input value={newUserData?.description || ""} onChange={(e) => { setNewUserData({ ...newUserData, description: e.target.value }) }} placeholder="Description" />
                <Button variant="outline" onClick={handleSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default page