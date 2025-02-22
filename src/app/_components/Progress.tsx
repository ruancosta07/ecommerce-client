"use client"
import { useUser } from "@/store/User"
import {AppProgressBar as ProgressBar, } from "next-nprogress-bar"
import { useEffect, useState } from "react"


export const useProgress=()=> {
    const [disable, setDisable] = useState(true)
    return {disable, setDisable}
}

const Progress = ({disabled}: {disabled:boolean}) => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=> {
        setIsMounted(true)
    },[])
    const {theme} = useUser()
    if(!isMounted){
        return <>
        </>
    }
    return (
        <>
            {!disabled && <ProgressBar color={theme === "dark" ? "#fff" : "#000"}/>}
        </>
    )
}

export default Progress
