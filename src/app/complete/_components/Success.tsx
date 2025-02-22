"use client"
import { ArrowRight, CheckCircle } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Order {
  total: number;
  products: Array<{ id: string; name: string; images: string; price: number }>
}

const Success = ({ order }: { order: Order }) => {
  return (
    <main>
      <div className="lg:w-[50%] w-full mx-auto flex flex-col justify-center h-screen">
        <CheckCircle className='size-[3rem] lg:size-[4rem] mb-[1.2rem] mx-auto' />
        <h1 className='text-[2rem] lg:text-[4rem] font-semibold text-center'>Agradecemos pela sua compra!</h1>
        <p className='text-[1.4rem] lg:text-[1.6rem] dark:text-zinc-300 text-center'>Sua compra foi confirmada e processada com sucesso.</p>
        <div className='bg-zinc-800/70 w-[90vw] lg:w-[25vw] p-[1.4rem] rounded-[.6rem] mt-[2rem] mx-auto'>
          <h2 className='text-[1.8rem] font-semibold mb-[.8rem]'>
            Resumo da compra
          </h2>
          <div className="flex flex-col gap-[1rem] border-b pb-[1.2rem] dark:border-zinc-700 ">
            {order.products.map((p) => <div key={p.id} className='flex gap-[1rem]'>
              <Image src={p.images[0]} alt={p.name} width={200} height={200} className='size-[7rem] object-cover rounded-[1rem]' />
              <div>
                <span className='text-[1.6rem] font-semibold'>{p.name}</span>
                <p className='text-[1.4rem] font-medium'>R$ {p.price}</p>
              </div>
            </div>)}
          </div>
          <div className='flex justify-between items-center text-[2rem] font-medium mt-[.4rem]'>
            <span className=''>Total</span>
            <span className=''>R$ {(order.total / 100).toFixed(2)}</span>
          </div>
        </div>
          <Link href={"/"} className="text-[1.6rem] dark:bg-zinc-100 dark:text-zinc-900 p-[1rem] rounded-[.6rem] font-semibold mt-[1.2rem] mx-auto flex items-center gap-[.6rem]">Voltar para o início <ArrowRight className='size-[1.6rem]'/></Link>
      </div>
    </main>
  )
}

export default Success
