"use client"

import { useCat } from '@/hook/queries'
import Image from 'next/image';
import React, { useRef } from 'react'
import { FaRegBookmark, FaRegHeart } from 'react-icons/fa';
import { RxLink2 } from 'react-icons/rx';
import { Button } from './ui/button';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger)

const CatCard = ({ page, limit }: { page: number, limit: number }) => {
    const { data: cat, isLoading, error } = useCat(page, limit)


    return (
        <section className="w-full min-h-screen flex flex-col py-20 container mx-auto md:px-6 px-5 relative">
            <div className='flex flex-col items-center'>
                <span className='text-primary text-[18px] font-medium'>
                    Kucing kucing baik
                </span>
                <h1 className='text-[3rem] font-bold leading-[1.5]'>
                    Choose your Cat
                </h1>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-20'>
                {cat?.map((cat) => {
                    return (
                        <div key={cat.id} className='w-full flex flex-col gap-3 overflow-hidden'>
                            <div className='flex items-center justify-between rounded-[12px]'>
                                <span className='text-[20px] font-semibold'>
                                    {cat.name}
                                </span>

                                <div className='size-8 relative overflow-hidden rounded-full'>
                                    <Image src={`https://flagsapi.com/${cat.country_code}/flat/64.png`} alt='gambar cucing' width={100} height={100} sizes='100vw' className='absolute size-full object-cover object-center' />
                                </div>
                            </div>

                            <div className='flex flex-col rounded-[12px] gap-3'>
                                <div className='w-full h-[350px] overflow-hidden relative rounded-[12px]'>
                                    <Image src={cat.image.url} alt='gambar cucing' width={800} height={800} sizes='100vw' className='absolute object-cover object-center w-full h-full' />
                                </div>

                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <FaRegHeart className='size-6' />
                                        <RxLink2 className='size-7' />
                                    </div>

                                    <FaRegBookmark className='size-6' />
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <p className='line-clamp-2 text-[16px] text-gray-500 text-justify break-words'>
                                        {cat.description}
                                    </p>

                                    <Button className='w-full h-[50px] rounded-full !bg-secondary' size={"lg"} asChild>
                                        <Link href={`/cat/${cat.id}`}>
                                            Details
                                        </Link>
                                    </Button>
                                </div>
                            </div>


                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default CatCard
