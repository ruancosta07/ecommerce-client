"use client"
import { useUser } from '@/store/User'
import { Frown, Loader2, MinusCircle, PlusCircle, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import Message, { useMessage } from '@/app/_components/Message'
import { Orders } from '@/types/User'
import DayJs from '@/utils/Dayjs'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import Link from 'next/link'
import { useGlobal } from '@/store/Global'
const Cart = () => {
    const { cart, setCart } = useUser()
    const {isMobile} = useGlobal()
    const { message, setMessage } = useMessage()
    const [couponIsInvalid, setCouponIsInvalid] = useState(false)
    const [couponApplyed, setCouponApplyed] = useState(false)
    const [couponPercentDiscount, setCouponPercentDiscount] = useState<null | number>(null)
    const [coupon, setCoupon] = useState("")
    const route = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [scroll, setScroll] = useState(0)

    useEffect(()=> {
        function changeScroll(){
            setScroll(scrollY)
        }
        window.addEventListener("scroll", changeScroll)
        return()=> window.removeEventListener("scroll", changeScroll)
    },[])

    const [totalItens, totalValue, discount] = useMemo(() => {
        if(couponPercentDiscount){
            return [
                cart.reduce((a, b) => a + b.quantity, 0),
                cart.reduce((a, b) => a + (b.price - (b.price * (couponPercentDiscount / 100))) * b.quantity, 0),
                cart.reduce((a, b) => a + (b.price * (couponPercentDiscount / 100)) * b.quantity, 0),
            ]
        }
        else{
            return [
                cart.reduce((a, b) => a + b.quantity, 0),
                cart.reduce((a, b) => a + b.price * b.quantity, 0),
                cart.reduce((a, b) => a + b.price * b.quantity, 0),
            ]
        }
    }, [cart, couponPercentDiscount])

    async function decreaseItem(id: string) {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/cart/decrease/${id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
                }
            })
            if (!response.ok) {
                setMessage({
                    title: "Erro ao remover item do carrinho",
                    position: "bottom-right",
                    type: "error",
                    message: "Caso o erro persista, entre em contato com nosso suporte"
                })
            }
            const data = await response.json()
            setCart(data)
            setMessage({
                title: "Item removido com sucesso",
                position: "bottom-right",
                type: "success",
                // message: "O item foi removido com sucesso, cheque seu carrinho para ver a alteração"
            })
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }
    async function increaseItem(id: string) {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/cart/add/${id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
                }
            })
            if (!response.ok) {
                setMessage({
                    title: "Erro ao adicionar item ao carrinho",
                    position: "bottom-right",
                    type: "error",
                    message: "Caso o erro persista, entre em contato com nosso suporte"
                })
            }
            const data = await response.json()
            setCart(data)
            setMessage({
                title: "Item adicionado com sucesso",
                position: "bottom-right",
                type: "success",
                // message: "O item foi adicionado com sucesso, cheque seu carrinho para ver a alteração"
            })
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    async function removeItem(id: string) {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/cart/remove/${id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
                }
            })
            if (!response.ok) {
                setMessage({
                    title: "Erro ao remover item do carrinho",
                    position: "bottom-right",
                    type: "error",
                    message: "Caso o erro persista, entre em contato com nosso suporte"
                })
            }
            const data = await response.json()
            setCart(data)
            setMessage({
                title: "Item removido com sucesso",
                position: "bottom-right",
                type: "success",
                // message: "O item foi removido com sucesso, cheque seu carrinho para ver a alteração"
            })
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    async function verifyCoupon(coupon:string){
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/orders/verify-coupon`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({coupon:coupon})
            })
            if(!response.ok){
                return setCouponIsInvalid(true)
            }
            const data = await response.json()
            setCouponIsInvalid(false)
            setCouponApplyed(true)
            setCouponPercentDiscount(data.percentOff)
        } catch (err) {
            console.log(err)
        }
    }



    async function createOrder() {
        const random = Math.round((Math.random()) * 60 + 1)
        const order: Orders[] = cart.map((o) => ({ estimatedDeliveryDate: DayJs().add(random).toDate(), expireDate: DayJs().add(7).toDate(), productId: o.id, price: o.price }))
        setIsLoading(true)
        setMessage({
            type: "loading",
            title: "Criando seu pedido de compra",
            position: "bottom-right",
            message: "Estamos gerando seu pedido de compra, você será redirecionado em instantes..."
        })
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/orders/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("authTokenUser")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ order, cart, coupon })
            })
            if (!response.ok) {
                return
            }
            const data = await response.json()
            route.push(data.url)
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className='max-md:min-h-[90dvh]'>
            {cart.length > 0 && <><div className="container-width grid lg:grid-cols-[.7fr_.3fr] gap-x-[4rem]">
                <h1 className='text-[3rem] font-semibold mb-[1.2rem] col-span-full text-zinc-900 dark:text-zinc-100'>Meu carrinho</h1>
                <div className='grid gap-[2rem] max-md:pb-[12rem]'>
                    {cart.map((c) => <div key={c.id} className='flex gap-[1rem]'>
                        <Image src={c.images[0]} alt={c.name} width={180} height={180} className='object-cover max-md:size-[10rem] lg:size-[20rem] rounded-[2rem]' />
                        <div>
                            <h1 className='text-[1.6rem] lg:text-[2.4rem] font-semibold break-all text-wrap break-words text-zinc-900 dark:text-zinc-100'>{c.name}</h1>
                            <span className='text-[1.8rem] font-medium text-zinc-700 dark:text-zinc-300'>R$ {c.price.toFixed(2)}</span>
                            <div className=' flex items-center gap-[.8rem] text-zinc-900 dark:text-zinc-100'>
                                <button aria-label='Diminuir a quantidade do item' disabled={isLoading} className='disabled:opacity-70 disabled:cursor-not-allowed' onClick={() => decreaseItem(c.id)}>
                                    <MinusCircle className='size-[2rem]' />
                                </button>
                                <span className='text-[2rem]'>{c.quantity}</span>
                                <button aria-label='Aumentar a quantidade do item' disabled={isLoading} className='disabled:opacity-70 disabled:cursor-not-allowed' onClick={() => increaseItem(c.id)}>
                                    <PlusCircle className='size-[2rem]' />
                                </button>
                            </div>
                        </div>
                        <button aria-label='Remover item do carrinho' onClick={()=> removeItem(c.id)} className='mb-auto ml-auto text-red-400'>
                            <Trash2 />
                        </button>
                    </div>)}
                </div>
                <div className={clsx('max-md:fixed max-md:w-full max-md:left-0 max-md:dark:bg-zinc-900 max-md:bottom-0 max-md:p-[3rem] text-zinc-900 dark:text-zinc-100 ', {
                    "hidden": scroll >= innerWidth / 15 && isMobile
                })}>
                    <h1 className='text-[2rem] lg:text-[3rem] font-semibold leading-none'>Resumo do pedido</h1>
                    <div className='flex items-center justify-between text-[1.6rem]  mt-[.8rem]'>
                        <p>Total de itens</p>
                        <p>{totalItens}</p>
                    </div>
                    {couponPercentDiscount && <div className='flex items-center justify-between text-[1.6rem] mt-[.8rem]'>
                        <p>Desconto de cupon</p>
                        <p>R$ {discount.toFixed(2)}</p>
                    </div>}
                    <div className='flex items-center justify-between text-[1.4rem] lg:text-[2rem]  mt-[.8rem] font-semibold'>
                        <p>Total</p>
                        <p>R$ {totalValue.toFixed(2)}</p>
                    </div>
                    <hr className='dark:border-zinc-700 my-[1rem]'/>
                    <div className='flex items-center gap-[1rem] flex-wrap'>
                        <input placeholder='Insira um cupom' value={coupon} onChange={({target: {value}})=> {setCoupon(value); setCouponIsInvalid(false)}} type="text" className='w-[70%] dark:bg-zinc-800/70 focus:bg-zinc-800 border border-transparent focus:dark:border-zinc-700 p-[1rem] text-[1.4rem] rounded-[.6rem] leading-none duration-200' />
                        <button aria-label='Aplicar cupom' onClick={()=> verifyCoupon(coupon)} className=' flex-1 text-[1.4rem] bg-zinc-100 text-zinc-900 h-full p-[1.2rem] rounded-[.6rem] font-semibold'>
                            Aplicar
                        </button>
                        {couponIsInvalid && <p className='w-full text-red-500 text-[1.4rem] font-medium tracking-wide'>Cupom expirado ou inválido</p>}
                    </div>
                    <button aria-label='Finalizar compra' disabled={isLoading} onClick={() => { createOrder() }} className='dark:bg-zinc-100 dark:text-zinc-900 p-[1rem] text-[1.6rem] mt-[1.2rem] font-semibold rounded-[.6rem] disabled:opacity-70 disabled:cursor-not-allowed'>Finalizar compra</button>
                </div>
            </div>
                {isLoading && <div className='left-0 top-0 fixed z-[3] w-screen h-screen bg-zinc-900/30 flex items-center justify-center'>
                    <Loader2 className='animate-spin size-[6rem]' />
                </div>}
                <Message message={message} setMessage={setMessage} className={clsx("", {
                    "z-[5]": isLoading
                })} /></>}
            {cart.length === 0 && 
            <div className='container-width flex flex-col items-center h-[70dvh] lg:h-[80dvh] justify-center'>
                <Frown className='size-[4rem] lg:size-[8rem] mb-[1.2rem]'/>
                <h1 className='text-[2rem] lg:text-[5rem] text-center max-w-[20ch] mb-[.8rem] leading-[1.15] font-semibold'>Oops, parece que seu carrinho está vazio :(</h1>
                <p className='text-[1.6rem] text-center dark:text-zinc-300'>Assim que você adicionar itens no seu carrinho, eles irão aparecer aqui.</p>
                <Link href={"/"} className='mt-[1.2rem] dark:bg-zinc-100 dark:text-zinc-900 p-[1rem] text-[1.2rem] lg:text-[1.5rem] font-medium rounded-[.6rem]'>Adicionar items ao carrinho</Link>
            </div>}
        </main>
    )
}

export default Cart
