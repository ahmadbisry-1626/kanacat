import CatDetails from '@/components/CatDetails'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id

    console.log(id)

    return (
        <main className='w-screen min-h-screen flex flex-col container md:px-6 px-5 mx-auto overflow-hidden'>
            <Navbar />
            <CatDetails id={id}/>
        </main>
    )
}

export default page
