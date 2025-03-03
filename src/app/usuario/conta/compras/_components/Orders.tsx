"use client"
import { useUser } from '@/store/User'
import clsx from 'clsx'
import React, { Fragment, useEffect, useMemo, useState } from 'react'

type ActiveSection = "tudo" | "pendente" | "aprovado" | "expirado" | "rejeitado"
import Cookies from 'js-cookie'
import type { Orders } from '@/types/User'
import Image from 'next/image'
import DayJs from '@/utils/Dayjs'
import Link from 'next/link'
import { AlertCircle, Loader2, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Popup from '@/app/_components/Popup'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Reviews } from '@/types/Product'

interface Rate {
  title: string;
  text: string;
  rate: number;
  textLength:number;
}

const RateSchema = z.object({
  title: z.string().min(1, { message: "O título não pode ficar em branco" }),
  text: z.string().min(1, { message: "O comentário não pode ficar em branco" }).max(500),
  rate: z.coerce.number().min(1, { message: "A nota não pode ficar em branco" }).max(5),
  textLength: z.number().min(1).max(500)
})


const Orders = () => {
  const { user, } = useUser()
  const [activeSection, setActiveSection] = useState<ActiveSection>("tudo")
  const [orders, setOrders] = useState<Orders[]>([])
  const sections: ActiveSection[] = ["tudo", "pendente", "aprovado", "expirado", "rejeitado"]
  const [modalRate, setModalRate] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const { register, watch, setValue, reset, getValues, formState: { errors, isLoading }, handleSubmit } = useForm<Rate>({
    resolver: zodResolver(RateSchema),
    defaultValues: {
      textLength:0
    }
  })
  const [productId, setProductId] = useState<string | null>(null)
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [groupedOrders, setGroupedOrders] = useState<Orders[][]>([])
  const [activeReview, setActiveReview] = useState<null | Reviews>(null)
  useEffect(() => {
    if (user) {
      async function loadOrders() {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/orders/orders/${user?.id}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
            }
          })
          if (!response.ok) {
            return
          }
          const data = await response.json()
          setOrders(data)
        } catch (err) {
          console.log(err)
        }
      }
      loadOrders()
    }
  }, [user])

  function filterOrders(order: Orders) {
    if (activeSection === "tudo") {
      return order
    }
    else if (activeSection === "aprovado") {
      return order.status === "approved"
    }
    else if (activeSection === "expirado") {
      return order.status === "expired"
    }
    else if (activeSection === "rejeitado") {
      return order.status === "rejected"
    }
    else {
      return order.status === "pending"
    }
  }

  useEffect(()=> {
    setGroupedOrders(()=> {
      const g = orders.reduce((acc, order) => {

        if (!acc[order.createdAt]) {
  
          acc[order.createdAt] = [];
        }
  
        acc[order.createdAt].push(order);
        return acc;
      }, {});
  
      return Object.values(g);
    })
  },[orders])

  async function rateProduct() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/reviews/create/${reviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
        },
        body: JSON.stringify({
          title: watch("title"),
          comment: watch("text"),
          rating: watch("rate"),
          productId
        })
      })
      const data = await response.json()
      setOrders((o)=> o.map((item)=> item.id === data.id? {...item, ...data} : item))
      setModalRate(false)
      reset()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=> {
    if(showReview && reviewId){
      async function loadReview(){
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/reviews/review/${reviewId}`)
          const data = await response.json()
          console.log(data)
          setActiveReview({...data})
        } catch (err) {
          console.log(err)
        }
      }
      loadReview()
    }

  },[showReview, reviewId, setValue])
  return (
    <section className='lg:max-w-[80%] max-lg:overflow-x-auto relative'>

      <div className='flex max-lg:overflow-x-auto text-[1.5rem] font-medium mb-[1.2rem] *:'>
        {sections.map((s) => <label key={s} className={clsx('flex justify-center font-inter w-full p-[1rem] lg:px-[3rem] cursor-pointer border-b-2', {
          "dark:border-zinc-100": s === activeSection,
          "dark:border-zinc-700": s !== activeSection,
        })}>
          <input onChange={({ target }) => {
            setActiveSection(target.value as ActiveSection)
          }} value={s} name='compras' hidden type='radio' className='text-[1.4rem]' />
          {s[0].toUpperCase() + s.slice(1)}
        </label>)}
      </div>

      {groupedOrders.map((o, i) => {
        const day = DayJs(o[0].createdAt).utc().format("dddd, DD [de] MMMM [de] YYYY")
        return (
          <Fragment key={i}>
            {o.filter((o) => filterOrders(o)).length >= 1 && <h1 className='first-letter:uppercase text-[2rem] font-semibold mb-[1.2rem]'>{day}</h1>}
            {o.filter(o => filterOrders(o)).length >= 1 && <div className='grid gap-[1rem] mb-[2rem]'>
              {o.filter((o) => filterOrders(o)).map((fo) => {
                return (
                  <Fragment key={fo.id}>
                    <div className='flex gap-[1rem]'>
                      <Image src={fo.product?.images[0] as string} alt={fo.product?.id as string} width={180} height={180} className='object-cover size-[140px] rounded-[2rem]' />
                      <div>
                        <h1 className='text-[2rem] font-semibold'>{fo.product?.name}</h1>
                        <span className='text-[1.6rem]'>R$ {fo.price}</span>
                        <span className='text-[1.6rem] block mt-[.4rem]'>Quantidade: {fo.quantity}</span>
                      </div>
                    </div>
                    {fo.status === "pending" && !DayJs().isAfter(DayJs(fo.expireDate)) && <Link href={fo.checkoutUrl} className=' text-[1.6rem] font-medium dark:bg-zinc-100 p-[.8rem] w-fit dark:text-zinc-900 font-space rounded-[.6rem]'>Finalizar compra</Link>}
                    {fo.status === "expired" && DayJs().isAfter(DayJs(fo.expireDate)) && <button disabled className=' text-[1.6rem] font-medium dark:bg-zinc-100/70 p-[.8rem] w-fit dark:text-zinc-900 font-space rounded-[.6rem] flex items-center gap-[.6rem]'>
                      <AlertCircle className='size-[1.6rem]' />
                      Compra expirada
                    </button>}
                    {fo.status === "approved" && !fo.reviewed && <button onClick={() => {
                      setModalRate(true)
                      setReviewId(fo.id as string)
                      setProductId(fo.productId)
                    }} className=' text-[1.6rem] font-medium dark:bg-zinc-100 p-[.8rem] w-fit dark:text-zinc-900 font-space rounded-[.6rem] flex items-center gap-[.6rem]'>
                      <Star className='size-[1.6rem]' />
                      Avaliar compra
                    </button>}
                    {fo.status === "approved" && fo.reviewed && <button onClick={()=> {
                      setReviewId(fo.id as string)
                      setShowReview(true)
                    }} className=' text-[1.6rem] font-medium dark:bg-zinc-900 p-[.8rem] w-fit dark:text-zinc-100 border dark:border-zinc-800 font-space rounded-[.6rem] flex items-center gap-[.6rem]'>
                     Ver avaliação
                    </button>}
                  </Fragment>
                )
              })}
            </div>}
          </Fragment>
        )
      })}
      {modalRate && <form onSubmit={handleSubmit(rateProduct)} onClick={() => setModalRate(false)} className='h-dvh w-dvw fixed left-0 top-0 z-[2] bg-zinc-950/30 flex justify-center items-center'>
        <Popup onClick={(e) => e.stopPropagation()} className='bg-zinc-900 p-[1.4rem] w-[30%] rounded-[.6rem]'>
          <h1 className='text-[2.4rem] font-semibold mb-[2rem]'>Avaliar compra</h1>
          <div>
            <label className='text-[1.8rem] font-space font-semibold'>Nota da avaliação</label>
            <div className="flex">
              {Array.from({ length: 5 }).reverse().map((_, i) => {
                return (<label key={i}>
                  <Star className={clsx("cursor-pointer", {
                    "fill-zinc-100": +watch("rate") >= i + 1
                  })} />
                  <input type="radio"  {...register("rate", {valueAsNumber:true})} value={Number(i + 1)} onChange={({ target: { value } }) => setValue("rate", +value)} hidden />
                </label>)
              })}

            </div>
            {errors.rate && <p className='mt-[.4rem] text-[1.4rem] text-red-500 tracking-wide'>{errors.rate.message}</p>}
          </div>
          <div className='mt-[1.2rem] flex flex-col'>
            <label className='text-[1.8rem] font-space font-semibold'>Título</label>
            <input type="text" {...register("title")} className='w-full p-[.8rem] text-[1.4rem] dark:bg-zinc-800/70 rounded-[.5rem] text-zinc-900 dark:text-zinc-100' />
            {errors.title && <p className='mt-[.4rem] text-[1.4rem] text-red-500 tracking-wide'>{errors.title.message}</p>}
          </div>
          <div className='mt-[1.2rem] flex flex-col'>
            <label className='text-[1.8rem] font-space font-semibold'>Comentário</label>
            <div className='relative'>
            <textarea {...register("text")} onChange={({target: {value}})=> {
              setValue("text", value.length >= 500 ? value.slice(0,499) : value, {shouldValidate:true})
              setValue("textLength", value.length >= 500 ? value.slice(0,500).length : value.length, {shouldValidate:true})
            }} className='w-full p-[.8rem] text-[1.4rem] dark:bg-zinc-800/70 rounded-[.5rem] text-zinc-900 dark:text-zinc-100 outline-none font-inter max-h-[200px]' rows={4} />
            <span className='text-[1.4rem] font-medium absolute right-4 bottom-4'>{getValues("textLength")}/500</span>
            </div>
            {errors.text && <p className='mt-[.4rem] text-[1.4rem] text-red-500 tracking-wide'>{errors.text.message}</p>}
          </div>
          <button disabled={isLoading} className='bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.4rem] rounded-[.6rem] p-[1rem] font-medium mt-[2rem] flex items-center gap-[.6rem] disabled:opacity-70'>{!isLoading ? "Enviar avaliação" : <>
            <Loader2 className='size-[1.4rem] animate-spin' />
            Enviar avaliação
          </>}</button>
        </Popup>
      </form>}
      {showReview && activeReview && <div onClick={() =>{ setShowReview(false); setActiveReview(null)}} className='h-dvh w-dvw fixed left-0 top-0 z-[2] bg-zinc-950/30 flex justify-center items-center'>
        <Popup onClick={(e) => e.stopPropagation()} className='bg-zinc-900 p-[1.4rem] w-[30%] rounded-[.6rem]'>
          <h1 className='text-[2.4rem] font-semibold mb-[2rem]'>Avaliação da compra</h1>
          <div>
            <label className='text-[1.8rem] font-space font-semibold'>Nota da avaliação</label>
            <div className="flex">
              {Array.from({ length: 5 }).reverse().map((_, i) => {
                return (<label key={i}>
                  <Star className={clsx("", {
                    "fill-zinc-100": activeReview.rating >= i + 1
                  })} />
                </label>)
              })}

            </div>
          </div>
          <div className='mt-[1.2rem] flex flex-col'>
            <label className='text-[1.8rem] font-space font-semibold'>Título</label>
            <input type="text" disabled value={activeReview.title} className='w-full p-[.8rem] text-[1.4rem] dark:bg-zinc-800/70 rounded-[.5rem] text-zinc-900 dark:text-zinc-100' />
          </div>
          <div className='mt-[1.2rem] flex flex-col'>
            <label className='text-[1.8rem] font-space font-semibold'>Comentário</label>
            <div className='relative'>
            <textarea disabled defaultValue={activeReview.comment} className='w-full p-[.8rem] text-[1.4rem] dark:bg-zinc-800/70 rounded-[.5rem] text-zinc-900 dark:text-zinc-100 outline-none font-inter max-h-[200px] resize-none' rows={4} />
            <span className='text-[1.4rem] font-medium absolute right-4 bottom-4'>{activeReview.comment.length}/500</span>
            </div>
          </div>
        </Popup>
      </div>}
    </section>
  )
}

export default Orders
