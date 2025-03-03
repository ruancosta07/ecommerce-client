"use client"
import { Product } from '@/types/Product'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Mousewheel } from 'swiper/modules'
import clsx from 'clsx'
import { Dot, Heart, List, MessageSquareHeartIcon, ShoppingCart, Star, Tags } from 'lucide-react'
import ReactMarkdown from "react-markdown"
import { useUser } from '@/store/User'
import { redirect, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import DayJs from '@/utils/Dayjs'
import Products from '@/app/_components/Products'
import { useGlobal } from '@/store/Global'
import { SwiperOptions } from 'swiper/types'
const SingleProduct = ({ id, name, description, images, price, reviews, tags, section }: Product) => {
    const [activeImage, setActiveImage] = useState<number>(0)
    const [isMounted, setIsMounted] = useState(false)
    const { setCart, signed, setLastRoute } = useUser()
    const { isMobile } = useGlobal()
    const [similarProducts, setSimilarProducts] = useState<Product[]>([])
    const discount = useMemo(() => {
        const percent = price * 0.1
        return +Math.fround((price - percent) / 10).toFixed(2)
    }, [price])
    const pathname = usePathname()
    const [scroll, setScroll] = useState(0)

    useEffect(()=> {
        setIsMounted(true)
    },[])

    async function addItemToCart(id: string) {
        if (!signed) {
            setLastRoute(pathname)
            redirect("/login")
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/cart/add`, {
                method: "POST",
                body: JSON.stringify({ id }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
                }
            })
            if (!response.ok) {
                return
            }
            const data = await response.json()
            setCart(data)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        async function loadSimilarProducts(): Promise<Product[] | void> {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/products/`, {
                    method: "GET",
                    cache: "no-store"
                })
                if (!response.ok) {
                    return
                }
                const data: Product[] = await response.json()
                const clearTags = new Set(tags?.filter((t) => !t.includes("oferta-do-dia")))
                const similarProducts = data.filter((p) => {
                    if (p.id === id || !p.tags) return false;

                    return p.tags.some(tag => clearTags.has(tag));
                });
                setSimilarProducts(similarProducts)
            } catch (err) {
                console.log(err)
            }
        }
        loadSimilarProducts()
    }, [id, tags, section])

    const breakpoints: SwiperOptions["breakpoints"] = {
        1024: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        0: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
    };

    const totalRate = useMemo(() => {
        if (reviews) {
            return +(reviews.reduce((acc, review) => acc + Math.floor(review.rating) / reviews.length, 0)).toFixed(1)
        }
    }, [reviews])

    useEffect(()=> {
        function changeScroll(){
            setScroll(scrollY)
        }
        window.addEventListener("scroll", changeScroll)
        return ()=> window.removeEventListener("scroll", changeScroll)
    },[])

    return (
        <>
            <section className='grid lg:grid-cols-[.15fr_.65fr_.35fr] gap-[1rem] lg:gap-[2rem]'>
                <Swiper direction={isMobile ? "horizontal" : "vertical"} breakpoints={breakpoints} touchEventsTarget='container' simulateTouch mousewheel={{ forceToAxis: true }} modules={[Mousewheel]} className="h-[150px] sm:h-[300px] lg:h-[500px] 2xl:h-[600px] w-full max-lg:order-2 ">
                    {images.map((link, index) => <SwiperSlide key={index} onClick={() => setActiveImage(index)}>
                        <Image
                            src={link}
                            alt={name}
                            width={150}
                            height={150}
                            className={clsx(
                                "object-cover h-full w-full duration-200 rounded-[2rem]",
                                {
                                    "brightness-50": activeImage !== index,
                                }
                            )}
                        />
                    </SwiperSlide>)}
                </Swiper>
                <div>
                    <Image src={images[activeImage]} alt={name} width={400} height={400} className=' h-[40rem] lg:h-[50rem] 2xl:h-[60rem] w-full object-cover rounded-[3rem]' />
                </div>
                {<div className={clsx('max-lg:fixed max-lg:left-0 max-lg:bottom-0 max-lg:z-[3] max-lg:bg-zinc-900 max-lg:dark:bg-zinc-900 max-lg:p-[3rem] max-lg:w-full', {
                    "max-lg:hidden" : isMounted && scroll >= innerHeight / 8
                })}>
                    <h1 className='text-[3rem] text-zinc-900 dark:text-zinc-100 font-semibold'>{name}</h1>
                    <div className="flex items-center gap-[.3rem] mt-[.4rem]">
                        {totalRate ?
                            <>
                                {Array.from({ length: +totalRate }).map((s, i) => <Star key={i} className='size-[1.8rem] dark:fill-zinc-100 dark:text-zinc-100 text-zinc-900' />)}
                                {Array.from({ length: 5 - +totalRate }).map((s, i) => <Star key={i} className='size-[1.8rem] dark:fill-zinc-100 dark:text-zinc-100 text-zinc-900' />)}
                            </>
                            : <Star className='size-[1.8rem] dark:fill-zinc-100 dark:text-zinc-100 text-zinc-900' />
                        }

                        <span className='text-[1.8rem] font-medium text-zinc-900 dark:text-zinc-100'>{totalRate?.toFixed(1)}</span>
                        <Dot className='text-zinc-900 dark:text-zinc-100'/>
                        <span className='text-[1.6rem] text-zinc-900 dark:text-zinc-100'>{reviews?.length} avaliações</span>
                    </div>
                    <span className='text-[2rem] font-medium mt-[1.2rem] mb-[.4rem] block text-zinc-900 dark:text-zinc-100'>R$ {price}</span>
                    <p className='text-[1.4rem] leading-[1.3] text-zinc-900 dark:text-zinc-100'>À vista no pix com até 5% off Em até 10x de R$ {discount} sem juros no cartão ou em 1x de {(discount * 10).toFixed(2)} com 5% off</p>
                    <div className="flex items-center gap-[1rem]">
                        <button onClick={() => addItemToCart(id)} className='bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.6rem] font-medium p-[1.2rem] mt-[1.2rem] rounded-[.6rem] w-full flex items-center gap-[.6rem] justify-center'>
                            Adicionar ao carrinho
                            <ShoppingCart className='size-[2rem]' />
                        </button>
                        <button className='bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.6rem] font-medium p-[1rem] mt-[1.2rem] rounded-[.6rem]'><Heart className='size-[2.3rem]' /></button>
                    </div>
                </div>}
                
            </section>
            <section className='mt-[10vh]'>
                <div className="flex items-center gap-[1rem] text-zinc-900 dark:text-zinc-100">
                    <List className='' />
                    <h1 className='text-[2rem] lg:text-[3rem] font-semibold'>Descrição do produto</h1>
                </div>
                <div className='prose text-zinc-900 dark:text-zinc-100 lg:max-w-[80%] max-md:prose-h1:text-[1.8rem] prose-h1:font-semibold prose-h1:leading-[1.15] text-[1.6rem] mt-[1.2rem] prose-invert max-w-none prose-h2:text-[1.4rem] prose-p:text-[1.8rem] prose-p:leading-[1.3]'>
                    <ReactMarkdown className={"react-mk"}>{description}</ReactMarkdown>
                </div>
            </section>
            <section className='mt-[10vh]'>
                <div className="flex items-center gap-[1rem] mb-[1.2rem] text-zinc-900 dark:text-zinc-100">
                    <MessageSquareHeartIcon className='' />
                    <h1 className='text-[2rem] lg:text-[3rem] font-semibold'>Avaliações do produto</h1>
                </div>
                <div className='grid lg:grid-cols-3 gap-[1rem]'>
                    {reviews && reviews.map((r) => {
                        const rate = Math.floor(r.rating)
                        const stars = Array.from({ length: rate })
                        const remanecentStars = Array.from({ length: 5 - rate })
                        return (<div key={r.id} className='border border-zinc-300 dark:border-zinc-700/70 p-[1rem] rounded-[.5rem]'>
                            <div className='flex items-center gap-[1rem] mb-[.4rem]'>
                                <Image src={r.user?.avatar as string} alt={`Foto de perfil de ${r.user?.name}`} width={30} height={30} className='rounded-full object-cover size-[3rem]' />
                                <span className='text-[1.6rem] text-zinc-900 dark:text-zinc-100'>{r.user?.name}</span>
                            </div>
                            <div className="flex gap-[.3rem] mb-[.4rem]">
                                {stars.map((r, i) => <Star className='text-zinc-900 dark:fill-zinc-100 fill-zinc-900 dark:text-zinc-100 size-[2rem]' key={i} />)}
                                {remanecentStars.map((r, i) => <Star className=' fill-zinc-900 text-zinc-900 dark:text-zinc-100 size-[2rem]' key={i} />)}
                            </div>
                            <p className='text-[1.2rem] mt-[.6rem] text-zinc-700 dark:text-zinc-300'>Avaliado em {DayJs(r.createdAt).utc().format("DD/MM/YYYY")}</p>
                            <div className='mt-[1.2rem]'>
                                <h1 className='text-[1.6rem] lg:text-[2rem] font-semibold mb-[.4rem] text-zinc-900 dark:text-zinc-100'>{r.title}</h1>
                                <p className='text-[1.2rem] lg:text-[1.4rem] text-zinc-900 dark:text-zinc-100'>{r.comment}</p>
                            </div>
                        </div>)
                    })}
                </div>
            </section>
            <section className='mt-[10vh]'>
                <div className="flex items-center gap-[1rem] mb-[1.2rem] text-zinc-900 dark:text-zinc-100">
                    <Tags className='' />
                    <h1 className='text-[2rem] lg:text-[3rem] font-semibold'>Produtos similares</h1>
                </div>
                <Products products={similarProducts} />
            </section>
        </>
    )
}

export default SingleProduct
