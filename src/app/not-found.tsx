"use client"
import { redirect } from "next/navigation"
import { useEffect } from "react"


const NotFound = () => {
    useEffect(() => {
        redirect("/")
    }, [])
    return (
        <>
        
        </>
    )
}

export default NotFound
