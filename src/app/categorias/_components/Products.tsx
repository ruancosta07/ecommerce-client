"use client"
import { useUser } from '@/store/User'
import { Product, Reviews } from '@/types/Product'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import Message, { useMessage } from '../../_components/Message'
import Cookies from 'js-cookie'
import clsx from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider, useSlider } from '@/app/_components/ui/slider'

type OrderProducts = "Padrão" | "Preço decrescente" | "Preço crescente"

const Products = ({ products, total, totalPages, clearProducts }: { products: Product[], total: number; totalPages: number; clearProducts: Product[] }) => {
    const { favorites, signed, setFavorites, setCart, cart } = useUser()
    const { message, setMessage } = useMessage()
    const [isHover, setIsHover] = useState<string | null>(null)
    const { slider, setSlider, max, setMax } = useSlider()
    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const category = params.get("categoria")
    const page = params.get("pagina")
    const limit = params.get("limite")
    const maxPrice = params.get("max")
    const minPrice = params.get("min")
    const orderParam = params.get("order")
    const timeOut = useRef<NodeJS.Timeout | null>(null)
    const [activeOrder, setActiveOrder] = useState<OrderProducts>("Padrão")

    useEffect(() => {
        if (orderParam === "desc") {
            setActiveOrder("Preço decrescente")
        }
        else if (orderParam === "asc") {
            setActiveOrder("Preço crescente")
        }
        else {
            setActiveOrder("Padrão")
        }
    }, [orderParam])

    useEffect(() => {
        if (products.length > 0) {
            const maxValue = Math.max(...clearProducts.map((product) => (product.price)))
            if (maxPrice && minPrice) {
                setMax(maxValue)
                setSlider([+minPrice, +maxPrice])
            }
            else {
                setMax(maxValue)
                setSlider([0, maxValue])
            }
        }
    }, [products, setSlider, setMax, maxPrice, minPrice, clearProducts])

    async function addItemToCart(e: MouseEvent<HTMLButtonElement>, id: string) {
        e.preventDefault()
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
            console.log(data)
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

    function sortByPrice(order: OrderProducts) {
        const actualParams = `${pathname}?${params.toString()}`
        if (!orderParam) {
            if (order === "Preço crescente") {
                router.push(`${actualParams.toString()}&order=asc`)
            }
            else if (order === "Preço decrescente") {
                router.push(`${actualParams.toString()}&order=desc`)
            }
            else {

            }
        }
        else {
            if (order === "Preço crescente") {
                router.replace(`${actualParams.toString().replace("&order=desc", "&order=asc")}`)
            }
            else if (order === "Preço decrescente") {
                router.replace(`${actualParams.toString().replace("&order=asc", "&order=desc")}`)
            }
            else {
                const updatedParams = actualParams.toString()
                    .replace(/([?&])order=[^&]*&?/, "$1")
                    .replace(/&$/, "");
                router.replace(updatedParams);

            }
        }
    }

    const orders: OrderProducts[] = ["Padrão", "Preço decrescente", "Preço crescente"]

    return (
        <>
            <section className='lg:py-[4rem]'>
                <div className='container-width grid lg:grid-cols-[.2fr_.7fr] gap-[2rem]'>
                    <aside>
                        <div className='flex flex-col'>
                            <label className='text-[1.8rem] font-semibold font-space'>
                                Intervalo de preço
                            </label>
                            <Slider className='mt-[1.2rem]' onValueChange={(e) => {
                                setSlider(e)
                            }} onValueCommit={(e) => {
                                router.push(`/categorias?categoria=${category}&pagina=${page}&limite=${limit}&min=${e[0]}&max=${e[1]}`)

                            }} max={max} slider={slider} setSlider={setSlider} />
                            <div className='flex justify-between text-[1.6rem] font-normal mt-[.8rem]'>
                                <span>R$ {slider[0]}</span>
                                <span>R$ {slider[1]}</span>
                            </div>
                        </div>
                        <div className='mt-[1.2rem] flex flex-col'>
                            <label className='text-[1.8rem] font-semibold font-space'>Ordernar por</label>
                            {orders.map((o, i) => <label key={i} className='flex items-center gap-[.6rem] text-[1.6rem] font-inter cursor-pointer'>
                                <input type='radio' className='appearance-none peer' checked={o === activeOrder} onChange={() => {
                                    setActiveOrder(o)
                                    sortByPrice(o)
                                }} name='order' />
                                <span className='bg-zinc-800 border border-zinc-100 peer-checked:bg-zinc-100 duration-200 ring-inset ring-2 ring-zinc-800 p-[.1rem] block size-[1.6rem] rounded-full'></span>
                                {o}
                            </label>)}
                        </div>
                    </aside>
                    <section className="">
                        {products.length > 0 && <>
                            <h1 className='text-[2rem] font-semibold mb-[1.2rem]'>Mostrando 1-{products.length} de {total} produtos</h1>
                            <div className='grid lg:grid-cols-3 gap-[2rem]'>
                                {products.map((p, i) => {
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
                                            <h1 className='text-[2rem] mt-[1.2rem]'>{p.name.length > 24 ? p.name.slice(0,24) + "...": p.name}</h1>
                                            <div className='flex items-center gap-[.3rem] mt-[.2rem] mb-[.6rem]'>
                                                <Star className='fill-zinc-100 size-[2rem]' />
                                                <span className='text-[1.6rem]'>{totalRate > 0 && reviews.length > 0 ? totalRate : "Nenhuma avaliação"}</span>
                                            </div>
                                            <span className='text-[1.6rem] font-semibold  block'>
                                                R$ {p.price.toFixed(2)}
                                            </span>
                                            <button aria-label={cart.find((f)=> f.id === p.id) ? "Remover produto do carrinho" : "Adicionar produto ao carrinho"} onClick={(e) => addItemToCart(e, p.id)} className='mt-[1.2rem] text-center w-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.5rem] p-[1rem] font-medium rounded-[1rem] flex items-center gap-[1rem] justify-center'>
                                                <ShoppingCart className='size-[1.6rem]' />
                                                Adicionar ao carrinho
                                            </button>
                                        </Link>
                                    )
                                })}
                            </div>
                            <div className='flex gap-[1rem] mt-[2rem] justify-center'>
                                {Array.from({ length: totalPages }).map((t, i) => (
                                    <Link className={clsx("text-[1.8rem] p-[.8rem] px-[1rem] tabular-nums rounded-[.6rem] font-medium", {
                                        "dark:bg-zinc-100 dark:text-zinc-900": i + 1 === Number(page),
                                        "dark:bg-zinc-800/70 dark:text-zinc-300": i + 1 !== Number(page),
                                    })} href={`/categorias?categoria=${category}&pagina=${i + 1}&limite=${limit}`} key={i + 1}>{i + 1}</Link>
                                ))}
                            </div>
                        </>}
                        {products.length === 0 && <>
                            <h1 className='text-[2.4rem] font-semibold tracking-tight col-span-full'>Nenhum produto encontrado com esse critério de pesquisa :(</h1>
                            <p className='text-[1.4rem] text-zinc-300' >Tente procurar de novo utilizando algum outro termo.</p>
                        </>}
                    </section>
                </div>
            </section>
            <Message message={message} setMessage={setMessage} className={"fixed z-[4]"} />
        </>
    )
}

export default Products
