"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import logo from "../../icon.svg"
import { useUser } from '@/store/User'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import Loader, { useLoader } from '../../_components/Loader'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import clsx from 'clsx'
import DayJs from '@/utils/Dayjs'

interface Login {
    email: string;
    password: string;
    otp: string[]
}

const schema = z.object({
    email: z.string().email({ message: "Insira um email válido" }),
    password: z.string().min(1, { message: "A senha não pode ficar em branco" })
})

const otpLength = 6

const Login = () => {
    const { setUser, setSigned, setCart, lastRoute, setLastRoute, setFavorites } = useUser()
    const { register, watch, formState: { errors }, handleSubmit, setValue } = useForm<Login>({
        resolver: zodResolver(schema),
        defaultValues: {
            otp: Array(otpLength).fill("")
        }
    })
    const [seePassword, setSeePassword] = useState(false)
    const [hasTwoStepsAuth, setHasTwoStepsAuth] = useState(false)
    const { isLoading, setIsLoading } = useLoader()
    const [twoStepsAuthError, setTwoStepsAuthError] = useState(false)
    const route = useRouter()
    const otpValues = watch("otp") || Array(otpLength).fill("");
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [hasTwoStepsAuth])

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
                    password: watch("password"),
                    twoStepsAuthCode: watch("otp").every(v => v.length === 1) ? watch("otp").join("") : null
                })
            })
            const data = await response.json()
            if (data.twoStepsAuth) {
                setHasTwoStepsAuth(true)
                return
            }
            if(data.statusCode === 401){
                setTwoStepsAuthError(true)
            }
            else if (response.ok && !data.twoStepsCode) {
                setUser(data.user)
                setSigned(true)
                setCart(data.user.cart)
                setFavorites(data.user.favorites)
                const expiresAt = DayJs(Date.now() + (data.expiresIn * 60 * 1000)).toDate()
                Cookies.set("authTokenUser", data.token, {
                    expires: expiresAt
                })
                route.push("/")
            }
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

    function handleOtpChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value = e.target.value
        setValue(`otp.${index}`, value);

        if (value && index < otpLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (otpValues.every((v) => v.length === 1)) {
            handleSubmit(signIn)()
        }

        if(twoStepsAuthError){
            setTwoStepsAuthError(false)
        }
    }

    function handleOtpKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    return (
        <main className=''>
            <div className="container-width grid lg:grid-cols-2 items-center h-[100dvh] ">
                <Link onClick={clearLastRoute} href={lastRoute || "/"} className='absolute left-2 top-2 flex items-center gap-[.6rem] p-[1rem] text-[1.4rem] font-semibold w-fit'>
                    <ChevronLeft className='size-[1.8rem]' />
                    Voltar</Link>
                {!hasTwoStepsAuth && <div className=''>
                    <Image src={logo} alt='file' width={64} height={64} className='mb-[2rem]' />
                    <h1 className='text-[2.4rem] font-semibold'>Bem vindo(a) de volta.</h1>
                    <form onSubmit={handleSubmit(signIn)} className='w-full lg:w-[80%] mt-[1.2rem] flex flex-col gap-[1.2rem]'>
                        <div className="" >
                            <input type="text" {...register("email")} placeholder='email@exemplo.com' className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                            {errors.email && <p className='text-start text-red-400 text-[1.3rem] mt-[.4rem]'>{errors.email.message}</p>}
                        </div>

                        <div className="relative">
                            <input type={seePassword ? "text" : "password"} {...register("password")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' placeholder='* * * * * * * ' />
                            {errors.password && <p className='text-start text-red-400 text-[1.3rem] mt-[.4rem]'>{errors.password.message}</p>}
                            <button type='button' onClick={() => setSeePassword(v => !v)} className='absolute right-4 top-2/4 -translate-y-2/4'>
                                {seePassword ? <EyeOff className='size-[2rem]' /> : <Eye className='size-[2rem]' />}
                            </button>
                        </div>
                        <button disabled={isLoading} type='submit' className='bg-zinc-100 text-zinc-900 w-full mt-[.8rem] p-[1rem] font-semibold text-[1.5rem] rounded-[.5rem]'>
                            {isLoading ? <Loader className='mx-auto size-[1.4rem]' /> : "Fazer login"}
                        </button>
                    </form>
                </div>}
                {hasTwoStepsAuth && <div className=''>
                    <Image src={logo} alt='file' width={64} height={64} className='mb-[2rem]' />
                    <h1 className='text-[2.4rem] font-semibold mb-[.4rem]'>Insira o código enviado.</h1>
                    <p className='text-[1.4rem] dark:text-zinc-300'>Um código de 6 digitos foi enviado para o seu email, insira ele logo abaixo.</p>
                    <form onSubmit={handleSubmit(signIn)} className='w-full lg:w-[50%] mt-[1.2rem] flex flex-col gap-[1.2rem]'>
                        <div className="flex gap-[1rem]">
                            {Array.from({ length: otpLength }).map((a, i) => <input value={otpValues[i]} maxLength={1} key={i} {...register(`otp.${i}`)}
                                onPaste={(e) => {
                                    const value = e.clipboardData.getData("text").slice(0, 6)
                                    if (value) {
                                        value.split("").forEach((v, i) => setValue(`otp.${i}`, v))
                                    }
                                    if (otpValues.every((v) => v.length === 1)) {
                                        handleSubmit(signIn)()
                                    }
                                }}
                                ref={(el) => (inputRefs.current[i] = el)} onChange={(e) => handleOtpChange(e, i)}
                                onKeyDown={(e) => handleOtpKeyDown(e, i)} className={
                                    clsx('w-full p-[.8rem] text-[1.6rem] text-center dark:bg-zinc-800/70 rounded-[.5rem] font-semibold border border-transparent', {
                                        "border-red-500": twoStepsAuthError
                                    })
                                } />
                            )}
                        </div>
                        {twoStepsAuthError && <p className='text-red-500 text-[1.4rem]'>O código fornecido está incorreto.</p>}
                    </form>
                </div>}
                {/* <div className=''> */}
                <Image src={"/banner-login.jpg"} alt='asdad' width={1000} height={1000} className='h-[80vh] w-full rounded-[2rem] object-cover saturate-0 max-lg:hidden' />
                {/* </div> */}
            </div>
        </main>
    )
}

export default Login
