"use client"

import { useCat } from '@/hook/queries'
import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ScrollArea } from './ui/scroll-area'
import NivoPieChart from './NivoChart'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"


const CatDetails = ({ id }: { id: string }) => {
    const { data: cat, isLoading, isError } = useCat()

    const car = cat?.find((cat) => cat.id === id)

    if (isLoading) {
        return <span>loading</span>
    }

    if (isError || !cat || !car) {
        return notFound()
    }

    return (
        <div className='w-full flex flex-col gap-5 pt-10'>
            <div className='grid grid-cols-3 gap-5 lg:h-[250px] md:h-[550px]'>
                <div className='rounded-[12px] lg:col-span-2 col-span-3 flex items-start max-md:flex-col overflow-hidden bg-white shadow '>
                    <div className='md:w-[250px] w-full md:h-full h-[300px] relative flex-shrink-0'>
                        <Image src={car.image?.url ?? '/img/404-white.jpg'} alt='sdasda' width={800} height={800} sizes='100vw' className='absolute size-full object-cover object-top' />
                    </div>

                    <div className='flex flex-col gap-3 py-5 px-6'>
                        <div className='flex flex-col'>
                            <h2 className='font-medium text-sm text-gray-400'>General Information</h2>
                            <span className='text-[24px] font-semibold'>{car.name}</span>
                            <ScrollArea className='lg:h-[158px] md:h-[182px] relative'>
                                <p className='mt-1 text-justify break-words'>{car.description}</p>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
                <HoverCard>
                    <HoverCardTrigger className='max-lg:col-span-3'>
                        <div className='rounded-[12px] relative'>
                            <span className='absolute right-4 top-0 font-medium text-gray-400 text-[20px]'>
                                Lifespan
                            </span>
                            <NivoPieChart name={`${car.life_span} years`} value={400} secondValue={80} height={250} top={20} bottom={20} style='md:!h-[250px] !h-[180px]' />
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className='w-full max-w-sm text-justify break-words'>
                        The average lifespan of {car.name} cat is {car.life_span} years
                    </HoverCardContent>
                </HoverCard>
            </div>
        </div>
    )
}

export default CatDetails
