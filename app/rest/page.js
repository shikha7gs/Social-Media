"use client"
import React from 'react'
import { useToast } from "@/hooks/use-toast"

const page = () => {
    const { toast } = useToast()
    return (
        <div>A place where you are sent to rest for some time..</div>
    )
}

export default page