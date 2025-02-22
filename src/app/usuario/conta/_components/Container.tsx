"use client"
import Progress from '@/app/_components/Progress'
import clsx from 'clsx'
import { Shield, ShoppingBasket, UserPen } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'

type ActivePath = "perfil" | "compras" | "seguranca"


const Container = ({ children }: { children: ReactNode }) => {
    const [activePath, setActivePath] = useState<ActivePath>("perfil")
    const pathname = usePathname()
    useEffect(() => {
        const actualPath = pathname.split("/")[pathname.split("/").length - 1] as ActivePath
        setActivePath(actualPath)
    }, [pathname])
    return (
        <main className='container-width mt-[10vh] grid lg:grid-cols-[.3fr_.7fr]'>
            <aside className='flex lg:flex-col max-lg:mb-[2rem] overflow-x-auto'>
                <Link href={"/usuario/conta/perfil"} className={clsx('text-[1.8rem] text-zinc-100 flex p-[.4rem] items-center gap-[.6rem]', {
                    "text-zinc-100/30": activePath !== "perfil"
                })}>
                    <UserPen />
                    Perfil
                </Link>
                <Link href={"/usuario/conta/compras"} className={clsx('text-[1.8rem] text-zinc-100 flex p-[.4rem] items-center gap-[.6rem]', {
                    "text-zinc-100/30": activePath !== "compras"
                })}>
                    <ShoppingBasket />
                    Compras
                </Link>
                <Link href={"/usuario/conta/seguranca"} className={clsx('text-[1.8rem] text-zinc-100 flex p-[.4rem] items-center gap-[.6rem]', {
                    "text-zinc-100/30": activePath !== "seguranca"
                })}>
                    <Shield />
                    Segurança
                </Link>
            </aside>
            {children}
            {/* <Progress/> */}
        </main>
    )
}

export default Container
