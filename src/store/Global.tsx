"use client"
import {create} from "zustand"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


interface GlobalStore {
  theme : string | undefined;
  setTheme: (value:string | undefined)=> void;
  isMobile:boolean;
  setIsMobile: (value:boolean)=> void;
}

export const useGlobal = create<GlobalStore>((set)=> ({
  theme: undefined,
  setTheme: (value)=> set({theme:value}),
  isMobile: false,
  setIsMobile: (value)=> set({isMobile:value}),
}))

export const GlobalProvider = ()=> {
  const [isMounted, setIsMounted] = useState(false)
  const activeTheme = useTheme().theme
  const {setTheme, setIsMobile, theme} = useGlobal()
  useEffect(()=> {
    setIsMounted(true)
    setTheme(activeTheme)
  },[setTheme,activeTheme])

    useEffect(() => {
    if(isMounted){
      setIsMobile(innerWidth <= 1024) 
      function resizingScreen() {
        setIsMobile(innerWidth <= 1024)
      }
      window.addEventListener("resize", resizingScreen)
      return () => window.removeEventListener("resize", resizingScreen)
    }
  }, [isMounted, setIsMobile])

  useEffect(() => {
    if (innerWidth >= 1024) {
      setIsMobile(false)
    }
    else {
      setIsMobile(true)
    }
  }, [setIsMobile])
  return <></>
}