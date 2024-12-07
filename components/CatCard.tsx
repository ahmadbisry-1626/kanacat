"use client"

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaRegBookmark, FaRegHeart } from 'react-icons/fa';
import { RxLink2 } from 'react-icons/rx';
import { Button } from './ui/button';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SearchForm from './SearchForm';
import FilterForm from './FilterForm';
import { useCat, useInfiniteCat } from '@/hook/queries';
import { useInView } from 'react-intersection-observer';

gsap.registerPlugin(ScrollTrigger)

const CatCard = () => {
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteCat();
    const { data: catData, isFetched } = useCat()
    const [isOpen, setIsOpen] = useState(false)
    const [query, setIsQuery] = useState('')
    const [filter, setFilter] = useState({
        indoor: false,
        lap: false,
        experimental: false,
        natural: false,
        rare: false,
        hairless: false,
        rex: false,
        suppressedTail: false,
        shortLegs: false,
    })

    const { ref, inView } = useInView();

    const headlineRef = useRef<HTMLDivElement>(null);

    const filteredData = useMemo(() => {
        if (!catData) return []

        return catData
            .filter((cat) =>
                cat.name.toLowerCase().includes(query.toLowerCase()) ||
                cat.origin.toLowerCase().includes(query.toLowerCase())
            ).filter((cat) => {
                return (
                    (!filter.indoor || cat.indoor === 1) &&
                    (!filter.lap || cat.lap === 1) &&
                    (!filter.experimental || cat.experimental === 0) &&
                    (!filter.natural || cat.natural === 1) &&
                    (!filter.rare || cat.rare === 1) &&
                    (!filter.hairless || cat.hairless === 1) &&
                    (!filter.rex || cat.rex === 1) &&
                    (!filter.suppressedTail || cat.suppressed_tail === 1) &&
                    (!filter.shortLegs || cat.short_legs === 1)
                )
            })
    }, [data, query, filter])


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

    const dataLength = data?.pages.map((page) => page.length).reduce((acc, val) => acc + val, 0)

    return (
        <section className="w-full min-h-screen flex flex-col py-20 container mx-auto md:px-6 px-5 relative" id='header'>
            <div
                className="flex flex-col items-center text-center gap-2 headline-container w-fit mx-auto"
                ref={headlineRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <span className="text-black text-[16px] md:text-[20px] font-medium">
                    Explore cat breeds, their personalities, and more
                </span>
                <h1 className="md:text-[4rem] text-[2.5rem] font-bold leading-[1.2] headline">
                    <span>Meet</span> <span>Your</span> <span>New</span> <br /> <span>Feline</span> <span>Friend</span>
                </h1>
            </div>

            {/* DATA HANDLING */}
            <div className='flex items-center max-md:flex-col w-full md:justify-between gap-3 mt-20 mb-10 md:h-[54px] relative'>
                <SearchForm query={query} setIsQuery={setIsQuery} />
                <Button
                    className='flex items-center gap-2 px-14 !bg-black md:h-full h-[50px] rounded-[12px] max-md:w-full font-medium text-[18px]'
                    size={"lg"}
                    onClick={handleFilterOpen}>
                    <span className={`absolute ${!isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'} transition-all duration-300`}>
                        {filter && Object.values(filter).some((val) => val) ? 'Filtered' : 'Filter'}
                    </span>
                    <span className={`absolute ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-300`}>
                        Close
                    </span>
                </Button>

                <div className={`w-full max-w-lg rounded-[12px] bg-white shadow absolute top-0 right-0 translate-y-32 md:translate-y-20 ${isOpen ? 'z-20 opacity-100 h-[200px] md:h-[210px]' : 'translate-y-10 -z-10 opacity-0 h-[20px]'} transition-all duration-300 ease-in-out p-5`}>
                    <FilterForm filter={filter} setFilter={setFilter} />
                </div>
            </div>

            {isLoading ? (
                <div className='flex items-center justify-center h-[300px] w-full'>
                    <div className='loader' />
                </div>
            ) : !isLoading && !data && (
                <div className='flex items-center justify-center w-full bg-yellow-200 rounded-[12px] px-4 py-3 -mt-2 mb-3'>
                    <span className='text-[16px] font-semibold'>
                        If u see this, it means your ISP is blocking the request to the API 😂
                    </span>
                </div>
            )}

            {/* !query and filtering will show react query with infinite scoll */}
            {!query && Object.values(filter).every((value) => !value) ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {data?.pages.map((page) => (
                        page.map((cat) => {
                            return (
                                <div key={cat.id} className='w-full flex flex-col gap-3'>
                                    <div className='flex items-center w-full justify-between'>
                                        <div className='flex items-center gap-3 relative'>
                                            <div className='size-10 flex items-center justify-center bg-black relative rounded-[8px] p-1' >
                                                {cat.rare === 1 ? (
                                                    <Image src={'/img/rare.png'} alt='gambar cucing' width={400} height={400} sizes='100vw' className='' />
                                                ) : (
                                                    <Image src={'/img/cat-white.png'} alt='gambar cucing' width={400} height={400} sizes='100vw' className='' />
                                                )}
                                            </div>

                                            <span className='text-[18px] font-semibold text-black'>
                                                {cat.name}
                                            </span>
                                        </div>

                                        <div className='group relative'>
                                            <span className='px-3 py-2 bg-black/80 text-white rounded-[8px] absolute right-0 bottom-0 z-10 w-max opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                                {cat.origin}
                                            </span>
                                            {cat.country_code === 'SP' ? (
                                                <div className='size-10 relative overflow-hidden rounded-full'>
                                                    <Image src={`https://flagsapi.com/SG/flat/64.png`} alt='gambar cucing' width={100} height={100} sizes='100vw' className='absolute size-full object-cover object-center' />
                                                </div>
                                            ) : (
                                                <div className='size-10 relative overflow-hidden rounded-full'>
                                                    <Image src={`https://flagsapi.com/${cat.country_code}/flat/64.png` || '/img/countries.png'} alt='gambar cucing' width={100} height={100} sizes='100vw' className='absolute size-full object-cover object-center' />
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <div className='w-full h-[350px] overflow-hidden relative rounded-[12px] shadow'>
                                        <Image src={cat.image?.url ?? '/img/404-white.jpg'} alt='gambar cucing' width={800} height={800} sizes='100vw' className='absolute object-cover object-top w-full h-full' loading='lazy' />
                                    </div>

                                    <div className='flex flex-col rounded-[12px] gap-3 bg-white px-4 py-3 pb-4 shadow'>
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
                                                    <span key={i} className='text-blue-700 hover:text-black cursor-pointer transition duration-300'>
                                                        #{temp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Button className='w-full h-[50px] rounded-[12px] !bg-black mt-7' size={"lg"} asChild>
                                            <Link href={`/cat/${cat.id}`}>
                                                Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )
                        }))
                    )}

                    {hasNextPage && (
                        <div className='w-full h-[400px] flex items-center justify-center' ref={ref}>
                            {isFetchingNextPage && (
                                <div className='loader' />
                            )}
                        </div>
                    )}

                    {Array.from({
                        length: Math.max(Math.min(data?.pages.flat().length || 1, 2), 1)
                    }).map((_, i) => (
                        hasNextPage && (
                            <div className="w-full h-[400px] md:flex items-center justify-center hidden" key={i}>
                                {isFetchingNextPage && (
                                    <div className="loader" />
                                )}
                            </div>
                        )
                    ))}


                </div>
            ) : (
                // when there's a query or filtering, it will show filtered data without limit on API
                filteredData.length === 0 ? (
                    <div className='w-full h-[300px] bg-gray-200 flex items-center justify-center rounded-[12px] px-5 py-3'>
                        <span className='font-semibold text-[18px] line-clamp-[10]'>No cat found</span>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                        {filteredData.map((cat) => {
                            const regex = new RegExp(`(${query})`, 'gi');
                            const catPart = cat.name.split(regex)
                            return (

                                <div key={cat.id} className='w-full flex flex-col gap-3'>
                                    <div className='flex items-center w-full justify-between'>
                                        <div className='flex items-center gap-3 relative'>
                                            <div className='size-10 flex items-center justify-center bg-black relative rounded-[8px] p-1' >
                                                {cat.rare === 1 ? (
                                                    <Image src={'/img/rare.png'} alt='gambar cucing' width={400} height={400} sizes='100vw' className='' />
                                                ) : (
                                                    <Image src={'/img/cat-white.png'} alt='gambar cucing' width={400} height={400} sizes='100vw' className='' />
                                                )}
                                            </div>

                                            <span className='text-[18px] font-semibold text-black'>
                                                {query ? (
                                                    catPart.map((part, i) => (
                                                        part.toLowerCase() === query.toLowerCase() ? (
                                                            <span key={i} className='!text-primary'>{part}</span>
                                                        ) : (
                                                            part
                                                        )
                                                    ))
                                                ) : (
                                                    cat.name
                                                )}
                                            </span>
                                        </div>

                                        <div className='group relative'>
                                            <span className='px-3 py-2 bg-black/80 text-white rounded-[8px] absolute right-0 bottom-0 z-10 w-max opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                                {cat.origin}
                                            </span>
                                            {cat.country_code === 'SP' ? (
                                                <div className='size-10 relative overflow-hidden rounded-full'>
                                                    <Image src={`https://flagsapi.com/SG/flat/64.png`} alt='gambar cucing' width={100} height={100} sizes='100vw' className='absolute size-full object-cover object-center' />
                                                </div>
                                            ) : (
                                                <div className='size-10 relative overflow-hidden rounded-full'>
                                                    <Image src={`https://flagsapi.com/${cat.country_code}/flat/64.png` || '/img/countries.png'} alt='gambar cucing' width={100} height={100} sizes='100vw' className='absolute size-full object-cover object-center' />
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <div className='w-full h-[350px] overflow-hidden relative rounded-[12px] shadow'>
                                        <Image src={cat.image?.url ?? '/img/404-white.jpg'} alt='gambar cucing' width={800} height={800} sizes='100vw' className='absolute object-cover object-top w-full h-full' loading='lazy' />
                                    </div>

                                    <div className='flex flex-col rounded-[12px] gap-3 bg-white px-4 py-3 pb-4 shadow'>
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
                                                    <span key={i} className='text-blue-700 hover:text-black cursor-pointer transition duration-300'>
                                                        #{temp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Button className='w-full h-[50px] rounded-[12px] !bg-black mt-7' size={"lg"} asChild>
                                            <Link href={`/cat/${cat.id}`}>
                                                Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                )
            )}



        </section>
    )
}

export default CatCard
