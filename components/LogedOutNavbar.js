import Link from 'next/link'
import React from 'react'

const LogedOutNavbar = () => {
    return (
        <nav className='w-full h-14 border-b backdrop-blur flex justify-between items-center fixed top-0'>
            <Link href={'/'} className='title font-bold text-2xl mx-5'>Social Media</Link>
            <ul className='flex gap-4 mx-5'>
                <li><Link href={'/account/signup'}>Sign up</Link></li>
                <li><Link href={'/account/login'}>Log In</Link></li>
            </ul>
        </nav>
    )
}

export default LogedOutNavbar