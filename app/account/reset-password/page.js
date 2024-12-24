
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='justify-center items-center min-h-screen flex flex-col'>
      <div className='w-80 p-7 flex flex-col justify-center items-center border'>
        <div className='flex flex-col justify-center items-center'>
          <img className='border rounded-full w-20 m-1' src="/lock.png"  />
          <h3 className='text-md font-bold'>Trouble logging in?</h3>
          <p className='text-sm text-center'>Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>
        <form className='p-3 flex flex-col justify-center items-center gap-3 w-72'>
          <Input type="email" placeholder="Email" className="w-full"/>
          <Button variant="outline">Send login link</Button>
          <Link className='text-xs text-blue-900' href="/account/login">Back to login</Link>
        </form>
        <div></div>
      </div>
    </div>
  )
}

export default page