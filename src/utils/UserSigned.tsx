"use client"
import { useUser } from "@/store/User";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function UserSigned() {
    const { setSigned, setUser, setCart, setFavorites } = useUser()
    const router = useRouter()
    useEffect(() => {
        async function verifyUser() {
            const token = Cookies.get("authTokenUser")
            if (token) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/auth/verify`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${Cookies.get("authTokenUser")}`
                        }
                    })
                    if (!response.ok) {
                        setSigned(false)
                        setUser(null)
                        setCart([])
                        setFavorites([])
                        return
                    }
                    const data = await response.json()
                    setUser(data)
                    setSigned(true)
                    setCart(data.cart || [])
                    setFavorites(data.favorites || [])
                } catch (err) {
                    console.log(err)
                    setSigned(false)
                    setUser(null)
                    setCart([])
                    setFavorites([])
                }
            }
            else {
                setSigned(false)
                setUser(null)
                setCart([])
                setFavorites([])
            }
        }
        verifyUser()
    }, [setUser, setSigned, setCart, setFavorites, router])
    return <></>
}