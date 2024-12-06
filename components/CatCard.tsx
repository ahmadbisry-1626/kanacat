"use client"

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { FaRegBookmark, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { RxLink2 } from 'react-icons/rx';
import { Button } from './ui/button';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SearchForm from './SearchForm';
import FilterForm from './FilterForm';
import { useInfiniteCat } from '@/hook/queries';
import { useInView } from 'react-intersection-observer';

gsap.registerPlugin(ScrollTrigger)

const CatCard = ({ query }: { query: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, isSuccess, isFetching } = useInfiniteCat();
    const { ref, inView } = useInView();

    const headlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    useEffect(() => {
        gsap.fromTo(
            headlineRef.current,
            {
                opacity: 0,
                y: 100,
                scale: 0.8,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: headlineRef.current,
                    start: 'top 75%',
                    end: 'bottom 25%',
                    scrub: 1,
                },
            }
        );
    }, []);

    const handleFilterOpen = () => {
        setIsOpen(!isOpen)
    }

    const handleMouseMove = (e: any) => {
        const elemen = headlineRef.current
        if (!elemen) return

        const { left, top, height, width } = elemen.getBoundingClientRect()

        const relativeX = (e.clientX - left) / width
        const relativeY = (e.clientY - top) / height

        const tiltX = (relativeY - 0.5) * 20
        const tiltY = (relativeX - 0.5) * -20

        gsap.to(elemen, {
            rotateY: tiltY,
            rotateX: tiltX,
            translateZ: (relativeY - 0.5) * 50,
            transformPerspective: 700,
            ease: 'power3.out',
            duration: 0.5,
        })

    }

    const handleMouseLeave = () => {
        const elemen = headlineRef.current
        if (!elemen) return

        gsap.to(elemen, {
            rotateY: 0,
            rotateX: 0,
            translateZ: 0,
            ease: 'power3.out',
            duration: 0.5,
        })
    }


    return (
        <section className="w-full min-h-screen flex flex-col py-20 container mx-auto md:px-6 px-5 relative" id='header'>
            <div
                className="flex flex-col items-center text-center gap-2 headline-container w-fit mx-auto"
                ref={headlineRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <span className="text-primary text-[16px] md:text-[18px] font-medium">
                    Explore cat breeds, their personalities, and more
                </span>
                <h1 className="md:text-[4rem] text-[2.5rem] font-bold leading-[1.2] headline">
                    <span>Meet</span> <span>Your</span> <span>New</span> <br /> <span>Feline</span> <span>Friend</span>
                </h1>
            </div>

            <div className='flex items-center max-md:flex-col w-full md:justify-between gap-3 mt-20 mb-10 md:h-[54px] relative'>
                <SearchForm query={query} />
                <Button
                    className='flex items-center gap-2 px-12 !bg-secondary md:h-full h-[50px] rounded-[12px] max-md:w-full font-medium text-[18px]'
                    size={"lg"}
                    onClick={handleFilterOpen}>
                    <span className={`absolute ${!isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'} transition-all duration-300`}>
                        Filter
                    </span>
                    <span className={`absolute ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-300`}>
                        Close
                    </span>
                </Button>

                <div className={`w-full max-w-lg rounded-[12px] bg-white shadow-md absolute top-0 right-0 translate-y-32 md:translate-y-20 ${isOpen ? 'z-20 opacity-100 h-[200px] md:h-[210px]' : 'translate-y-10 -z-10 opacity-0 h-[20px]'} transition-all duration-300 ease-in-out p-5`}>
                    <FilterForm />
                </div>
            </div>

            {!data && (
                <div className='flex items-center justify-center'>
                    <span className='text-gray-400 text-[18px] md:text-[20px] font-medium'>
                        IF you see this message, it means your ISP is blocking the API. Please use VPN to access the website. There's nothing I can do it 😂
                    </span>
                </div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                {data?.pages.map((page, i) => (
                    page.map((cat, i) => (
                        <div key={i} className='w-full flex flex-col gap-3'>
                            <div className='flex items-center justify-between rounded-[12px] bg-white px-4 py-2 shadow-sm'>
                                <span className='text-[20px] font-semibold'>
                                    {cat.name}
                                </span>

                                <div className='group relative'>
                                    <span className='px-3 py-1 bg-black/80 text-white rounded-[8px] absolute right-0 z-10 w-max opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                        {cat.origin}
                                    </span>
                                    {cat.country_code === 'SP' ? (
                                        <div className='size-8 relative overflow-hidden rounded-full'>
                                            <Image src={`https://flagsapi.com/SG/flat/64.png`} alt='gambar cucing' width={100} height={100} sizes='100vw' className='absolute size-full object-cover object-center' />
                                        </div>
                                    ) : (
                                        <div className='size-8 relative overflow-hidden rounded-full'>
                                            <Image src={`https://flagsapi.com/${cat.country_code}/flat/64.png` || '/img/countries.png'} alt='gambar cucing' width={100} height={100} sizes='100vw' className='absolute size-full object-cover object-center' />
                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className='w-full h-[350px] overflow-hidden relative rounded-[12px] shadow-sm'>
                                <Image src={cat.image?.url ?? '/img/404-blue.jpg'} alt='gambar cucing' width={800} height={800} sizes='100vw' className='absolute object-cover object-top w-full h-full' loading='lazy' />
                            </div>

                            <div className='flex flex-col rounded-[12px] gap-3 bg-white px-4 py-3 pb-4 shadow-sm'>
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

                                    <div className='flex items-start gap-2 flex-wrap h-[55px] line-clamp-2'>
                                        {cat.temperament.split(',').map((temp, i) => (
                                            <span key={i} className='text-blue-700 hover:text-primary cursor-pointer transition duration-300'>
                                                #{temp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Button className='w-full h-[50px] rounded-[12px] !bg-secondary mt-7' size={"lg"} asChild>
                                    <Link href={`/cat/${cat.id}`}>
                                        Details
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))
                ))}

                {hasNextPage && (
                    <div className='w-full h-[400px] flex items-center justify-center' ref={ref}>
                        {isFetchingNextPage && (
                            <div className='loader' />
                        )}
                    </div>
                )}

                {Array.from({ length: 6 }).map((_, i) => (
                    hasNextPage && (
                        <div className='w-full h-[400px] md:flex items-center justify-center hidden' key={i}>
                            {isFetchingNextPage && (
                                <div className='loader' />
                            )}
                        </div>
                    )
                ))}

            </div>
        </section>
    )
}

export default CatCard
