"use client";

import { Product } from "@/types/Product";
import { User } from "@/types/User";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { create } from "zustand";
import { ThemeProvider as NextThemeProvider } from "next-themes";

interface UserContextType {
    user: User | null;
    setUser: (value: User | null) => void;
    signed: boolean;
    setSigned: (value: boolean) => void
    cart: Product[] | [],
    setCart: (value: Product | []) => void
    favorites: Product[] | [],
    setFavorites: (value: Product | []) => void
    lastRoute: string | null;
    setLastRoute: (value: string | null) => void
    theme: string,
    setTheme: (value: string) => void
}

export const useUser = create<UserContextType>((set) => ({
    cart: [],
    setCart: (value) => set({ cart: value }),
    favorites: [],
    setFavorites: (value) => set({ favorites: value }),
    lastRoute: "",
    setLastRoute: (value) => set({ lastRoute: value }),
    signed: false,
    setSigned: (value) => set({ signed: value }),
    user: null,
    setUser: (value) => set({ user: value }),
    theme: "",
    setTheme: (value) => set({ theme: value })
}))


export const ThemeProvider = ({children}: {children:ReactNode}) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])


    if(!mounted){
        return <></>
    }
    return <NextThemeProvider attribute={"class"} defaultTheme={"system"}>
        {children}
    </NextThemeProvider>
}