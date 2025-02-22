"use client"
import Image from 'next/image'
import React, { FormEvent, useState } from 'react'
import logo from "../icon.svg"
import { useUser } from '@/store/User'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import Loader, { useLoader } from '../_components/Loader'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface Login {
    email: string;
    password: string
}

const schema = z.object({
    email: z.string().email({ message: "Insira um email válido" }),
    password: z.string().min(1, { message: "A senha não pode ficar em branco" })
})

const Login = () => {
    const { setUser, setSigned, setCart, lastRoute, setLastRoute, setFavorites } = useUser()
    const { register, watch, formState: { errors }, handleSubmit, } = useForm<Login>({
        resolver: zodResolver(schema)
    })
    const [seePassword, setSeePassword] = useState(false)
    const { isLoading, setIsLoading } = useLoader()
    const route = useRouter()
    async function signIn() {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: watch("email"),
                    password: watch("password")
                })
            })
            if (!response.ok) {
                return
            }
            const data = await response.json()
            setUser(data.user)
            setSigned(true)
            setCart(data.user.cart)
            setFavorites(data.user.favorites)
            Cookies.set("authTokenUser", data.token, {
                expires: data.expiresIn
            })
            route.push("/")
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
            <div className="container-width grid lg:grid-cols-2 items-center h-[100dvh] ">
                <Link onClick={clearLastRoute} href={lastRoute || "/"} className='absolute left-2 top-2 flex items-center gap-[.6rem] p-[1rem] text-[1.4rem] font-semibold w-fit'>
                <ChevronLeft className='size-[1.8rem]' />
                Voltar</Link>
                <div className=''>
                    <Image src={logo} alt='file' width={64} height={64} className='mb-[2rem]' />
                    <h1 className='text-[2.4rem] font-semibold'>Bem vindo(a) de volta.</h1>
                    <form onSubmit={handleSubmit(signIn)} className='w-full lg:w-[80%] mt-[1.2rem] flex flex-col gap-[1.2rem]'>
                        <div className="" >
                            <input type="text" {...register("email")} placeholder='email@exemplo.com' className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                            {errors.email && <p className='text-start text-red-400 text-[1.3rem] mt-[.4rem]'>{errors.email.message}</p>}
                        </div>

                        <div className="relative">
                            <input type={seePassword ? "text":"password"} {...register("password")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' placeholder='* * * * * * * ' />
                            {errors.password && <p className='text-start text-red-400 text-[1.3rem] mt-[.4rem]'>{errors.password.message}</p>}
                            <button type='button' onClick={()=> setSeePassword(v=> !v)} className='absolute right-4 top-2/4 -translate-y-2/4'>
                                {seePassword ? <EyeOff className='size-[2rem]'/> : <Eye className='size-[2rem]'/>}
                            </button>
                        </div>
                        <button disabled={isLoading} type='submit' className='bg-zinc-100 text-zinc-900 w-full mt-[.8rem] p-[1rem] font-semibold text-[1.5rem] rounded-[.5rem]'>
                            {isLoading ? <Loader className='mx-auto size-[1.4rem]' /> : "Fazer login"}
                        </button>
                    </form>
                </div>
                {/* <div className=''> */}
                    <Image src={"/banner-login.jpg"} alt='asdad' width={1000} height={1000} className='h-[80vh] w-full rounded-[2rem] object-cover saturate-0 max-lg:hidden' />
                {/* </div> */}
            </div>
        </main>
    )
}

export default Login
