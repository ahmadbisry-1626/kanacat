"use client"

import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Button } from './ui/button'

gsap.registerPlugin(ScrollTrigger)

const HeroSection = () => {
    const imgRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const elemen = imgRef.current;
        const revealElemen = revealRef.current;

        if (!revealElemen || !elemen) return;

        const { left, top, width, height } = elemen.getBoundingClientRect();
        const mouseX = (e.clientX - left) / width * 100;
        const mouseY = (e.clientY - top) / height * 100;

        const polygonPoints = `
            ${mouseX - 2}% ${mouseY - 2}%,
            ${mouseX + 3}% ${mouseY - 3}%,
            ${mouseX + 1}% ${mouseY + 4}%,
            ${mouseX - 1}% ${mouseY + 4}%
        `;

        gsap.to(revealElemen, {
            opacity: 1,
            clipPath: `polygon(${polygonPoints})`,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        const revealElemen = revealRef.current;

        gsap.to(revealElemen, {
            opacity: 0,
            clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    useGSAP(() => {
        ScrollTrigger.matchMedia({
            "(min-width: 768px)": () => {
                gsap.set('.animation-clip', {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                });

                gsap.from('.animation-clip', {
                    scrollTrigger: {
                        trigger: '#clip',
                        start: 'center center',
                        end: '+=1000 center',
                        scrub: 0.5,
                        pin: true,
                        pinSpacing: true,
                    },
                    clipPath: 'polygon(64% 90%, 61% 32%, 86% 15%, 93% 49%)',
                    transformPerspective: 1000,
                    ease: 'power2.inOut',
                });
            },

            "(max-width: 767px)": () => {
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
                gsap.set('.animation-clip', {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                });
            },
        });
    });

    useGSAP(() => {
        ScrollTrigger.matchMedia({
            "(max-width: 768px)": () => {
                gsap.set('.animation-clip-mobile', {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                });

                gsap.from('.animation-clip-mobile', {
                    scrollTrigger: {
                        trigger: '#clip',
                        start: 'center center',
                        end: '+=1000 center',
                        scrub: 0.5,
                        pin: true,
                        pinSpacing: true,
                    },
                    clipPath: 'polygon(39% 12%, 66% 20%, 55% 49%, 34% 35%)',
                    transformPerspective: 1000,
                    ease: 'power2.inOut',
                });
            },
        });
    });



    return (
        <section className={`w-full min-h-screen relative flex items-end md:items-center overflow-hidden`} id="clip" ref={imgRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {/* IMAGE ON MD LARGER */}
            <div className='absolute size-full animation-clip md:block hidden z-10'>
                <Image src="/img/cat.jpg" alt='' width={1000} height={1000} sizes='100vw' className='absolute left-0 top-0 size-full object-cover' />

                <div className='absolute top-40 md:left-12 lg:left-20'>
                    <h1 className='text-black md:text-[3.5rem] lg:text-[5rem] font-bold leading-[1]'>Welcome to <br /> the cat's world</h1>
                </div>
            </div>

            {/* IMAGE ON MOBILE */}
            <div className='absolute size-full animation-clip-mobile md:hidden block z-10'>
                <Image src="/img/cat-mobile.jpg" alt='' width={1000} height={1000} sizes='100vw' className='absolute left-0 top-0 size-full object-cover' />

                <div className='absolute bottom-10 left-1/2 -translate-x-1/2 w-full'>
                    <h1 className='text-white text-[2.5rem] font-bold leading-[1] text-center'>
                        Welcome to <br /> the cat's world
                    </h1>
                </div>
            </div>
            <div className='absolute size-full md:hidden block mask-clip-path-1'>
                <Image src="/img/cat-mobile.jpg" alt='' width={1000} height={1000} sizes='100vw' className='absolute left-0 top-0 size-full object-cover' />
            </div>
            <div className='absolute size-full md:hidden block mask-clip-path-2'>
                <Image src="/img/cat-mobile.jpg" alt='' width={1000} height={1000} sizes='100vw' className='absolute left-0 top-0 size-full object-cover' />
            </div>
            <div className='absolute size-full md:hidden block mask-clip-path-3'>
                <Image src="/img/cat-mobile.jpg" alt='' width={1000} height={1000} sizes='100vw' className='absolute left-0 top-0 size-full object-cover' />
            </div>

            <div className='absolute size-full opacity-0 md:block hidden z-10' ref={revealRef}>
                <Image src="/img/cat.jpg" alt='' width={1000} height={1000} sizes='100vw' className='absolute left-0 top-0 size-full object-cover' />
            </div>

            <div className='absolute w-full h-full md:block hidden'>
                <Image src="/img/cat-cropped.png" alt='' width={1000} height={1000} sizes='100vw' className='absolute size-full object-cover max-md:object-right' />
            </div>

            <div className='absolute top-4 md:inset-x-12 lg:inset-x-20 z-20'>
                <nav className='flex items-center gap-2 py-1 max-md:px-4'>
                    <div className='flex items-end gap-2'>
                        <Image src='/img/black.png' width={40} height={40} alt='logo' sizes='100vw' />
                        <span className='font-medium text-[18px]'>KanaCat</span>
                    </div>
                </nav>
            </div>

            <div className='flex flex-col max-md:items-center leading-[1.2] lg:px-20 md:px-12 px-5 max-md:-translate-y-10 max-md:text-center'>
                <span className='font-medium md:text-[18px] lg:text-[20px] text-[18px] mb-3 md:block hidden'>Explore breeds, traits, and care tips.</span>
                <h1 className='lg:text-[4rem] md:text-[3rem] text-[2.5rem] font-bold leading-[1]'>
                    Find Purrfect <br /> Guide to Cats
                </h1>
                <p className='md:max-w-md mt-5 leading-relaxed md:text-[18px] md:block hidden text-gray-500'>
                    Whether you're a cat lover or looking to adopt, our website offers a comprehensive guide to cat breeds, their personalities, health, grooming needs, and more.
                </p>
                <p className='md:max-w-md mt-5 leading-relaxed md:text-[18px] block md:hidden'>
                    Our website offers a comprehensive guide to cat breeds, their personalities, health, grooming needs, and more.
                </p>
                <div className='flex items-center gap-3 mt-6'>
                    <Button className='h-[54px] rounded-[12px] bg-black md:text-lg font-semibold' size={"lg"}>
                        67+ Breeds
                    </Button>
                    <Button className='h-[54px] rounded-[12px] bg-black md:text-lg font-semibold' size={"lg"}>
                        From catapi.com
                    </Button>
                </div>
            </div>

        </section>
    )
}

export default HeroSection
