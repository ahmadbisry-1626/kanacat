"use client"

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaBookmark, FaCircle, FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa';
import { RxLink2 } from 'react-icons/rx';
import { Button } from './ui/button';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SearchForm from './SearchForm';
import FilterForm from './FilterForm';
import { useCat, useFavouriteCat, useInfiniteCat } from '@/hook/queries';
import { useInView } from 'react-intersection-observer';
import { FaLocationDot } from 'react-icons/fa6';
import { deleteLikedCat, likedCatHandler } from '@/lib/actions';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LikedCatProps, LikedCatResponse } from '@/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


gsap.registerPlugin(ScrollTrigger)

const CatCard = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteCat();
    const { data: catData } = useCat()
    const { data: favouriteCat, isFetched } = useFavouriteCat()

    const [secondModalOpen, setSecondModalOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(true)
    const [copied, setCopied] = useState<Record<string, boolean>>({})
    const [likedCat, setLikedCat] = useState<Record<string, boolean>>({})
    const [save, setSave] = useState<Record<string, boolean>>({})
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

    const likeMutation = useMutation<LikedCatResponse, Error, string>({
        mutationFn: likedCatHandler,
        onMutate: async (image_id: string) => {
            await queryClient.cancelQueries({ queryKey: ['favouriteCat'] });
            const previousFavouriteCat = queryClient.getQueryData<LikedCatProps[]>(['favouriteCat']);
            if (previousFavouriteCat) {
                queryClient.setQueryData<LikedCatProps[]>(['favouriteCat'], (oldData) => [
                    ...oldData!,
                    { image_id, id: `temp-${image_id}`, value: 1 },
                ]);
            }
            return { previousFavouriteCat };
        },
        onError: (err: Error, image_id: string, context: unknown) => {
            const typedContext = context as { previousFavouriteCat: LikedCatProps[] | undefined } | undefined;
            if (typedContext?.previousFavouriteCat) {
                queryClient.setQueryData(['favouriteCat'], typedContext.previousFavouriteCat);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['favouriteCat'] });
        },
    });

    const unlikeMutation = useMutation<{ message: string }, Error, string>({
        mutationFn: deleteLikedCat,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['favouriteCat'] });
            const previousFavouriteCat = queryClient.getQueryData<LikedCatProps[]>(['favouriteCat']);
            if (previousFavouriteCat) {
                queryClient.setQueryData<LikedCatProps[]>(['favouriteCat'], (oldData) =>
                    oldData?.filter((cat) => cat.id !== id) || []
                );
            }
            return { previousFavouriteCat };
        },
        onError: (err: Error, id: string, context: unknown) => {
            const typedContext = context as { previousFavouriteCat: LikedCatProps[] | undefined } | undefined;
            if (typedContext?.previousFavouriteCat) {
                queryClient.setQueryData(['favouriteCat'], typedContext.previousFavouriteCat);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['favouriteCat'] });
        },
    });


    const toggleLike = (id: string) => {
        const favCatId = favouriteCat?.find((cat) => cat.image_id === id)?.id;

        const isLiked = likedCat[id];
        setLikedCat((prev) => ({
            ...prev,
            [id]: !isLiked,
        }))

        if (!isLiked) {
            likeMutation.mutate(id);
        } else {
            unlikeMutation.mutate(favCatId ?? '');
        }
    };


    // const toggleLike = (id: string) => {
    //     const favCatId = favouriteCat?.filter((cat) => cat.image_id === id);
    //     const getFavCatId = favCatId?.[0]?.id;

    //     const isLiked = likedCat[id];
    //     setLikedCat((prev) => ({
    //         ...prev,
    //         [id]: !isLiked,
    //     }))

    //     {
    //         !isLiked ? (
    //             likedCatHandler(id)
    //         ) : (
    //             deleteLikedCat(getFavCatId ?? '')
    //         )
    //     }
    // }

    const saveHandler = (id: string) => {
        const isSaved = save[id]
        setSave((prev) => ({
            ...prev,
            [id]: !isSaved
        }))
    }

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
        <section className="w-full min-h-screen flex flex-col py-20 md:max-w-7xl mx-auto md:px-10 px-5 relative" id='header'>

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

            {isLoading && !favouriteCat ? (
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
                            const likeCount = favouriteCat?.filter((fav) => fav.image_id === cat.id).length

                            return (
                                <div key={cat.id} className='w-full flex flex-col gap-3'>
                                    <div className='w-full xl:h-[350px] lg:h-[300px] sm:h-[300px] h-[350px] overflow-hidden relative rounded-[12px] shadow group'>
                                        <Image src={cat.image?.url ?? '/img/404-black.jpg'} alt='gambar cucing' width={800} height={800} sizes='100vw' className='absolute object-cover object-top w-full h-full group-hover:scale-[1.02] transition-all duration-300' loading='lazy' />
                                        <div className='w-full absolute h-[220px] bg-gradient-to-t from-black/80 bottom-0' />

                                        <div className='flex flex-col gap-2 absolute bottom-4 left-4 '>
                                            <span className='text-[20px] font-semibold text-gray-300'>{cat.name}</span>
                                            <div className='flex items-center gap-2'>
                                                <FaLocationDot className='size-5 text-gray-300' />
                                                <span className='text-gray-300 font-semibold text-[16px]'>{cat.origin}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col rounded-[12px] gap-3 bg-white px-4 py-3 pb-4 shadow'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-3'>
                                                {modalOpen && secondModalOpen === false ? (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger className="group relative" onClick={() => toggleLike(cat.id)}>
                                                            <FaRegHeart className="size-6 group-hover:scale-[1.03] transition-all duration-300" />
                                                            <FaHeart
                                                                className={`size-6 absolute z-10 text-red-500 top-0 opacity-0 ${likedCat[cat.id] && '!opacity-100 scale-105'
                                                                    } transition-all duration-300`}
                                                            />
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className=''>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className='text-[20px] font-semibold'>Free plan limit</AlertDialogTitle>
                                                                <AlertDialogDescription className='text-[16px] text-gray-500 font-medium'>
                                                                    Limited API access means no likes for now, but our cats appreciate your love regardless!
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setSecondModalOpen(true)} className='h-[50px] rounded-[12px]'>Unforgiveness</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => setModalOpen(false)} className='!bg-black h-[50px] rounded-[12px] hover:!bg-primary transition-all !duration-300'>Patience is my superpower!</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                ) : modalOpen && secondModalOpen ? (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger className="group relative" onClick={() => toggleLike(cat.id)}>
                                                            <FaRegHeart className="size-6 group-hover:scale-[1.03] transition-all duration-300" />
                                                            <FaHeart
                                                                className={`size-6 absolute z-10 text-red-500 top-0 opacity-0 ${likedCat[cat.id] && '!opacity-100 scale-105'
                                                                    } transition-all duration-300`}
                                                            />
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className=''>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className='text-[20px] font-semibold'>Free plan limit</AlertDialogTitle>
                                                                <AlertDialogDescription className='text-[16px] text-gray-500 font-medium'>
                                                                    Limited API access means no likes for now, but our cats appreciate your love regardless!
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setModalOpen(false)} className='h-[50px] rounded-[12px]'>Forgive me</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => setModalOpen(false)} className='!bg-black h-[50px] rounded-[12px] hover:!bg-primary transition-all !duration-300'>Patience is my superpower!</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                ) : (
                                                    <button
                                                        className="group relative"
                                                        onClick={() => toggleLike(cat.id)}
                                                    >
                                                        <FaRegHeart className="size-6 group-hover:scale-[1.03] transition-all duration-300" />
                                                        <FaHeart
                                                            className={`size-6 absolute z-10 text-red-500 top-0 opacity-0 ${likedCat[cat.id] && '!opacity-100 scale-105'
                                                                } transition-all duration-300`}
                                                        />
                                                    </button>
                                                )}


                                                <button
                                                    className={`group relative ${copied[cat.id] && 'cursor-default'}`}
                                                    disabled={copied[cat.id]}
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(`https://kanacat.vercel.app/cat/${cat.id}`)
                                                        toast('Link copied to clipboard')
                                                        setCopied((prev) => ({ ...prev, [cat.id]: true }))
                                                        setTimeout(() => setCopied((prev) => ({ ...prev, [cat.id]: false })), 3000)
                                                    }}>
                                                    <span className={`size-6 absolute left-0 top-0 ${copied[cat.id] ? 'translate-y-0.5 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-300 font-medium`}>
                                                        Copied
                                                    </span>
                                                    <RxLink2 className={`size-7 group-hover:scale-[1.03] transition-all duration-300 ${copied[cat.id] ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`} />
                                                </button>
                                            </div>

                                            <button
                                                className="group relative"
                                                onClick={() => saveHandler(cat.id)}
                                            >
                                                <FaRegBookmark className='size-6 group-hover:scale-[1.03] transition-all duration-300' />
                                                <FaBookmark
                                                    className={`size-6 absolute z-10 text-black top-0 opacity-0 ${save[cat.id] && '!opacity-100 scale-105'
                                                        } transition-all duration-300`}
                                                />
                                            </button>

                                        </div>

                                        <div className='flex items-center gap-3 -mb-2'>
                                            {isFetched ? (
                                                <span className='font-semibold'>
                                                    {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                                                </span>
                                            ) : (
                                                <div className='flex items-center gap-1'>
                                                    <FaCircle className='size-1.5 text-black animate-bounce' />
                                                    <FaCircle className='size-1.5 text-black animate-bounce' style={{ animationDelay: '0.2s' }} />
                                                    <FaCircle className='size-1.5 text-black animate-bounce' style={{ animationDelay: '0.4s' }} />
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex flex-col gap-3'>
                                            <p className='line-clamp-2 text-[16px] text-gray-500 break-words'>
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
                                        <Button className='w-full h-[50px] rounded-[12px] !bg-black mt-7 hover:!bg-primary transition-all duration-300' size={"lg"} asChild>
                                            <Link href={`/cat/${cat.id}`}>
                                                Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )
                        }))
                    )}

                    {
                        hasNextPage && (
                            <div className='w-full h-[400px] flex items-center justify-center' ref={ref}>
                                {isFetchingNextPage && (
                                    <div className='loader' />
                                )}
                            </div>
                        )
                    }

                    {
                        Array.from({
                            length: Math.max(Math.min(data?.pages.flat().length || 1, 2), 1)
                        }).map((_, i) => (
                            hasNextPage && (
                                <div className="w-full h-[400px] md:flex items-center justify-center hidden" key={i}>
                                    {isFetchingNextPage && (
                                        <div className="loader" />
                                    )}
                                </div>
                            )
                        ))
                    }


                </div >
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
                            const catOrigin = cat.origin.split(regex)
                            const likeCount = favouriteCat?.filter((fav) => fav.image_id === cat.id).length

                            return (

                                <div key={cat.id} className='w-full flex flex-col gap-3'>
                                    <div className='w-full h-[350px] overflow-hidden relative rounded-[12px] shadow'>
                                        <Image src={cat.image?.url ?? '/img/404-black.jpg'} alt='gambar cucing' width={800} height={800} sizes='100vw' className='absolute object-cover object-top w-full h-full' loading='lazy' />
                                        <div className='w-full absolute h-[220px] bg-gradient-to-t from-black/80 bottom-0' />

                                        <div className='flex flex-col gap-2 absolute bottom-4 left-4 '>
                                            <span className='text-[20px] font-semibold text-gray-300'>
                                                {query ? (
                                                    catPart.map((part, i) => (
                                                        part.toLowerCase() === query.toLowerCase() ? (
                                                            <span key={i} className='bg-gradient-to-r from-primary to-[#FF7043] bg-clip-text text-transparent'>{part}</span>
                                                        ) : (
                                                            part
                                                        )
                                                    ))
                                                ) : (
                                                    cat.name
                                                )}
                                            </span>
                                            <div className='flex items-center gap-2'>
                                                <FaLocationDot className='size-5 text-gray-300' />
                                                <span className='text-gray-300 font-semibold text-[16px]'>
                                                    {query ? (
                                                        catOrigin.map((part, i) => (
                                                            part.toLowerCase() === query.toLowerCase() ? (
                                                                <span key={i} className='bg-gradient-to-r from-primary to-[#FF7043] bg-clip-text text-transparent'>{part}</span>
                                                            ) : (
                                                                part
                                                            )
                                                        ))
                                                    ) : (
                                                        cat.origin
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col rounded-[12px] gap-3 bg-white px-4 py-3 pb-4 shadow'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-3'>
                                                <button
                                                    className="group relative"
                                                    onClick={() => toggleLike(cat.id)}
                                                >
                                                    <FaRegHeart className="size-6 group-hover:scale-[1.03] transition-all duration-300" />
                                                    <FaHeart
                                                        className={`size-6 absolute z-10 text-red-500 top-0 opacity-0 ${likedCat[cat.id] && '!opacity-100 scale-105'
                                                            } transition-all duration-300`}
                                                    />
                                                </button>

                                                <button
                                                    className={`group relative ${copied[cat.id] && 'cursor-default'}`}
                                                    disabled={copied[cat.id]}
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(`https://kanacat.vercel.app/cat/${cat.id}`)
                                                        toast('Link copied to clipboard')
                                                        setCopied((prev) => ({ ...prev, [cat.id]: true }))
                                                        setTimeout(() => setCopied((prev) => ({ ...prev, [cat.id]: false })), 3000)
                                                    }}>
                                                    <span className={`size-6 absolute left-0 top-0 ${copied[cat.id] ? 'translate-y-0.5 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-300 font-medium`}>
                                                        Copied
                                                    </span>
                                                    <RxLink2 className={`size-7 group-hover:scale-[1.03] transition-all duration-300 ${copied[cat.id] ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`} />
                                                </button>
                                            </div>

                                            <FaRegBookmark className='size-6' />
                                        </div>

                                        <div className='flex items-center gap-3 -mb-2'>
                                            {isFetched ? (
                                                <span className='font-semibold'>
                                                    {likeCount} Likes
                                                </span>
                                            ) : (
                                                <div className='flex items-center gap-1'>
                                                    <FaCircle className='size-1.5 text-black animate-bounce' />
                                                    <FaCircle className='size-1.5 text-black animate-bounce' style={{ animationDelay: '0.2s' }} />
                                                    <FaCircle className='size-1.5 text-black animate-bounce' style={{ animationDelay: '0.4s' }} />
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex flex-col gap-3'>
                                            <p className='line-clamp-2 text-[16px] text-gray-500 break-words'>
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
                                        <Button className='w-full h-[50px] rounded-[12px] !bg-black mt-7 hover:!bg-primary transition-all duration-300' size={"lg"} asChild>
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



        </section >
    )
}

export default CatCard
