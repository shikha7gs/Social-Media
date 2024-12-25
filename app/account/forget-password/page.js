"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { redirect } from 'next/navigation'


const page = () => {
  const [emailOrUserName, setEmailOrUserName] = useState("")
  const [error, setError] = useState(true)
  const [uuid, setUuid] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const req1 = await fetch("/api/account/forgetPassword/checkExistanceAndSendOtp", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrUserName })
    })
    const res1 = await req1.json()
    if (!res1.success) {
      alert(res1.message)
      return
    }
    alert("Sent OTP")
    setUuid(res1.uuid)
    setOtpSent(true)
  }

  useEffect(() => {
    if (!emailOrUserName.includes(" ") && emailOrUserName.length >= 8) {
      setError(false)
    } else {
      setError(true)
    }
  }, [emailOrUserName])

  const onSubmitOtp = async (e) => {
    e.preventDefault()
    console.log(otp)
    const req1 = await fetch("/api/account/forgetPassword/verifyOtpAndLogTheUser", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrUserName, uuid, otp })
    })
    const res1 = await req1.json()
    if(!res1.success){
      alert(res1.message)
    }else{
      redirect("/user/profile")
    }
  }

  return (
    <div className='justify-center items-center min-h-screen flex flex-col'>
      <div className='w-80 p-7 flex flex-col justify-center items-center border'>
        <div className='flex flex-col justify-center items-center'>
          <img className='border rounded-full w-20 m-1' src="/lock.png" />
          <h3 className='text-md font-bold'>Trouble logging in?</h3>
          <p className='text-sm text-center'>Enter your email or username and we'll verify you then log you
          </p>
        </div>

        {otpSent ? (<form className='p-3 flex flex-col justify-center items-center gap-3 w-72'>
          <InputOTP value={otp} onChange={(e) => { setOtp(e) }} maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={onSubmitOtp} disabled={otp.length !== 6} variant="outline">Submit otp</Button>
        </form>) : (<form className='p-3 flex flex-col justify-center items-center gap-3 w-72'>
          <Input value={emailOrUserName} onChange={(e) => { setEmailOrUserName(e.target.value) }} type="text" placeholder="Email or Username" className="w-full" />
          <Button disabled={error} onClick={handleSubmit} variant="outline">Send otp</Button>
          <Link className='text-xs text-blue-900' href="/account/login">Back to login</Link>
        </form>)}
      </div>
    </div>
  )
}

export default page