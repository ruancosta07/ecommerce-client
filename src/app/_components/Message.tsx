import clsx from 'clsx';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion"
import { twMerge } from 'tw-merge';

interface Message {
    type: "success" | "error" | "loading";
    message?: string;
    title: string;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

interface MessageInterface {
    message: Message | null,
    setMessage: React.Dispatch<SetStateAction<Message | null>>
}

export const useMessage = (): MessageInterface => {
    const [message, setMessage] = useState<Message | null>(null)
    return { message, setMessage }
}

const Message = ({message, setMessage, className}:{message: Message | null, setMessage: React.Dispatch<SetStateAction<Message | null>>, className?:string}) => {
    const timeOut = useRef<NodeJS.Timeout | null>(null)
    useEffect(() => {
        if (timeOut.current) {
            clearTimeout(timeOut.current)
        }
        timeOut.current = setTimeout(() => {
            setMessage(null)
        }, 5000)
    }, [message, setMessage])
    if(message)
    return (
        <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ scale: 1, opacity: 1 }} className={clsx(twMerge(`absolute grid grid-cols-[auto_1fr] gap-[1rem] p-[1rem] dark:bg-zinc-900 border dark:border-zinc-800 rounded-[1rem] w-[18vw] ${className}`), {
            "right-16 bottom-16": message.position === "bottom-right",
            "right-16 top-16": message.position === "top-right",
            "top-16 left-16": message.position === "top-left",
            "bottom-16 left-16": message.position === "bottom-left",
        })}>
            {message.type === "success" && <CheckCircle2 className='size-[2rem]' /> }
            {message.type === "error" &&  <XCircle className='size-[2rem]' /> }
            {message.type === "loading" && <Loader2 className='size-[2rem] animate-spin' /> }
            <div className="">
                <h1 className='text-[1.6rem] font-semibold' >{message.title}</h1>
                {message && <p className='text-[1.4rem] leading-[1.3] mt-[.4rem]'>{message.message}</p>}
            </div>
        </motion.div>
    )
}

export default Message
