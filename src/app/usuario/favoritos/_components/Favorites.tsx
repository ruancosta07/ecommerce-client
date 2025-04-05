"use client"
import { useUser } from '@/store/User'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Cookies from 'js-cookie'
import Message, { useMessage } from '@/app/_components/Message'
const Favorites = () => {
    const { favorites, setFavorites, setCart } = useUser()
    const {message, setMessage} = useMessage()

    async function moveItemToFavorites(id:string){
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/favorites/move-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
                },
                body: JSON.stringify({id})
            })
            const data = await response.json()
            setFavorites(data.favorites)
            setCart(data.cart)
        } catch (err) {
            console.log(err)
        }
    }

    async function removeItemFromFavorites(id:string){
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/favorites/remove/${id}`, {
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
            setFavorites(data)
            setMessage({
                title: "Item removido com sucesso",
                position: "bottom-right",
                type: "success",
                // message: "O item foi removido com sucesso, cheque seu carrinho para ver a alteração"
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <main>
            <div className="container-width o grid lg:grid-cols-[.7fr_.3fr] gap-x-[4rem]">
                <h1 className='text-[3rem] font-semibold mb-[1.2rem] col-span-full'>Meus favoritos</h1>
                <div className='grid gap-[2rem]'>
                    {favorites.map((c) => <div key={c.id} className='flex flex-wrap gap-[1rem] relative'>
                        <Image src={c.images[0]} alt={c.name} width={180} height={180} className=' object-cover max-md:size-[10rem] lg:size-[20rem] rounded-[2rem]' />
                        <div className='flex-1'>
                        <h1 className='text-[1.6rem] lg:text-[2.4rem] font-semibold break-all text-wrap break-words text-zinc-900 dark:text-zinc-100'>{c.name}</h1>
                            <span className='text-[1.8rem] font-medium dark:text-zinc-300'>R$ {c.price.toFixed(2)}</span>
                                <button onClick={()=> moveItemToFavorites(c.id)} className='dark:bg-zinc-100 dark:text-zinc-900 text-[1.4rem] font-medium p-[1rem] block mt-[.8rem] rounded-[.6rem]'>Mover para o carrinho</button>
                        </div>
                        <button onClick={()=> removeItemFromFavorites(c.id)} className='absolute top-0 right-0 text-red-400'>
                            <Trash2 />
                        </button>
                    </div>)}
                </div>
            </div>
            <Message message={message} setMessage={setMessage}/>
        </main>
    )
}

export default Favorites
