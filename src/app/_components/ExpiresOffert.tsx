"use client"
import DayJs from '@/utils/Dayjs'
import { Flame } from 'lucide-react';
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface ExpiresDate {
    hours: number;
    minutes: number;
    seconds: number;
}

const ExpiresOffert = () => {
    const pathname = usePathname()
    const [expiresDate, setExpiresDate] = useState<ExpiresDate | null>(null)
    const [expiresDateLocal, setExpiresDateLocal] = useState<null | Date>(null)
    const [isMounted, setIsMounted] = useState(false)


    useEffect(() => {
        setIsMounted(true)
        const localDate = localStorage.getItem("expiresDate")
        setExpiresDateLocal(() => localDate ? JSON.parse(localDate) : null)
    }, [])
    useEffect(() => {
        if (isMounted) {
            const parsedDate = DayJs(localStorage.getItem("expiresDate")?.replace(/"/g, ""))
            if (!localStorage.getItem("expiresDate") || DayJs().isAfter(parsedDate)) {
                localStorage.setItem("expiresDate", JSON.stringify(DayJs().add(3, "day").toDate()))
                setExpiresDateLocal(DayJs().add(3, "day").toDate())
            }
            else if (localStorage.getItem("expiresDate") && DayJs(localStorage.getItem("expiresDate")).isAfter(DayJs())) {
                localStorage.setItem("expiresDate", JSON.stringify(DayJs().add(3, "day").toDate()))
                setExpiresDateLocal(DayJs().add(3, "day").toDate())
            }
        }
    }, [isMounted])


        useEffect(() => {
            const changeExpiresDate = setInterval(() => {
                const futureDate = DayJs(expiresDateLocal)
                const now = DayJs()
                const diff = futureDate.diff(now)
    
                const diffHours = Math.floor((diff / (1000 * 60 * 60)));
                const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000)
                setExpiresDate({ hours: diffHours, minutes: diffMinutes, seconds: diffSeconds })
            }, 1000)
            return () => clearInterval(changeExpiresDate)
        }, [expiresDateLocal])
    return (
        <>
            {!pathname.startsWith("/produto") && <div className='flex lg:items-center  mb-[2rem]'>
                <div className='flex items-center gap-[.6rem] '>
                    <Flame className='size-[2rem] lg:size-[3rem]' />
                    <h1 className="text-[1.8rem] 2xl:text-[4rem] font-semibold col-span-full leading-none">Ofertas do dia </h1>
                </div>
                {expiresDate && <div className='text-[1.2rem] lg:text-[1.8rem] font-semibold  flex items-center gap-[.8rem] ml-auto'>
                    <span className='leading-none p-[.5rem] tabular-nums bg-rose-500'>
                        {expiresDate.hours < 10 ? `0${expiresDate.hours}` : expiresDate.hours}
                    </span>
                    :
                    <span className='leading-none p-[.5rem] tabular-nums bg-rose-500'>
                        {expiresDate.minutes < 10 ? `0${expiresDate.minutes}` : expiresDate.minutes}
                    </span>
                    :
                    <span className='leading-none p-[.5rem] tabular-nums bg-rose-500'>
                        {expiresDate.seconds < 10 ? `0${expiresDate?.seconds}` : expiresDate.seconds}
                    </span>
                </div>}
            </div>}
        </>
    )
}

export default ExpiresOffert
