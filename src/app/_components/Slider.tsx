"use client"
import Image from 'next/image'
import React from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useGlobal } from '@/store/Global'

const Slider = () => {
    const { isMobile } = useGlobal()
    return (
        <section className=''>
            <Swiper
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: true,
                }}
                spaceBetween={10}
                loop
                modules={[Autoplay]}
                className="container-width h-[25vh] lg:h-[50vh]"
            >
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <div className='absolute left-8 top-2/4 lg:top-[50%] -translate-y-2/4 z-[1]'>
                            <span className='text-zinc-300 text-[1.2rem] lg:text-[2rem] leading-none'>#OfertaEcommerce</span>
                            <h1 className='text-zinc-100 text-[2rem] lg:text-[6rem] font-bold leading-[1.3] lg:leading-[1.1] mb-[.4rem] lg:mb-[1rem]'>Descontos de até 30% <br /> em camisas</h1>
                            <button className='bg-zinc-100 text-zinc-900 p-[.8rem] text-[1.2rem] lg:text-[1.6rem] font-medium rounded-[.6rem] flex items-center gap-[.6rem]'>
                                Aproveitar oferta
                            </button>
                        </div>
                        <Image
                            src={"/banner-1.webp"}
                            priority
                            alt='Banner de camisas'
                            width={isMobile ? 315 : 1000}
                            height={isMobile ? 315 : 1000}
                            fetchPriority='high'
                            loading='eager'
                            className='rounded-[4rem] w-full h-full object-cover'
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent rounded-[4rem]"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <div className='absolute left-8 top-2/4 lg:top-[50%] -translate-y-2/4 z-[1]'>
                            <span className='text-zinc-300 text-[1.2rem] lg:text-[2rem] leading-none'>#OfertaEcommerce</span>
                            <h1 className='text-zinc-100 text-[2rem] lg:text-[6rem] font-bold leading-[1.3] lg:leading-[1.1] mb-[.4rem] lg:mb-[1rem]'> Descontos de até 20% <br /> em bolsas</h1>
                            <button className='bg-zinc-100 text-zinc-900 p-[.8rem] text-[1.2rem] lg:text-[1.6rem] font-medium rounded-[.6rem] flex items-center gap-[.6rem]'>
                                Aproveitar oferta
                            </button>
                        </div>
                        <Image
                            src={"/banner-2.webp"}
                            alt='Banner de roupas'
                            width={isMobile ? 315 : 1000}
                            height={isMobile ? 315 : 1000}
                            className='rounded-[4rem] w-full h-full object-cover'
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent rounded-[4rem]"></div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <div className='absolute left-8 top-2/4 lg:top-[50%] -translate-y-2/4 z-[1]'>
                            <span className='text-zinc-300 text-[1.2rem] lg:text-[2rem] leading-none'>#OfertaEcommerce</span>
                            <h1 className='text-zinc-100 text-[2rem] lg:text-[6rem] font-bold leading-[1.3] lg:leading-[1.1] mb-[.4rem] lg:mb-[1rem]'>Descontos de até 20% <br /> em sapatos</h1>
                            <button className='bg-zinc-100 text-zinc-900 p-[.8rem] text-[1.2rem] lg:text-[1.6rem] font-medium rounded-[.6rem] flex items-center gap-[.6rem]'>
                                Aproveitar oferta
                            </button>
                        </div>
                        <Image
                            src={"/banner-3.webp"}
                            alt='Banner de um sapato'
                            width={isMobile ? 315 : 1000}
                            height={isMobile ? 315 : 1000}
                            className='rounded-[4rem] w-full h-full object-cover'
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent rounded-[4rem]"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <div className='absolute left-8 top-2/4 lg:top-[50%] -translate-y-2/4 z-[1]'>
                            <span className='text-zinc-300 text-[1.2rem] lg:text-[2rem] leading-none'>#OfertaEcommerce</span>
                            <h1 className='text-zinc-100 text-[2rem] lg:text-[6rem] font-bold leading-[1.3] lg:leading-[1.1] mb-[.4rem] lg:mb-[1rem]'>Descontos de até 15% <br /> em calças</h1>
                            <button className='bg-zinc-100 text-zinc-900 p-[.8rem] text-[1.2rem] lg:text-[1.6rem] font-medium rounded-[.6rem] flex items-center gap-[.6rem]'>
                                Aproveitar oferta
                            </button>
                        </div>
                        <Image
                            src={"/banner-4.webp"}
                            alt='Banner de um conjunto de roupas'
                            width={isMobile ? 315 : 1000}
                            height={isMobile ? 315 : 1000}
                            className='rounded-[4rem] w-full h-full object-cover'
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent rounded-[4rem]"></div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}

export default Slider