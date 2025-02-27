import { AudioWaveform, Facebook, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className='bg-zinc-300/70 dark:bg-zinc-800/70 '>
            <div className="container-width flex max-lg:gap-[2rem] flex-wrap justify-between pt-[6rem]">
                <div className='max-md:w-full'>
                    <Link href={"/"} className='text-[3rem] font-semibold font-space flex items-center gap-[1rem] text-zinc-900 dark:text-zinc-100'>
                        <AudioWaveform className='size-[2.6rem]' />
                        UrbnX
                    </Link>
                    <ul className='flex items-center gap-[1rem] mt-[4rem] text-zinc-900 dark:text-zinc-100'>
                        <li>
                            <a href="">
                                <Facebook />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <Twitter />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <Instagram />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='max-md:w-full'>
                    <span className='text-[2.4rem] font-semibold text-zinc-700 dark:text-zinc-300/70 leading-none mb-[.8rem] block'>
                        Moda
                    </span>
                    <ul className='text-[1.6rem] text-zinc-900 dark:text-zinc-100'>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Camisas Esportivas</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Tênis Femininos</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Calças de Alfaiataria</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Vestidos Floridos</Link>
                        </li>
                    </ul>
                </div>
                <div className='max-md:w-full'>
                    <span className='text-[2.4rem] font-semibold text-zinc-700 dark:text-zinc-300/70 leading-none mb-[.8rem] block'>
                        Usuário
                    </span>
                    <ul className='text-[1.6rem] text-zinc-900 dark:text-zinc-100'>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Minha conta</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Meus favoritos</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Minhas compras</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Alterar foto</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <span className='text-[2.4rem] font-semibold text-zinc-700 dark:text-zinc-300/70 leading-none mb-[.8rem] block '>
                        Guia e ajuda
                    </span>
                    <ul className='text-[1.6rem] text-zinc-900 dark:text-zinc-100'>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Minha conta</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Meus favoritos</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Minhas compras</Link>
                        </li>
                        <li >
                            <Link href={""} className=' font-medium py-[.5rem] block'>Alterar foto</Link>
                        </li>
                    </ul>
                </div>
            </div>
                <div className='w-full mt-[4rem]  p-[1rem] text-[1.6rem] '>
                    <p className='font-space max-w-[70%] mx-auto text-zinc-900 dark:text-zinc-100'>&copy; 2024 - 2025. UrbnX</p>
                </div>
        </footer>
    )
}

export default Footer
