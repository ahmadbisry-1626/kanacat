import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between w-full py-4 md:py-6'>
            <Link href="/" className='flex items-end gap-2'>
                <Image src='/img/black.png' width={40} height={40} alt='logo' sizes='100vw' className='md:block hidden'/>
                <Image src='/img/black.png' width={35} height={35} alt='logo' sizes='100vw' className='block md:hidden'/>
                <span className='font-medium text-[18px]'>KanaCat</span>
            </Link>

            <span className='text-blue-500 font-medium cursor-pointer'>Report a Bug</span>
        </div>
    )
}

export default Navbar
