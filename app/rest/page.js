"use client"
import React from 'react'
import { useToast } from "@/hooks/use-toast"

const page = () => {
    const { toast } = useToast()
    return (
        <div className='flex flex-col justify-center items-center min-h-screen'>
            <div>
                <img src='/lazy.webp' />
            </div>
            <div>
            A place where you are sent to rest for some time..
            </div>
        </div>
    )
}

export default page