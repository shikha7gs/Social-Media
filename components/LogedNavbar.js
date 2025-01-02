import { Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const LogedNavbar = () => {
  return (
    <nav className='w-full fixed top-0 z-50 h-14 border-b backdrop-blur flex justify-between items-center'>
      <Link href={'/user/profile'} className='mx-5 text-2xl font-bold'>Social Media</Link>
      <ul className='mx-5 gap-5 flex'>
        <Link href={'/'}>Feed</Link>
        <Link href={'/user/profile'}>Profile</Link>
        <Link href={'/search'}><Search/></Link>
      </ul>
    </nav>
  )
}
