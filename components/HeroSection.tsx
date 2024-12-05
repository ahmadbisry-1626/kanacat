"use client"

import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import React, { useRef } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Button } from './ui/button';

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

        // Reset Polygon Reveal
        gsap.to(revealElemen, {
            opacity: 0,
            clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    useGSAP(() => {
        gsap.set('.animation-clip', {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
        });

        gsap.from('.animation-clip', {
            scrollTrigger: {
                trigger: '#clip',
                start: 'center center',
                end: '+=1000 center',
                scrub: 0.5,
                pin: true,
                pinSpacing: true
            },
            clipPath: 'polygon(64% 90%, 61% 32%, 86% 15%, 93% 49%)',
            transformPerspective: 1000,
            ease: 'power2.inOut',
        });
    });

    return (
        <section className="w-screen min-h-dvh relative flex items-center overflow-hidden" id="clip" ref={imgRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className='absolute size-full animation-clip md:block hidden'>
                <Image src="/img/cat.jpg" alt='' width={1000} height={1000} sizes='100vw' className='absolute left-0 top-0 size-full object-cover' />

                <div className='absolute top-40 md:left-12 lg:left-20'>
                    <h1 className='text-black md:text-[3.5rem] lg:text-[5rem] font-bold leading-[1]'>Welcome to <br /> the cat's world</h1>
                </div>
            </div>

            <div className='absolute size-full opacity-0 md:block hidden' ref={revealRef}>
                <Image src="/img/cat.jpg" alt='' width={1000} height={1000} sizes='100vw' className='absolute left-0 top-0 size-full object-cover' />
            </div>

            <div className='absolute w-full h-full md:block hidden'>
                <Image src="/img/cat-cropped.png" alt='' width={1000} height={1000} sizes='100vw' className='absolute size-full object-cover' />
            </div>

            <div className='absolute top-4 md:inset-x-12 lg:inset-x-20 py-3'>
                <nav className='flex items-center gap-2'>
                    <div className='flex items-end gap-2'>
                        <Image src='/img/black.png' width={40} height={40} alt='logo' sizes='100vw' />
                        <span className='font-medium text-[18px]'>KanaCat</span>
                    </div>
                </nav>
            </div>

            <div className='flex flex-col leading-[1.2] lg:px-20 md:px-12'>
                <span className='text-primary md:text-[18px] lg:text-[20px] mb-3'>Explore breeds, traits, and care tips.</span>
                <h1 className='lg:text-[4rem] md:text-[3rem] font-semibold'>
                    Find Purrfect <br /> Guide to Cats
                </h1>
                <p className='max-w-md mt-7 leading-relaxed'>
                    Whether you're a cat lover or looking to adopt, our website offers a comprehensive guide to cat breeds, their personalities, health, grooming needs, and more.
                </p>
                <Button className='mt-7 w-fit h-[50px] rounded-full max-md:text-sm' size={"lg"}>Find Cat</Button>
            </div>
        </section>
    )
}

export default HeroSection
