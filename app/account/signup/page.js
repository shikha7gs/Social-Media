"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const page = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [userName, setUserName] = useState("")
  const [userNameAvailability, setUserNameAvailability] = useState()
  const [error, setError] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email == 0 || password == 0 || fullName == 0 || userName == 0) {
      alert("All fields are madetory!")
      return
    }
    // check usernames frequently
    const req1 = await fetch("/api/account/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName, userName })
    })
    const res1 = await req1.json()
    if (!res1.success) {
      alert(res1.message)
      return
    }
    alert("You are signed up")
    setEmail("")
    setFullName("")
    setPassword("")
    setUserName("")
  }

  useEffect(() => {
    (async () => {
      if (userName.trim().length >= 8) {
        const req1 = await fetch("/api/account/checkUserName", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName })
        })
        const res1 = await req1.json()
        setUserNameAvailability(res1.success)
        if (res1.success) {
          setUserNameAvailability(true)
        } else {
          setUserNameAvailability(false)
        }
      }
    })()
  }, [userName])


  useEffect(() => {
    function isValidEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }
    if (
      userNameAvailability &&
      !userName.includes(" ") &&
      userName.length >= 8 &&
      userName.length <= 20 &&
      /^[a-zA-Z0-9.]+$/.test(userName) &&
      isValidEmail(email) &&
      password.length >= 8 &&
      password.length <= 30 &&
      fullName.length >= 5 &&
      fullName.length <= 30
    ) {
      setError(false)
    } else {
      setError(true)
    }
  }, [userName, email, password, fullName, userNameAvailability])
  
  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
      <div className='flex flex-col w-90 gap-3'>
        <div className='border w-full p-5 flex flex-col justify-center items-center'>
          <div className='flex flex-col justify-center items-center p-6 gap-5'>
            <h1 className='text-3xl font-serif font-bold'>Social Media</h1>
            <div className='flex flex-col text-center'>
              <span className='text-md text-center whitespace-normal'>Sign up to see photos and videos</span>
              <span>
                from your friends.
              </span>
            </div>

          </div>
          <form className='flex flex-col justify-center items-center gap-3'>
            <Input value={email} onChange={(e) => { setEmail(e.target.value) }} type='text' placeholder='Email' />
            <Input value={password} onChange={(e) => { setPassword(e.target.value) }} type='password' placeholder='Password' />
            <Input value={fullName} onChange={(e) => { setFullName(e.target.value) }} type='text' placeholder='Full Name' />
            <div>
              <Input value={userName} onChange={(e) => { setUserName(e.target.value) }} type='text' placeholder='Username' />
              <div className={`${userNameAvailability ? "text-green-500" : "text-red-500"}`}>{userName.trim().length < 8 ? null : (userNameAvailability ? `${userName} is available` : `${userName} is not available`)}</div>
            </div>
            <div className='flex justify-center items-center gap-2'>
              <Button disabled={error} onClick={handleSubmit} variant="outline">Sign up</Button>
              <AlertDialog>
                <AlertDialogTrigger>Rule</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Rules:</AlertDialogTitle>
                    <AlertDialogDescription>
                      <li><strong>email:</strong>Should be valid.</li>
                      <li><strong>password:</strong>Minimum 8 and max 30 char.</li>
                      <li><strong>fullName:</strong> Minimum 5 and max 30 char.</li>
                      <li><strong>userName:</strong>No space and min 8, max 20 and no special character.</li>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </div>
        <div className='border w-full flex justify-center items-center py-7'>
          <div>
            <span>Have an account?</span><Link href={'/account/login'} className='text-blue-700 font-bold'>&nbsp;Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page