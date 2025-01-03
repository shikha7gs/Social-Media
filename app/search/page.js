"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import { generateToken } from '@/func/generate_token'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter()
    const { toast } = useToast()
    const [searchDetails, setSearchDetails] = useState({ type: "", searchedQuery: "" })
    const [result, setResult] = useState({})
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (searchDetails && searchDetails?.type?.length !== 0 && searchDetails?.searchedQuery?.length !== 0) {
            const { token, id } = await generateToken()
            const req = await fetch("/api/other/search", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type: searchDetails.type, searchedQuery: searchDetails.searchedQuery, id })
            })
            const res = await req.json()
            if (res.success) {
                setResult({ array: res.result, type: res.type })
            } else {
                toast({
                    description: `❌ ${res.message}`,
                })
            }
        } else {
            toast({
                description: `❌ All fields are madetory`,
            })
        }
    }

    useEffect(() => {
        (async () => {
            const req1 = await fetch("/api/account/checkAuthenticate", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify()
            })
            const res1 = await req1.json()
            if (!res1.authenticated) {
                router.push("/account/signup")
            }
        })()
    }, [])
    return (
        <div className='flex flex-col items-center min-h-screen gap-5'>
            <h1 className='text-2xl font-bold'>Search</h1>
            <form className='flex w-full border-b gap-3'>
                <Select value={searchDetails.type} onValueChange={(value) => setSearchDetails((prev) => ({ ...prev, type: value }))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            <SelectItem value="account">Account</SelectItem>
                            <SelectItem value="post">Post</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input value={searchDetails.searchedQuery} onChange={(e) => setSearchDetails((prev) => ({ ...prev, searchedQuery: e.target.value }))} placeholder="Search here" />
                <Button variant="outline" onClick={handleSubmit}><Search /></Button>
            </form>
            {/*If result is in its first value which is blank object*/}
            {Object.keys(result).length != 0 &&
                <>
                    {/*If After finding we get no resultArr so not found or else do*/}
                    {result.array.length == 0 ? (<>Not Found</>) : (<>{result.type == "account" ? (<>
                        {result.array.map((item) => { // For account
                            return (
                                <div className="w-[90%] gap-3 h-10 rounded-xl border flex" key={item.userName}>
                                    <div className='h-10 w-10 rounded-full border'>
                                        <img src={item.pic} className='h-full w-full rounded-full' alt='User Logo' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <Link href={`/profile/${item.userName}`} className='font-bold'>{item.userName}</Link>
                                        <h4 className='text-xs' >{item.fullName}</h4>
                                    </div>
                                </div>
                            )
                        })}
                    </>) : (<>
                        {result.array.map((item) => { // For post
                            return (
                                <Link href={`/post/${item.uid}`} className='w-[90%] border p-1 rounded-xl font-bold' key={item.uid}>{item.title}</Link>
                            )
                        })}
                    </>)}</>)}
                </>}
        </div>
    )
}

export default page