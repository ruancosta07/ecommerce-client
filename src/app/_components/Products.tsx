"use client"
import { Product, Reviews } from '@/types/Product'
import Image from 'next/image'
import Link from 'next/link'
import React, { MouseEvent, useEffect, useState } from 'react'
import clsx from 'clsx'
import { redirect, usePathname } from 'next/navigation'
import { useUser } from '@/store/User'
import Cookies from 'js-cookie'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import Message, { useMessage } from './Message'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { SwiperOptions } from 'swiper/types'
import DayJs from '@/utils/Dayjs'
import Progress, { useProgress } from './Progress'
type BreakpointsOptions = Pick<SwiperOptions, "breakpoints">


const Products = ({ products, }: { products: Product[], }) => {
    const pathname = usePathname()
    const [isHover, setIsHover] = useState<null | string>(null)
    const { signed, setCart, favorites, setFavorites,cart } = useUser()
    const { message, setMessage } = useMessage()
    const [isLoading, setIsLoading] = useState(true)
    const { disable, setDisable } = useProgress()
    useEffect(() => {
        setIsLoading(false)
    }, [])

    async function addItemToCart(e: MouseEvent<HTMLButtonElement>, id: string) {
        setDisable(true)
        e.preventDefault()
        e.stopPropagation()
        if (!signed) {
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
            setMessage({
                title: "Item adicionado ao carrinho",
                position: "bottom-right",
                type: "success",
                message: "O item foi adicionado com sucesso, cheque seu carrinho para ver a alteração"
            })
        } catch (error) {
            console.log(error)
        }

    }

    async function addItemToFavorites(e: MouseEvent<HTMLButtonElement>, id: string) {
        setDisable(true)
        e.preventDefault()
        e.stopPropagation()
        if (!signed) {
            return redirect("/login")
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/favorites/add/` + id, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
                }
            })
            if (!response.ok) {
                return
            }
            const data = await response.json()
            setFavorites(data)
        } catch (err) {
            console.log(err)
        }
    }
    const breakpoints: BreakpointsOptions["breakpoints"] = {
        200: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        },
        1440: {
            slidesPerView: 4
        }
    }

    // if (isLoading) {
    //     return <></>
    // }


    return (
        <>
            <Swiper spaceBetween={20} breakpoints={breakpoints} className="">
                {products.map((p, i) => {
                    const reviews = p.reviews as Reviews[]
                    const totalRate = +(reviews.reduce((acc, review) => acc + Math.floor(review.rating) / reviews.length, 0)).toFixed(1)                    
                    return (
                        <SwiperSlide key={p.id}>
                            <Link aria-label='Acessar página do produto'  onClick={() => setDisable(false)} href={`/produto/${p.id}`} className='' >
                                <div className='overflow-hidden relative rounded-[2rem]'>
                                    <button aria-label={favorites.find((f)=> f.id === p.id) ? "Remover produto dos favoritos" : "Adicionar produto aos favoritos"} onClick={(e) => addItemToFavorites(e, p.id)} data-disable-nprogress={true} className='absolute right-2 top-2 z-[2] bg-zinc-300 dark:bg-zinc-800 p-[1rem] rounded-full'>
                                        <Heart className={clsx("size-[2.6rem]", {
                                            "text-rose-500 fill-rose-500": favorites.some((f) => f.id === p.id),
                                        })} />
                                    </button>
                                    <Image fetchPriority='high' onMouseOver={() => setIsHover(p.id)} onMouseLeave={() => setIsHover(null)} src={p.images[0]} alt={p.name} width={300} height={300} className={clsx('h-[260px] w-full object-cover ease-in-out block duration-500 rounded-[2rem]', {
                                        "scale-[1.15]": isHover === p.id,
                                        "scale-100": !isHover,
                                    })} />
                                </div>
                                <h1 className='text-[2rem] mt-[1.2rem]'>{p.name}</h1>
                                <div className='flex items-center gap-[.3rem] mt-[.2rem] mb-[.6rem]'>
                                    <Star className='fill-zinc-100 size-[1.8rem]' />
                                    <span className='text-[1.6rem]'>{totalRate > 0 && reviews.length > 0 ? totalRate : "Nenhuma avaliação"}</span>
                                </div>
                                <span className='text-[1.6rem] font-semibold  block'>
                                    R$ {p.price.toFixed(2)}
                                </span>
                                <button aria-label={cart.find((f)=> f.id === p.id) ? "Remover produto do carrinho" : "Adicionar produto ao carrinho"} onClick={(e) => addItemToCart(e, p.id)} data-disable-nprogress={true} className='mt-[1.2rem] text-center w-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.5rem] p-[1rem] font-medium rounded-[1rem] flex items-center gap-[1rem] justify-center'>
                                    <ShoppingCart className='size-[1.6rem]' />
                                    Adicionar ao carrinho
                                </button>
                            </Link>
                        </SwiperSlide>)
                }
                )}
            </Swiper>
            <Message message={message} setMessage={setMessage} className={"fixed z-[4]"} />
            {/* <Progress disabled={disable} /> */}
        </>
    )
}

export default Products
