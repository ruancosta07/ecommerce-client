"use client"
import Image from 'next/image'
import React, {useState } from 'react'
import logo from "../icon.svg"
import { useUser } from '@/store/User'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { z } from 'zod'

interface CreateAccount {
    email: string;
    password: string;
    name: string
}

const schema = z.object({
    name: z.string().min(1, {message: "Seu nome não pode ficar em branco"}),
    email:z.string({message: "O email não pode ficar em branco"}).email({message: "Insira um email válido."}),
    password:z.string().min(8, {message: "Sua senha deve conter no mínimo 8 caracteres"})
})


const CriarConta = () => {
    const { setUser, setSigned, setCart, lastRoute, setLastRoute } = useUser()
    const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateAccount>({
        resolver: zodResolver(schema)
    })
    const router = useRouter()
    const [seePassword, setSeePassword] = useState(false)
    // console.log(w("email"))

    async function signIn(data: CreateAccount) {
        console.log(data)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        email: watch("email"),
                        name: watch("name"),
                        password: watch("password"),
                    }
                )
            })
            if (!response.ok) {
                return
            }
            const data = await response.json()
            setUser(data.user)
            setSigned(true)
            setCart(data.user.cart || [])
            Cookies.set("authTokenUser", data.token, {
                expires: data.expiresIn
            })
            router.push("/")
        } catch (err) {
            console.log(err)
        }
    }

    function clearLastRoute() {
        if (lastRoute) {
            setLastRoute(null)
        }
    }

    return (
        <main className=''>
            <div className="container-width grid grid-cols-2 items-center h-[100vh]" >
            <Link onClick={clearLastRoute} href={lastRoute || "/"} className='fixed left-2 top-2 flex items-center gap-[.6rem] p-[1rem] text-[1.4rem] font-semibold w-fit'>
                <ChevronLeft className='size-[1.8rem]' />
                Voltar</Link>
            <div className='flex flex-col form-container'>
                <Image src={logo} alt='file' width={64} height={64} className='mb-[2rem]' />
                <h1 className='text-[2.4rem] font-semibold'>Crie sua conta.</h1>
                <form onSubmit={handleSubmit(signIn)} className='w-[80%] lg:w-[80%] mt-[1.2rem] flex flex-col gap-[1.2rem]'>
                    <div className="" >
                        <input type="text" {...register("name")} placeholder='Seu nome' className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                        {errors.name && <p className='text-start text-red-400 text-[1.3rem] mt-[.4rem]'>{errors.name.message}</p>}
                    </div>
                    <div className="" >
                        <input type="email" {...register("email")} placeholder='email@exemplo.com' className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                        {errors.email && <p className='text-start text-red-400 text-[1.3rem] mt-[.4rem]'>{errors.email.message}</p>}
                    </div>

                    <div className="relative">
                        <div className="relative">

                            <input type={seePassword ? "text" : "password"} {...register("password")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' placeholder='* * * * * * * ' />
                            <button onClick={() => setSeePassword(v => !v)} type='button' className='absolute right-4 top-2/4 -translate-y-2/4 dark:text-zinc-400'>
                                {seePassword ? <EyeOff className='size-[2rem]' /> : <Eye className='size-[2rem]' />}
                            </button>
                        </div>
                        {errors.password && <p className='text-start text-red-400 text-[1.3rem] mt-[.4rem]'>{errors.password.message}</p>}
                    </div>
                    <button type='submit' className='bg-zinc-100 text-zinc-900 w-full mt-[.8rem] p-[1rem] font-semibold text-[1.5rem] rounded-[.5rem]'>
                        Criar conta
                    </button>
                </form>
            </div>
            <Image src={"/banner-criar-conta.webp"} alt='asdad' width={1000} height={1000} className='h-[80vh] w-full rounded-[2rem] object-cover saturate-0' />
            </div>
        </main>
    )
}

export default CriarConta
