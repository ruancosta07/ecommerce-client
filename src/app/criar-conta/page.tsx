"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import logo from "../icon.svg"
import { useUser } from '@/store/User'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'

interface CreateAccount {
    email: string;
    password: string;
    name: string
}

const schema = z.object({
    name: z.string().min(1, { message: "Seu nome não pode ficar em branco" }),
    email: z.string({ message: "O email não pode ficar em branco" }).email({ message: "Insira um email válido." }),
    password: z.string().min(8, { message: "Sua senha deve conter no mínimo 8 caracteres" })
})


const CriarConta = () => {
    const { setUser, setSigned, setCart, lastRoute, setLastRoute } = useUser()
    const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateAccount>({
        resolver: zodResolver(schema)
    })
    const router = useRouter()
    const [seePassword, setSeePassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function signIn() {
        setIsLoading(true)
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
        } finally {
            setIsLoading(false)
        }
    }

    function clearLastRoute() {
        if (lastRoute) {
            setLastRoute(null)
        }
    }

    return (
        <main className=''>
            <div className="container-width grid lg:grid-cols-2 items-center h-[100vh]" >
                <Link onClick={clearLastRoute} href={lastRoute || "/"} className='fixed left-2 top-2 flex items-center gap-[.6rem] p-[1rem] text-[1.4rem] font-semibold w-fit'>
                    <ChevronLeft className='size-[1.8rem]' />
                    Voltar</Link>
                <div className='flex flex-col form-container'>
                    <Image src={logo} alt='file' width={64} height={64} className='mb-[2rem]' />
                    <h1 className='text-[2.4rem] font-semibold'>Crie sua conta.</h1>
                    <form onSubmit={handleSubmit(signIn)} className='w-full lg:w-[80%] mt-[1.2rem] flex flex-col gap-[1.2rem]'>
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
                        <button type='submit' disabled={isLoading} className='bg-zinc-100 text-zinc-900 w-full mt-[.8rem] p-[1rem] font-semibold text-[1.5rem] rounded-[.5rem] disabled:opacity-70 disabled:cursor-not-allowed'>
                            {isLoading ? <Loader2 className='size-[1.4rem] animate-spin mx-auto' /> : "Criar conta"}
                        </button>
                        <div className='relative mt-[1.2rem] flex justify-center'>
                            <span className='text-[1.4rem] relative z-[1]  dark:text-zinc-300 text-zinc-700 font-medium dark:bg-zinc-950 p-[.4rem] px-[.8rem]'>OU</span>
                            <div className='absolute w-full h-[1px] bg-zinc-700 dark:bg-zinc-700 top-2/4 -translate-y-2/4'></div>
                        </div>
                        <div className="flex gap-[1rem]">
                            <Link href={`${process.env.NEXT_PUBLIC_API_PROD_URL}`} className='bg-zinc-100 text-zinc-900 flex-1  p-[1rem] font-semibold text-[1.5rem] rounded-[.5rem] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-[1rem] justify-center'>
                                <svg className=' size-[2rem] fill-zinc-100 dark:fill-zinc-900' strokeWidth="0" viewBox="0 0 488 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                Google
                            </Link>
                            <Link href={`${process.env.NEXT_PUBLIC_API_PROD_URL}`} className='bg-zinc-100 text-zinc-900 flex-1  p-[1rem] font-semibold text-[1.5rem] rounded-[.5rem] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-[1rem] justify-center'>
                                <svg className='stroke-[4px] size-[2rem] fill-zinc-100 dark:fill-zinc-900' strokeWidth="0" viewBox="0 0 15 15" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z" ></path></svg>
                                Github
                            </Link>
                        </div>
                        <div>
                            <span className='text-[1.6rem] text-center block text-zinc-400'>Já possui uma conta? <Link href={"/login"} className='underline-offset-2 underline text-zinc-100 font-medium'>Fazer login</Link></span>
                        </div>
                    </form>
                </div>
                <Image src={"/banner-criar-conta.webp"} alt='asdad' width={1000} height={1000} className='h-[80vh] w-full rounded-[2rem] object-cover saturate-0 max-lg:hidden' />
            </div>
        </main>
    )
}

export default CriarConta
