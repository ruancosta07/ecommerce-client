"use client"
import { useUser } from '@/store/User'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useMemo } from 'react'
import Cookies from 'js-cookie'
import Message, { useMessage } from '@/app/_components/Message'
const Favorites = () => {
    const { favorites, setFavorites } = useUser()
    const {message, setMessage} = useMessage()
    const [totalItens, totalValue, discount] = useMemo(() => {
        return [
            favorites.reduce((a, b) => a + b.quantity, 0),
            favorites.reduce((a, b) => a + (b.price - (b.price * 0.1)) * b.quantity, 0),
            favorites.reduce((a, b) => a +(b.price * 0.1) * b.quantity, 0),
        ]
    }, [favorites])

    return (
        <main>
            <div className="max-w-[70%] mx-auto grid grid-cols-[.7fr_.3fr] gap-x-[4rem]">
                <h1 className='text-[3rem] font-semibold mb-[1.2rem] col-span-full'>Meus favoritos</h1>
                <div className='grid gap-[2rem]'>
                    {favorites.map((c) => <div key={c.id} className='flex gap-[1rem]'>
                        <Image src={c.images[0]} alt={c.name} width={180} height={180} className=' object-cover size-[20rem] rounded-[2rem]' />
                        <div>
                            <h1 className='text-[2.4rem]'>{c.name}</h1>
                            <span className='text-[1.8rem] font-medium dark:text-zinc-300'>R$ {c.price.toFixed(2)}</span>
                                <button className='dark:bg-zinc-100 dark:text-zinc-900 text-[1.4rem] font-medium p-[1rem] block mt-[.8rem] rounded-[.6rem]'>Mover para o carrinho</button>
                        </div>
                        <button className='mb-auto ml-auto text-red-400'>
                            <Trash2 />
                        </button>
                    </div>)}
                </div>
                <div>
                    <h1 className='text-[3rem] font-semibold leading-none'>Resumo do pedido</h1>
                    <div className='flex items-center justify-between text-[1.6rem] max-w-[90%] mt-[.8rem]'>
                        <p>Total de itens</p>
                        <p>{totalItens}</p>
                    </div>
                    <div className='flex items-center justify-between text-[1.6rem] max-w-[90%] mt-[.8rem]'>
                        <p>Desconto no pix</p>
                        <p>R$ {discount.toFixed(2)}</p>
                    </div>
                    <div className='flex items-center justify-between text-[2rem] max-w-[90%] mt-[.8rem] font-semibold'>
                        <p>Total</p>
                        <p>R$ {totalValue.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <Message message={message} setMessage={setMessage}/>
        </main>
    )
}

export default Favorites
