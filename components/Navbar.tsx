import Image from 'next/image'
import React from 'react'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between w-full py-6'>
            <div className='flex items-end gap-2'>
                <Image src='/img/black.png' width={40} height={40} alt='logo' sizes='100vw' />
                <span className='font-medium text-[18px]'>KanaCat</span>
            </div>

            <span className='text-blue-500 font-medium cursor-pointer'>Report a Bug</span>
        </div>
    )
}

export default Navbar
