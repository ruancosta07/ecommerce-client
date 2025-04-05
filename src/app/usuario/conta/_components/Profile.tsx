"use client"
import Loader, { useLoader } from '@/app/_components/Loader';
import Message, { useMessage } from '@/app/_components/Message';
import { useUser } from '@/store/User';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import Cookies from 'js-cookie';
import { User } from '@/types/User';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from "zod"
interface FormData {
    name: string;
    email: string;
    adress: {
        zipCode: string
        street: string
        complement: string
        state: string
        city: string
        neighborhood: string
        number: string
    }
}

const schema = z.object({
    name: z.string().min(4, {message: "Seu nome não pode ficar em branco"}),
    email: z.string().email({message: "Insira um email válido"}),
    adress: z.object({
        zipCode: z.string().min(8, {message: "Insira um cep válido"}).max(8, {message: "Insira um cep válido"}),
        street: z.string().min(1, {message: "A rua não pode ficar em branco"}),
        complement: z.string().optional(),
        state: z.string().min(1, {message: "O estado não pode ficar em branco"}),
        city: z.string().min(1, {message: "A cidade não pode ficar em branco"}),
        neighborhood: z.string().min(1, {message: "O bairro não pode ficar em branco"}),
        number: z.string().min(1)
    })
})

const Profile = () => {
    const { user, setUser } = useUser()
    const { isLoading, setIsLoading } = useLoader()
    const { message, setMessage } = useMessage()
    const [avatarHover, setAvatarHover] = useState(false)
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })
    async function onSubmit(data: FormData) {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/${user?.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("authTokenUser")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: { ...data }
                })
            })
            const result = await response.json()
            setUser({ ...result })
            setMessage({
                title: "Dados atualizados",
                type: "success",
                position: "bottom-right",
                message: "Suas informações pessoais foram alteradas com sucesso."
            })
        } catch (err) {
            console.log(err)
        }finally{
            setIsLoading(false)
        }
    }

    async function changeAvatar(event: ChangeEvent<HTMLInputElement>) {
        const { target } = event
        if (target.files) {
            try {
                const formData = new FormData()
                formData.append("file", target.files[0])
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/avatar/${user?.id}`, {
                    method: "PATCH",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
                    }
                })
                if (!response.ok) {
                    return
                }
                const data = await response.json() as User
                if (user) {
                    setUser({ ...user, avatar: data.avatar })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }


    useEffect(() => {
        if (user) {
            reset({ name: user.name, email: user.email, adress: { ...user.adress } })
        }
    }, [user, reset])

    async function loadAddressFromCep(cep: string) {
        if (cep.length === 8) {
            setIsLoading(true)
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                if (!response.ok) {
                    return
                }
                const data = await response.json()
                if (data.erro) {
                    setMessage({
                        title: "CEP inválido",
                        type: "error",
                        position: "bottom-right",
                        message: "Nenhum endereço foi encontrado com o CEP fornecido, verifique antes de tentar novamente"
                    })
                }
                setValue("adress.state", data.estado)
                setValue("adress.city", data.localidade)
                setValue("adress.street", data.logradouro)
                setValue("adress.neighborhood", data.bairro)
            } catch (err) {
                console.log(err)

            } finally {
                setIsLoading(false)
            }
        }
    }




    if (!user) {
        return <></>
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-lg:mb-[2rem] perfil'>
            <label onMouseEnter={() => setAvatarHover(true)} onMouseLeave={() => setAvatarHover(false)} className='mb-[2rem] relative block size-[160px] rounded-full'>
               {user.avatar ?  <Image src={user?.avatar as string} alt={`Foto de perfil de ${user?.name}`} width={160} height={160} className='rounded-full object-cover h-full w-full' />: <div className='border size-[16rem] rounded-full border-zinc-500 dark:border-zinc-700 flex items-center justify-center text-[2rem] lg:text-[4rem] font-semibold'>
                <span>{user.name[0] + user.name.split(" ")[user.name.split(" ").length - 1][0] }</span>
                </div>}
                {avatarHover && <button className='bg-zinc-900/70 absolute text-[1.4rem] w-full h-full z-[1] left-0 top-0 rounded-full flex flex-col gap-[.8rem] items-center justify-center'> <ImagePlus className='size-[2rem]' />Mudar foto </button>}
                <input onChange={changeAvatar} type="file" className='absolute w-full h-full left-0 top-0 z-[1] cursor-pointer opacity-0' />
            </label>
            <section className='grid lg:grid-cols-2 gap-[1rem] lg:max-w-[70%]'>
                <h1 className='text-[2rem] font-semibold col-span-full mb-[.2rem]'>
                    Informações pessoais
                </h1>
                <div className='flex flex-col'>
                    <label className='text-[1.6rem] font-semibold'>Nome</label>
                    <input type="text" {...register("name")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                </div>
                <div className='flex flex-col'>
                    <label className='text-[1.6rem] font-semibold'>Email</label>
                    <input type="text" {...register("email")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                </div>
            </section>
            <section className='grid lg:grid-cols-2 gap-[1rem] lg:max-w-[70%] mt-[2rem]'>
                <h1 className='text-[2rem] font-semibold col-span-full mb-[.2rem]'>
                    Endereço
                </h1>
                <div className='flex flex-col'>
                    <label className='text-[1.6rem] font-semibold'>CEP</label>
                    <input type="text" maxLength={8} {...register("adress.zipCode", {
                        required: true, maxLength: 8, onChange: ({ target }) => {
                            const { value } = target
                            const isNumber = +value
                            if (!isNaN(isNumber)) {
                                setValue("adress.zipCode", target.value)
                                loadAddressFromCep(value)
                            }
                            else {
                                setValue("adress.zipCode", "")
                            }
                        }
                    })} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                </div>
                <div className='flex flex-col '>
                    <label className='text-[1.6rem] font-semibold'>Estado</label>
                    <input type="text" {...register("adress.state")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                </div>
                <div className='flex flex-col '>
                    <label className='text-[1.6rem] font-semibold'>Cidade</label>
                    <input type="text" {...register("adress.city")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                </div>
                <div className='flex flex-col '>
                    <label className='text-[1.6rem] font-semibold'>Bairro</label>
                    <input type="text" {...register("adress.neighborhood")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                </div>
                <div className='flex flex-col '>
                    <label className='text-[1.6rem] font-semibold'>Rua</label>
                    <input type="text" {...register("adress.street")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                </div>
                <div className='flex flex-col '>
                    <label className='text-[1.6rem] font-semibold'>Número</label>
                    <input type="number" {...register("adress.number")} className='w-full p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem] appearance-none' />
                </div>
                <div className='flex flex-col col-span-full'>
                    <label className='text-[1.6rem] font-semibold'>Complemento</label>
                    <input type="text" {...register("adress.complement")} className='w-full  p-[.8rem] text-[1.3rem] dark:bg-zinc-800/70 rounded-[.5rem]' />
                </div>
            </section>
            <button type='submit' className='p-[.8rem] dark:bg-zinc-100 dark:text-zinc-900 text-[1.5rem] font-medium rounded-[.5rem] mt-[1rem]'>Salvar alterações</button>
            {isLoading && <div className='bg-zinc-950/30 fixed z-[3] left-0 top-0 h-screen w-screen flex justify-center items-center'>
                <Loader2 className='animate-spin size-[4rem]' />
            </div>}
            <Message setMessage={setMessage} message={message} />
        </form>
    )
}

export default Profile
