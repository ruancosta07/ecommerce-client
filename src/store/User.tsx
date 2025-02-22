"use client";

import { Product } from "@/types/Product";
import { User } from "@/types/User";
import { create } from "zustand";


interface UserContextType {
    user: User | null;
    setUser: (value:User | null)=> void;
    signed: boolean;
    setSigned: (value:boolean)=> void
    cart: Product[] | [],
    setCart: (value: Product | [] )=> void
    favorites: Product[] | [],
    setFavorites: (value:Product | [])=> void
    lastRoute:string | null;
    setLastRoute: (value:string | null)=> void
    theme?: string | undefined,
    setTheme?: (value:string | undefined)=> void
}

export const useUser = create<UserContextType>((set )=> ({
    cart:[],
    setCart: (value)=> set({cart:value}),
    favorites:[],
    setFavorites: (value)=> set({favorites:value}),
    lastRoute: "",
    setLastRoute: (value)=> set({lastRoute:value}),
    signed:false,
    setSigned: (value)=> set({signed:value}),
    user: null,
    setUser: (value)=> set({user:value})
}))