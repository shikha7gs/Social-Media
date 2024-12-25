"use client"
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"

const page = () => {
    const { toast } = useToast()
    useEffect(() => {
        (async () => {
            const req1 = await fetch("/api/account/checkSession", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify()
            })
            const res1 = await req1.json()
            if (res1.success) console.log("authenticated")
            else if (res1.redirect) {
                toast({ description: `❌ ${res1.message}` });
                redirect("/rest")
            }
            else {
                toast({ description: `❌ ${res1.message}` })
                redirect("/account/login")
            }
        })()
    }, [])
    return (
        <div>
            user will land here after log in
        </div>
    )
}

export default page