"use client"
import { useUser } from '@/store/User'
import { Product, Reviews } from '@/types/Product'
import { Heart, ShoppingCart, Star, StarsIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { MouseEvent, useEffect, useState } from 'react'
import Message, { useMessage } from './Message'
import Cookies from 'js-cookie'
import clsx from 'clsx'
import Progress, { useProgress } from './Progress'
const ForYou = ({ products }: { products: Product[] }) => {
    const { favorites, signed, setFavorites, setCart, cart } = useUser()
    const { message, setMessage } = useMessage()
    const [isHover, setIsHover] = useState<string | null>(null)
    const {disable, setDisable} = useProgress()
    const [sliceQuantity, setSliceQuantity] = useState(8)
    useEffect(()=> {
        setDisable(false)
    },[setDisable])

    async function addItemToCart(e: MouseEvent<HTMLButtonElement>, id: string) {
        e.preventDefault()
        if (!signed) {
            redirect("/login")
        }
        setDisable(true)
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
        e.preventDefault()
        if (!signed) {
            return redirect("/login")
        }
        setDisable(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/favorites/add/${id}`, {
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

    return (
        <>
            <section className=' bg-zinc-800/70 py-[4rem]'>
                <div className='container-width'>
                <div className="flex items-center gap-[1rem] mb-[1.2rem]">
                    <StarsIcon className='size-[2rem] lg:size-[2rem]'/>
                    <h1 className='text-[2rem] lg:text-[4rem] font-semibold'>Para você</h1>
                </div>
                <div className='grid  xl:grid-cols-4 gap-[2rem]'>
                    {products.filter((p)=> !p.tags?.includes("oferta-do-dia")).map((p, i) => {
                        const reviews = p.reviews as Reviews[]
                        const totalRate = +(reviews.reduce((acc, review) => acc + Math.floor(review.rating) / reviews.length, 0)).toFixed(1)
                        return (
                            <Link aria-label='Acessar página do produto' href={`/produto/${p.id}`} key={p.id} className='' >
                                <div className='overflow-hidden relative rounded-[2rem]'>
                                    <button aria-label={favorites.find((f)=> f.id === p.id) ? "Remover produto dos favoritos" : "Adicionar produto aos favoritos"} onClick={(e) => addItemToFavorites(e, p.id)} className='absolute right-2 top-2 z-[2] bg-zinc-300 dark:bg-zinc-800 p-[1rem] rounded-full'>
                                        <Heart className={clsx("size-[2.6rem]", {
                                            "text-rose-500 fill-rose-500": favorites.some((f) => f.id === p.id),
                                        })} />
                                    </button>
                                    <Image priority={i === 0} onMouseOver={() => setIsHover(p.id)} onMouseLeave={() => setIsHover(null)} src={p.images[0]} alt={p.name} width={300} height={300} className={clsx('h-[260px] w-full object-cover ease-in-out block duration-500 rounded-[2rem]', {
                                        "scale-[1.15]": isHover === p.id,
                                        "scale-100": !isHover,
                                    })} />
                                </div>
                                <h1 className='text-[2rem] mt-[1.2rem] font-semibold'>{p.name}</h1>
                                <div className='flex items-center gap-[.3rem] mt-[.2rem] mb-[.6rem]'>
                                    <Star className='fill-zinc-100 size-[2rem]' />
                                    <span className='text-[1.6rem]'>{totalRate > 0 && reviews.length > 0 ? totalRate : "Nenhuma avaliação"}</span>
                                </div>
                                <span className='text-[1.6rem] font-semibold  block'>
                                    R$ {p.price.toFixed(2)}
                                </span>
                                <button aria-label={cart.find((f)=> f.id === p.id) ? "Remover produto do carrinho" : "Adicionar produto ao carrinho"} onClick={(e) => addItemToCart(e, p.id)} className='mt-[1.2rem] text-center w-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.5rem] p-[1rem] font-medium rounded-[1rem] flex items-center gap-[1rem] justify-center'>
                                    <ShoppingCart className='size-[1.6rem]'/>
                                    Adicionar ao carrinho
                                </button>
                            </Link>
                        )
                    })}
                </div>
                </div>
            </section>
            <Message message={message} setMessage={setMessage} className={"fixed z-[4]"} />
        </>
    )
}

export default ForYou
