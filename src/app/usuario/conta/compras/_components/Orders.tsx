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
import { AlertCircle, Loader2 } from 'lucide-react'
const Orders = () => {
  const { user, } = useUser()
  const [activeSection, setActiveSection] = useState<ActiveSection>("tudo")
  const [orders, setOrders] = useState<Orders[]>([])
  const sections: ActiveSection[] = ["tudo", "pendente", "aprovado", "expirado", "rejeitado"]
  const [isLoading, setIsLoading] = useState(false)

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

  const groupedOrders: Orders[][] = useMemo(() => {
    const g = orders.reduce((acc, order) => {

      if (!acc[order.createdAt]) {

        acc[order.createdAt] = [];
      }

      acc[order.createdAt].push(order);
      return acc;
    }, {});

    // Converte o objeto de volta para um array de arrays
    return Object.values(g);
  }, [orders]);

  // console.log(groupedOrders)


  return (
    <section className='lg:max-w-[80%] max-lg:overflow-x-auto relative'>
      {/* <h1 className='text-[3rem] font-semibold'>Minhas compras</h1> */}
      
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
            {o.filter(o=> filterOrders(o)).length >= 1 && <div className='grid gap-[1rem] mb-[2rem]'>
              {o.filter((o) => filterOrders(o)).map((o) => {
                return (
                  <Fragment key={o.id}>
                    <div className='flex gap-[1rem]'>
                      <Image src={o.product?.images[0] as string} alt={o.product?.id as string} width={180} height={180} className='object-cover size-[140px]' />
                      <div>
                        <h1 className='text-[2rem] font-semibold'>{o.product?.name}</h1>
                        <span className='text-[1.6rem]'>R$ {o.price}</span>
                      </div>
                    </div>
                    {o.status === "pending" && !DayJs().isAfter(DayJs(o.expireDate)) &&  <Link href={o.checkoutUrl} className=' text-[1.6rem] font-medium dark:bg-zinc-100 p-[.8rem] w-fit dark:text-zinc-900 font-space rounded-[.6rem]'>Finalizar compra</Link>}
                    {o.status === "expired" && DayJs().isAfter(DayJs(o.expireDate)) &&  <button disabled className=' text-[1.6rem] font-medium dark:bg-zinc-100/70 p-[.8rem] w-fit dark:text-zinc-900 font-space rounded-[.6rem] flex items-center gap-[.6rem]'>
                    <AlertCircle className='size-[1.6rem]'/>
                    Compra expirada
                    </button>}
                  </Fragment>
                )
              })}
            </div>}
          </Fragment>
        )
      })}
    </section>
  )
}

export default Orders
