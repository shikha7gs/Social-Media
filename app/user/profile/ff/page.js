"use client"
import { generateToken } from "@/func/generate_token";
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";

const page = () => {
    const [userData, setUserData] = useState()
    const { toast } = useToast()
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
        checkSessionAndFetchUserDetails()
    }, [])

    const handleUnfollow = async (To, action) => {
        const { token, id } = await generateToken()
        const request = await fetch("/api/other/unfollowOrRemove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action, To, from: userData.userName, id }),
        });
        const response = await request.json()
        if (response.success) {
            window.location.reload()
        } else {
            toast({ description: `❌ ${response.message}` });
        }
    }
    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full gap-16">
            <div className="text-2xl font-bold">Followers and Followings</div>
            <Tabs defaultValue="followers" className="w-full">
                <TabsList>
                    <TabsTrigger value="followers">Followers</TabsTrigger>
                    <TabsTrigger value="followings">Followings</TabsTrigger>
                </TabsList>
                <TabsContent value="followers">
                    <Table>
                        <TableCaption>A list of your followers.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className=""></TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead></TableHead>
                                <TableHead className="text-center">Button</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userData && userData?.followers?.map((account, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium"></TableCell>
                                        <TableCell>{account}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className="text-center">
                                            <Button onClick={() => { handleUnfollow(account, "remove") }} variant="outline">Remove</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="followings">
                    <Table>
                        <TableCaption>A list of your followings.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className=""></TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead></TableHead>
                                <TableHead className="text-center">Button</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userData && userData?.followings?.map((account, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="text-xl"></TableCell>
                                        <TableCell>{account}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className="text-center">
                                            <Button onClick={() => { handleUnfollow(account, "unfollow") }} variant="outline">Unfollow</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div >

    )
}

export default page