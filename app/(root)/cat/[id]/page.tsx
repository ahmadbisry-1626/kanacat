import CatDetails from '@/components/CatDetails'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id

    return (
        <main className='w-full min-h-screen flex flex-col md:px-10 px-5 mx-auto overflow-hidden md:max-w-7xl'>
            <Navbar />
            <CatDetails id={id}/>
        </main>
    )
}

export default page
