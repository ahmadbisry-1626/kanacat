"use client"

import { useCat } from '@/hook/queries'
import React, { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ScrollArea } from './ui/scroll-area'
import NivoPieChart from './NivoChart'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Progress } from './ui/progress'
import { FaCircleInfo } from 'react-icons/fa6'
import { Slider } from './ui/slider'

const WeightsSlider = ({ desc, firstValue, secondValue, metrics }: { desc: string, firstValue: number, secondValue: number, metrics: string }) => {
    return (
        <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
                <span className='md:text-[18px] font-semibold'>
                    Weights
                </span>
                <HoverCard>
                    <HoverCardTrigger className='group'>
                        <FaCircleInfo className='text-gray-400 size-5 group-hover:text-black transitiona-ll duration-300' />
                    </HoverCardTrigger>
                    <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none w-fit break-words'>
                        {desc}
                    </HoverCardContent>
                </HoverCard>
            </div>

            <HoverCard>
                <HoverCardTrigger className='relative'>
                    <span className='absolute left-0 bottom-0 font-semibold translate-y-8'>
                        0 KG
                    </span>
                    <span className='absolute right-0 bottom-0 font-semibold translate-y-8'>
                        15 KG
                    </span>
                    <Slider defaultValue={[firstValue, secondValue]} max={15} disabled />
                </HoverCardTrigger>
                <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none w-fit break-words'>
                    {metrics}
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}



const BehaviorComponent = ({ title, value, desc, style }: { title: string, value: number, desc: string, style?: string }) => {
    const [progress, setProgress] = useState(13)

    useEffect(() => {
        const timer = setTimeout(() => setProgress(value), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={`flex flex-col gap-3 ${style}`}>
            <div className='flex items-center gap-2'>
                <span className='md:text-[18px] font-semibold'>
                    {title}
                </span>
                <HoverCard>
                    <HoverCardTrigger className='group'>
                        <FaCircleInfo className='text-gray-400 size-5 group-hover:text-black transitiona-ll duration-300' />
                    </HoverCardTrigger>
                    <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none !w-96 break-words'>
                        {desc}
                    </HoverCardContent>
                </HoverCard>
            </div>
            <HoverCard>
                <HoverCardTrigger className=''>
                    <Progress value={progress * 20} className='!h-3' />
                </HoverCardTrigger>
                <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none w-fit break-words'>
                    {title}: {value}
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}



const CatDetails = ({ id }: { id: string }) => {
    const { data: cat, isLoading, isError } = useCat()

    const car = cat?.find((cat) => cat.id === id)

    if (isLoading) {
        return <span>loading</span>
    }

    if (isError || !cat || !car) {
        return notFound()
    }

    const weightString = car.weight.metric
    const [minWeight, maxWeight] = weightString.split(" - ").map(Number)

    return (
        <div className='w-full flex flex-col gap-5 py-10'>
            <div className='grid grid-cols-3 gap-5 lg:h-[250px] md:h-[550px]'>
                <div className='rounded-[12px] lg:col-span-2 col-span-3 flex items-start max-md:flex-col overflow-hidden bg-white shadow '>
                    <div className='md:w-[250px] w-full md:h-full h-[300px] relative flex-shrink-0'>
                        <Image src={car.image?.url ?? '/img/404-white.jpg'} alt='sdasda' width={800} height={800} sizes='100vw' className='absolute size-full object-cover object-top' />
                    </div>

                    <div className='flex flex-col gap-3 py-5 px-6 relative'>
                        {car.country_code === "SP" ? (
                            <HoverCard>
                                <HoverCardTrigger className='absolute top-4 right-6 group'>
                                    <Image src={`https://flagsapi.com/SG/flat/64.png`} alt='' width={40} height={40} sizes='100vw' className='sgroup-hover:opacity-80 transition-all duration-300 ease-in-out' />
                                </HoverCardTrigger>
                                <HoverCardContent className='w-max rounded-[12px] bg-black/80 text-white'>
                                    {car.origin}
                                </HoverCardContent>
                            </HoverCard>
                        ) : (
                            <HoverCard>
                                <HoverCardTrigger className='absolute top-4 right-6 group'>
                                    <Image src={`https://flagsapi.com/${car.country_code}/flat/64.png`} alt='' width={40} height={40} sizes='100vw' className=' group-hover:opacity-80 transition-all duration-300 ease-in-out' />
                                </HoverCardTrigger>
                                <HoverCardContent className='w-max rounded-[12px] bg-black/80 text-white'>
                                    {car.origin}
                                </HoverCardContent>
                            </HoverCard>
                        )}
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
                            <span className='absolute right-4 top-0  text-black font-semibold text-[24px]'>
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

            <div className='grid grid-cols-3 gap-7 md:gap-5 lg:h-[420px] mt-4'>
                <div className='flex flex-col gap-2 lg:col-span-2 col-span-3'>
                    <h1 className='text-[24px] font-semibold'>Behavior</h1>
                    <div className='bg-white shadow rounded-[12px] px-6 py-5 grid grid-cols-2 gap-6'>
                        <BehaviorComponent title='Adaptability' value={car.adaptability} desc='How well the breed adapts to new environments (1 = low adaptability, 5 = high adaptability)' />
                        <BehaviorComponent title='Affection' value={car.affection_level} desc='How affectionate the breed is (1 = low, 5 = high)' />
                        <BehaviorComponent title='Energy' value={car.energy_level} desc='How energetic the breed is (1 = low, 5 = high)' />
                        <BehaviorComponent title='Intelligence' value={car.intelligence} desc='How intelligent the breed is (1 = low, 5 = high)' />
                        <BehaviorComponent title='Social Needs' value={car.social_needs} desc='How much social interaction the breed requires (1 = low, 5 = high)' />
                        <BehaviorComponent title='Stranger Friendly' value={car.stranger_friendly} desc='How friendly the breed is with strangers (1 = shy, 5 = very friendly)' />
                        <BehaviorComponent title='Child Friendly' value={car.child_friendly} desc='How well the breed gets along with children (1 = not very child-friendly, 5 = very child-friendly)' />
                        <BehaviorComponent title='Dog Friendly' value={car.dog_friendly} desc='How well the breed gets along with dogs (1 = not dog-friendly, 5 = very dog-friendly)' />
                        <BehaviorComponent title='Vocalisation' value={car.vocalisation} desc='How vocal the breed is (1 = quiet, 5 = very vocal)' />
                    </div>
                </div>

                <div className='flex flex-col gap-2 max-lg:col-span-3'>
                    <h1 className='text-[24px] font-semibold'>Physical Attributes</h1>
                    <div className='bg-white shadow h-full rounded-[12px] px-6 py-5'>
                        <WeightsSlider desc='The weight range in kilograms' firstValue={minWeight} secondValue={maxWeight} metrics={`${car.weight.metric} Kilogram`} />
                        <BehaviorComponent title='Shedding' value={car.shedding_level} desc='Indicates how much the breed sheds (1 = low shedding, 5 = high shedding)' style='mt-12' />
                        <BehaviorComponent title='Grooming' value={car.grooming} desc='Indicates the grooming requirement (1 = minimal grooming, 5 = high grooming)' style='mt-5' />
                    </div>
                    <div className='flex items-center gap-3 flex-wrap max-lg:justify-center mt-4'>
                        {car.temperament.split(',').map((temp, i) => (
                            <span key={i} className='rounded-[12px] bg-gray-100 text-gray-400 px-3 py-1 text-sm font-medium capitalize hover:bg-white hover:text-black transition-all duration-300 cursor-default shadow hover:scale-105'>{temp}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CatDetails
