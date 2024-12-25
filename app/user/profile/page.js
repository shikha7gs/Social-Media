"use client"
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
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
            if (res1.success) alert("User is authenticated")
            else {
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