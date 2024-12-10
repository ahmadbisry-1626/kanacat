import CatDetails from '@/components/CatDetails'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id

    console.log(id)

    return (
        <main className='w-full min-h-screen flex flex-col container md:px-10 px-6 mx-auto overflow-hidden'>
            <Navbar />
            <CatDetails id={id}/>
        </main>
    )
}

export default page
