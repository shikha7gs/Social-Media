"use client"
import { LogedNavbar } from '@/components/LogedNavbar'
import LogedOutNavbar from '@/components/LogedOutNavbar'
import React, { useEffect, useState } from 'react'

const ClientLayout = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false)
    useEffect(() => {
        const runFetch = async () => {
            const authenticated = await fetch("/api/account/checkAuthenticate", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify()
            })
            const res1 = await authenticated.json()
            setAuthenticated(res1.authenticated)
        }
        runFetch()
    }, [])
    return (
        <main>
            {authenticated ? <LogedNavbar /> : <LogedOutNavbar />}
            {children}
        </main>
    )
}

export default ClientLayout