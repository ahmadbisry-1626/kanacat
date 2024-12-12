"use client"

import { useCat } from '@/hook/queries'
import React, { useEffect, useRef, useState } from 'react'
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
import { Switch } from './ui/switch'
import Link from 'next/link'
import gsap from 'gsap';

const LinkCard = ({ imgUrl, name, logoName, link }: { imgUrl: string, name: string, logoName: string, link: string }) => {
    return (
        <Link href={link} target='blank' className='rounded-[12px] relative group overflow-hidden shadow xl:w-[200px] xl:h-[200px] lg:size-[200px] sm:size-[150px] md::size-[165px] w-[185px] h-[170px]'>
            <div className='size-full bg-black/40 absolute z-10 opacity-0 group-hover:opacity-100 transition-all duration-300' />
            <Image src={imgUrl} alt={name} width={800} height={800} sizes='100vw' className='absolute size-full object-cover object-center' />
        </Link>
    )
}

const WeightsSlider = ({ desc, firstValue, secondValue, metrics, min, max }: { desc: string, firstValue: number, secondValue: number, metrics: string, min: string, max: string }) => {
    return (
        <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
                <span className='md:text-[18px] font-semibold'>
                    Weights
                </span>
                <HoverCard>
                    <HoverCardTrigger className='group'>
                        <FaCircleInfo className='text-gray-400 size-4 md:size-5 group-hover:text-black transitiona-ll duration-300' />
                    </HoverCardTrigger>
                    <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none w-fit break-words'>
                        {desc}
                    </HoverCardContent>
                </HoverCard>
            </div>

            <HoverCard>
                <HoverCardTrigger className='relative'>
                    <span className='absolute left-0 bottom-0 font-semibold translate-y-8'>
                        {min}
                    </span>
                    <span className='absolute right-0 bottom-0 font-semibold translate-y-8'>
                        {max}
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

const UniqueCharacters = ({ title, desc, label, checkedTrue, breedsInfo }: { title: string, desc: string, label: string, checkedTrue: boolean, breedsInfo: string }) => {
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setChecked(checkedTrue), 800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className='flex flex-col gap-3'>
            <div className='items-center flex gap-2'>
                <span className='md:text-[18px] font-semibold'>
                    {title}
                </span>
                <HoverCard>
                    <HoverCardTrigger className='group'>
                        <FaCircleInfo className='text-gray-400 size-4 ms:size-5 group-hover:text-black transitiona-ll duration-300' />
                    </HoverCardTrigger>
                    <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none !w-96 break-words'>
                        {desc}
                    </HoverCardContent>
                </HoverCard>
            </div>
            <HoverCard>
                <HoverCardTrigger className='group flex items-center gap-2 w-max'>
                    <Switch id={title} checked={checked} />
                    <label htmlFor={title} className='font-semibold'>{label}</label>
                </HoverCardTrigger>
                <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none !w-80 break-words'>
                    {breedsInfo}
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}



const BehaviorComponent = ({ title, value, desc, style }: { title: string, value: number, desc: string, style?: string }) => {
    const [progress, setProgress] = useState(13)

    useEffect(() => {
        const timer = setTimeout(() => setProgress(value), 800)
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
                        <FaCircleInfo className='text-gray-400 size-4 sm:size-5 group-hover:text-black transitiona-ll duration-300' />
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
    const cardRef = useRef<HTMLDivElement>(null)

    const car = cat?.find((cat) => cat.id === id)

    if (isLoading) {
        return (
            <div className='w-full min-h-screen absolute top-0 left-0 flex items-center justify-center'>
                <div className='loader'/>
            </div>
        )
    }

    if (isError || !cat || !car) {
        return notFound()
    }

    const [minWeight, maxWeight] = car.weight.metric.split(" - ").map(Number)

    const cfa = (car.cfa_url?.length ?? 0) > 0
    const vca = (car.vcahospitals_url?.length ?? 0) > 0
    const vet = (car.vetstreet_url?.length ?? 0) > 0
    const wiki = (car.wikipedia_url?.length ?? 0) > 0

    const link = [
        car.cfa_url ?? "",
        car.vcahospitals_url ?? "",
        car.vetstreet_url ?? "",
        car.wikipedia_url ?? "",
    ]

    const activeLinksCount = link.filter((url) => url.length > 0).length

    const handleMouseMove = (e: any) => {
        const elemen = cardRef.current
        if (!elemen) return

        const { left, top, height, width } = elemen.getBoundingClientRect()

        const relativeX = (e.clientX - left) / width
        const relativeY = (e.clientY - top) / height

        const tiltX = (relativeY - 0.5) * 5
        const tiltY = (relativeX - 0.5) * -5

        gsap.to(elemen, {
            rotateY: tiltY,
            rotateX: tiltX,
            translateZ: (relativeY - 0.5) * 10,
            transformPerspective: 700,
            ease: 'power3.out',
            duration: 0.5,
        })

    }

    const handleMouseLeave = () => {
        const elemen = cardRef.current
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
        <div className='w-full flex flex-col gap-5 py-2 md:py-4 pb-20'>
            <div className='grid grid-cols-3 gap-5 lg:h-[250px] md:h-[550px]'>
                <div className='rounded-[12px] lg:col-span-2 col-span-3 flex items-start max-md:flex-col overflow-hidden bg-white shadow' ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
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
                            <span className='absolute right-4 top-0  text-black font-semibold text-[20px] sm:text-[24px]'>
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
                    <h1 className='text-[20px] sm:text-[24px] font-semibold'>Behavior</h1>
                    <div className='bg-white shadow rounded-[12px] px-6 py-5 grid grid-cols-2 gap-6 behavior'>
                        <BehaviorComponent title='Adaptability' value={car.adaptability} desc='How well the breed adapts to new environments (1 = low adaptability, 5 = high adaptability)' />
                        <BehaviorComponent title='Affection' value={car.affection_level} desc='How affectionate the breed is (1 = low, 5 = high)' />
                        <BehaviorComponent title='Energy' value={car.energy_level} desc='How energetic the breed is (1 = low, 5 = high)' />
                        <BehaviorComponent title='Intelligence' value={car.intelligence} desc='How intelligent the breed is (1 = low, 5 = high)' />
                        <BehaviorComponent title='Social Needs' value={car.social_needs} desc='How much social interaction the breed requires (1 = low, 5 = high)' />
                        <BehaviorComponent title='Dog Friendly' value={car.dog_friendly} desc='How well the breed gets along with dogs (1 = not dog-friendly, 5 = very dog-friendly)' />
                        <BehaviorComponent title='Kid Friendly' value={car.child_friendly} desc='How well the breed gets along with children (1 = not very child-friendly, 5 = very child-friendly)' />
                        <BehaviorComponent title='Vocalisation' value={car.vocalisation} desc='How vocal the breed is (1 = quiet, 5 = very vocal)' />
                        <BehaviorComponent title='Stranger Friendly' value={car.stranger_friendly} desc='How friendly the breed is with strangers (1 = shy, 5 = very friendly)' style='max-md:col-span-2' />
                    </div>
                </div>

                <div className='flex flex-col gap-2 max-lg:col-span-3'>
                    <h1 className='text-[20px] sm:text-[24px] font-semibold'>Physical Attributes</h1>
                    <div className='bg-white shadow rounded-[12px] px-6 py-5 physical-att'>
                        <WeightsSlider desc='The weight range in kilograms' firstValue={minWeight} secondValue={maxWeight} metrics={`${car.weight.metric} Kilogram`} min='0 KG' max='15 KG' />
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

            <div className='grid grid-cols-3 gap-7 md:gap-5 lg:h-[300px] lg:mt-6 mt-4'>
                <div className='flex flex-col gap-2 lg:col-span-2 col-span-3'>
                    <h1 className='text-[20px] sm:text-[24px] font-semibold'>Unique Characteristics</h1>
                    <div className='bg-white shadow rounded-[12px] px-6 py-5 grid sm:grid-cols-3 grid-cols-2 gap-6 unique-char'>
                        <UniqueCharacters
                            title='Experimental'
                            desc="Whether this breed is part of experimental breeding programs"
                            label={car.experimental === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.experimental === 1 ? true : false}
                            breedsInfo={car.experimental === 1
                                ? 'This is an experimental breed still under development'
                                : 'This breed is well-established and recognized'
                            } />
                        <UniqueCharacters
                            title='Rare'
                            desc="Indicates if the breed is rare"
                            label={car.rare === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.rare === 1 ? true : false}
                            breedsInfo={car.rare === 1
                                ? 'This is a rare breed, not commonly found worldwide'
                                : 'This breed is widely available and relatively common'
                            } />
                        <UniqueCharacters
                            title='Sits on Lap'
                            desc="Indicates if the breed is likely to enjoy sitting on laps"
                            label={car.lap === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.lap === 1 ? true : false}
                            breedsInfo={car.lap === 1
                                ? 'This breed enjoys sitting on laps and being close to people'
                                : 'This breed may not be as inclined to sit on laps, preferring independent interaction'
                            } />
                        <UniqueCharacters
                            title='Natural'
                            desc="Indicates if the breed is a natural breed"
                            label={car.natural === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.natural === 1 ? true : false}
                            breedsInfo={car.natural === 1
                                ? 'This breed developed naturally without significant human intervention'
                                : 'This breed is a result of selective breeding'
                            } />
                        <UniqueCharacters
                            title='Short Tail'
                            desc="Indicates if the breed has a suppressed tail"
                            label={car.suppressed_tail === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.suppressed_tail === 1 ? true : false}
                            breedsInfo={car.suppressed_tail === 1
                                ? 'This breed has a naturally short or suppressed tail'
                                : 'This breed has a normal tail length'
                            } />
                        <UniqueCharacters
                            title='Indoor'
                            desc="Indicates if the breed is suitable for indoor living"
                            label={car.indoor === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.indoor === 1 ? true : false}
                            breedsInfo={car.indoor === 1
                                ? 'This breed is well-suited for indoor living and prefers staying inside'
                                : 'This breed is adaptable to both indoor and outdoor environments'
                            } />
                        <UniqueCharacters
                            title='Short Legs'
                            desc="Indicates if the breed has short legs"
                            label={car.short_legs === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.short_legs === 1 ? true : false}
                            breedsInfo={car.short_legs === 1
                                ? 'This breed is characterized by its short legs'
                                : 'This breed has average leg length'
                            } />
                        <UniqueCharacters
                            title='Hairless'
                            desc="Indicates if the breed is hairless"
                            label={car.hairless === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.hairless === 1 ? true : false}
                            breedsInfo={car.hairless === 1
                                ? 'This breed is hairless and has a unique, smooth skin texture'
                                : 'This breed has a typical fur coat'
                            } />
                        <UniqueCharacters
                            title='Rex'
                            desc="Indicates if the breed has a rex coat (curly)"
                            label={car.rex === 1 ? 'Yes' : 'No'}
                            checkedTrue={car.rex === 1 ? true : false}
                            breedsInfo={car.rex === 1
                                ? 'This breed has a distinctive curly or wavy coat'
                                : 'This breed has a typical straight coat'
                            } />
                    </div>
                </div>

                <div className='flex flex-col max-lg:col-span-3 gap-2'>
                    <h1 className='text-[20px] sm:text-[24px] font-semibold'>Health and Care</h1>
                    <div className='bg-white rounded-[12px] px-6 py-5 shadow flex flex-col gap-3 health-care'>
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center gap-2'>
                                <span className='md:text-[18px] font-semibold'>
                                    Health Issues
                                </span>
                                <HoverCard>
                                    <HoverCardTrigger className='group'>
                                        <FaCircleInfo className='text-gray-400 size-4 sm:size-5 group-hover:text-black transitiona-ll duration-300' />
                                    </HoverCardTrigger>
                                    <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none w-fit break-words'>
                                        Indicates the breed's susceptibility to health problems
                                    </HoverCardContent>
                                </HoverCard>
                            </div>

                            <HoverCard>
                                <HoverCardTrigger className='relative'>
                                    <span className='absolute left-0 bottom-0 font-semibold translate-y-8'>
                                        Low risk
                                    </span>
                                    <span className='absolute right-0 bottom-0 font-semibold translate-y-8'>
                                        High risk
                                    </span>
                                    <Progress value={car.health_issues * 20} className='!h-3' />
                                </HoverCardTrigger>
                                <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none w-fit break-words'>
                                    Health Issues: {car.health_issues}
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                        <div className='flex flex-col gap-3 mt-10'>
                            <div className='flex items-center gap-2'>
                                <span className='md:text-[18px] font-semibold'>
                                    Hypoallergenic
                                </span>
                                <HoverCard>
                                    <HoverCardTrigger className='group'>
                                        <FaCircleInfo className='text-gray-400 size-4 sm:size-5 group-hover:text-black transitiona-ll duration-300' />
                                    </HoverCardTrigger>
                                    <HoverCardContent className='rounded-[12px] bg-black/80 text-white border-none w-fit break-words'>
                                        Indicates whether the breed is hypoallergenic
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                            <p className='font-medium bg-yellow-200'>
                                {car.hypoallergenic === 1
                                    ? 'This breed is considered hypoallergenic and may cause fewer allergic reactions'
                                    : 'This breed is not hypoallergenic and may trigger allergies in sensitive individuals'
                                }
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {activeLinksCount > 0 && (
                <div className='w-full mt-4 lg:mt-6 flex flex-col gap-2'>
                    <h1 className='text-[20px] sm:text-[24px] font-semibold'>Related Links</h1>
                    <div className='sm:flex hidden items-center gap-5 links-card'>
                        {wiki && (
                            <LinkCard imgUrl='/img/wikipedia.jpg' name='Wikipedia' logoName='W' link={car.wikipedia_url ?? '/'} />
                        )}
                        {cfa && (
                            <LinkCard imgUrl='/img/cfa.jpg' name="Cat Fanciers' Association" logoName='CF' link={car.cfa_url ?? '/'} />
                        )}
                        {vca && (
                            <LinkCard imgUrl='/img/vca.jpg' name="Veterinary Centers of America" logoName='VA' link={car.vcahospitals_url ?? '/'} />
                        )}
                        {vet && (
                            <LinkCard imgUrl='/img/vetstreet.jpg' name="Vetstreet" logoName='VS' link={car.vetstreet_url ?? '/'} />
                        )}
                    </div>

                    {/* Mobile */}
                    <div className='flex sm:hidden gap-5 flex-col links-card'>
                        <div className='flex items-center gap-5'>
                            {wiki && (
                                <LinkCard imgUrl='/img/wikipedia.jpg' name='Wikipedia' logoName='W' link={car.wikipedia_url ?? '/'} />
                            )}
                            {vet && (
                                <LinkCard imgUrl='/img/vetstreet.jpg' name="Vetstreet" logoName='VS' link={car.vetstreet_url ?? '/'} />
                            )}
                        </div>

                        <div className='flex items-center gap-5' >
                            {vca && (
                                <LinkCard imgUrl='/img/vca.jpg' name="Veterinary Centers of America" logoName='VA' link={car.vcahospitals_url ?? '/'} />
                            )}
                            {cfa && (
                                <LinkCard imgUrl='/img/cfa.jpg' name="Cat Fanciers' Association" logoName='CF' link={car.cfa_url ?? '/'} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CatDetails
