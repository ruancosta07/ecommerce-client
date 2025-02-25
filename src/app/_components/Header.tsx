"use client"
import { useUser } from '@/store/User'
import { AudioWaveform, Heart, HistoryIcon, LogOut, MoonStar, Search, ShoppingCart, SunDim, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import Popup from './Popup'
import Cookies from 'js-cookie'
import { redirect, usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useGlobal } from '@/store/Global'
import { AnimationDefinition, motion } from "framer-motion"
import { useForm } from 'react-hook-form'
import { Product } from '@/types/Product'

interface HistoryProducts {
  id: string;
  name: string;
  price: number;
  image: string;
  accessedAt: number
}

const Header = () => {
  const { signed, cart, user, setSigned, setUser, setCart, favorites, setFavorites, } = useUser()
  const { theme, setTheme, } = useGlobal()
  const { isMobile } = useGlobal()
  const [userPopup, setUserPopup] = useState(false)
  const pathname = usePathname()
  const [menuMobileActive, setMenuMobileActive] = useState(false)
  const [searchBarFocus, setSearchBarFocus] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const [foundProducts, setFoundProducts] = useState<Product[]>([])
  const timeOut = useRef<NodeJS.Timeout | null>(null)
  const { register, watch, handleSubmit } = useForm<{ searchTerm: string }>()
  const [historyProducts, setHistoryProducts] = useState<HistoryProducts[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const storageProducts = localStorage.getItem("historyProducts")
    const parseProducts = JSON.parse(storageProducts as string) as HistoryProducts[]
    if (storageProducts && parseProducts.length > 0) {
      setHistoryProducts(parseProducts)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("historyProducts", JSON.stringify(historyProducts))
  }, [historyProducts])

  async function logOut() {
    setSigned(false)
    setUser(null)
    setCart([])
    setFavorites([])
    Cookies.remove("authTokenUser")
    const pathnameSlice = pathname.split("/")
    if (pathnameSlice.length > 2 && !pathname.includes("produto")) {
      redirect("/login")
    }
  }

  async function searchProduct(searchTerm: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/products/search?busca=${searchTerm}`)
      const data = await response.json() as Product[]
      if (data.length > 0) {
        setFoundProducts(data)
      }
      else {
        setFoundProducts([])
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.replace("light", "dark")
      localStorage.setItem("theme", "dark")
    }
    else {
      document.documentElement.classList.replace("dark", "light")
      localStorage.setItem("theme", "light")
    }
  }, [theme])

  return (
    <header>
      <div className='bg-zinc-300 dark:bg-zinc-800 flex justify-center dark:text-zinc-100 font-semibold py-[1rem] text-[1.2rem] lg:text-[1.6rem]'>
        <span className='leading-none'>Ofertas de até 20% com o cupom URBNX20</span>
      </div>
      <div className="container-width py-[3rem] flex items-center justify-between relative max-md:flex-wrap">
        <Link href={"/"} className='text-zinc-900 dark:text-zinc-100 flex items-center gap-[.6rem] text-[2rem] max-lg:leading-none font-space font-semibold tracking-tight'>
          <AudioWaveform className='size-[3rem]' />
          UrbnX
        </Link>
        <motion.form onSubmit={(e) => {
          e.preventDefault()
          redirect(`/produtos?produto=${watch("searchTerm")}`)
        }} className='lg:ml-auto lg:mr-[2rem] relative lg:w-[30%] max-md:order-3 max-md:mt-[1.2rem] max-md:w-full' animate={{ width: !isMobile ? (searchBarFocus ? "50%" : "30%") : "100%" }} onAnimationComplete={(e: AnimationDefinition & { width: "30%" | "50%" | "100%" }) => {
          if (e.width === "50%") {
            setShowProducts(true)
          }
        }}>
          <input aria-label='Pesquisar produto' type="text" onKeyUp={() => {
            clearTimeout(timeOut.current as NodeJS.Timeout)
            timeOut.current = setTimeout(() => {
              if (watch("searchTerm").length > 0) {
                searchProduct(watch("searchTerm"))
              } else {
                setFoundProducts([])
              }
            }, 300)
          }} {...register("searchTerm")} ref={(el) => {
            register("searchTerm").ref(el)
            inputRef.current = el
          }} onFocus={() => {
            setSearchBarFocus(true)
            if (isMobile) {
              setShowProducts(true)
            }
          }} onBlur={() => {
            clearTimeout(timeOut.current as NodeJS.Timeout)
            timeOut.current = setTimeout(() => {
              setSearchBarFocus(false)
              setShowProducts(false)
            }, 500)
          }} className={clsx('dark:bg-zinc-800/70 hover:dark:border-zinc-700 border-transparent border duration-200 p-[1rem] text-[1.5rem] font-medium font-space leading-none rounded-[.6rem] w-full placeholder:text-zinc-600  dark:placeholder:text-zinc-400 pl-[4rem]', {

          })} placeholder='Pesquisar produto...' />
          <div className='absolute left-4 top-2/4 -translate-y-2/4'>
            <Search className='size-[1.8rem] text-zinc-900 dark:text-zinc-600' />
          </div>
          {showProducts && (foundProducts.length > 0 || historyProducts.length > 0) &&
            <div className='absolute left-0 top-[120%] dark:bg-zinc-900 w-full overflow-y-auto h-min max-h-[50rem] z-[5] rounded-[.6rem] p-[1.8rem]'>
              <div className="flex flex-col  gap-[1rem]">
                {(historyProducts.length === 0 || watch("searchTerm").length > 0) && foundProducts.map(p => <Link onClick={() => {
                  if (!historyProducts.find((f) => f.id === p.id)) {
                    setHistoryProducts([...historyProducts, { id: p.id, name: p.name, price: p.price, image: p.images[0], accessedAt: Date.now() }])
                  }
                  else {
                    setHistoryProducts(historyProducts.map((h) => {
                      return { ...h, accessedAt: Date.now() }
                    }))
                  }
                  setSearchBarFocus(true)
                  setShowProducts(true)

                }} href={`/produto/${p.id}`} key={p.id} className='flex gap-[1rem]'>
                  <Image src={p.images[0]} alt={p.name} width={200} height={200} className='size-[6rem] lg:size-[10rem] object-cover rounded-[1.4rem]' />
                  <div>
                    <span className='text-[1.6rem] lg:text-[2rem] font-semibold mb-[.4rem] block leading-none'>{p.name}</span>
                    <p className='text-[1.4rem] lg:text-[1.6rem] font-space'>R$ {p.price}</p>
                  </div>
                </Link>)}

                {historyProducts.length > 0 && foundProducts.length === 0 && searchBarFocus && <>
                  <div className='flex items-center gap-[.6rem] dark:text-zinc-300 text-[1.6rem]'>
                    <HistoryIcon className='size-[1.8rem]' />
                    <span>Buscas recentes</span>
                  </div>
                  {historyProducts.sort((a, b) => b.accessedAt - a.accessedAt).map(p =>
                    <Link onClick={() => {
                    }} href={`/produto/${p.id}`} key={p.id} className='flex gap-[1rem]'>
                      <Image src={p.image} alt={p.name} width={200} height={200} className='size-[10rem] object-cover rounded-[1.4rem]' />
                      <div>
                        <span className='text-[2rem] font-semibold mb-[.4rem] block leading-none'>{p.name}</span>
                        <p className='text-[1.6rem] font-space'>R$ {p.price}</p>
                      </div>
                    </Link>)}
                </>}
              </div>
            </div>}
        </motion.form>
        <nav className='flex items-center gap-[1rem] max-md:order-2'>
          {!signed && !isMobile && <div className='max-lg:hidden flex gap-[1rem] dark:divide-zinc-300 relative'>
            <div className='flex gap-[1rem]'>
              <Link href={"/login"} className='p-[1rem] rounded-[.6rem] font-semibold bg-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 text-[1.6rem]'>
                Login
              </Link>
              <Link href={"/criar-conta"} className='p-[1rem] rounded-[.6rem] font-semibold bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.6rem]'>
                Criar conta
              </Link>
            </div>
            <div className='after:content-[""] after:block after:absolute after:h-full after:w-[.2rem] after:bg-zinc-400 after:dark:bg-zinc-700 after:rounded-full'>
              
              </div>
            <div className='flex gap-[1rem]'>
              <button onClick={()=> setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <MoonStar className='size-[2rem] text-zinc-100'/> : <SunDim className='size-[2rem] text-zinc-900 '/>}
              </button>
              <button>
              <svg className='size-[2rem] fill-zinc-900 dark:fill-zinc-100' viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
            </div>

          </div>}
          {!signed && isMobile && <>
            <button aria-label={theme === "dark" ? "Trocar modo de cores para claro" : "Trocar modo de cores para escuro"} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <SunDim className='size-[2rem]' /> : <MoonStar className='size-[2rem] text-zinc-100' />}
            </button>
            <button aria-label={!menuMobileActive ? "Abrir menu": "Fechar menu"} onClick={() => setMenuMobileActive(v => !v)} className='flex flex-col my-auto gap-[.5rem] relative h-[8px] w-[24px] '>
              <div className={clsx('w-full h-[3px] bg-zinc-900 dark:bg-zinc-100 rounded-full duration-200 absolute ', {
                "rotate-[135deg] top-[30%]": menuMobileActive,
                "bottom-full": !menuMobileActive,
              })}></div>
              <div className={clsx('w-full h-[3px] bg-zinc-900 dark:bg-zinc-100 rounded-full duration-200 absolute', {
                "-rotate-[135deg] bottom-[30%]": menuMobileActive,
                "top-full": !menuMobileActive,
              })}></div>
            </button>
            {menuMobileActive && <Popup className='absolute right-0 -bottom-[5%] p-[.8rem] text-[1.4rem] font-medium flex flex-col bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-900 border dark:border-zinc-700 dark:text-zinc-100 rounded-[.5rem] z-[3]'>
              <Link href={"/login"} className='p-[.8rem] font-space'>
                Login
              </Link>
              <Link href={"/criar-conta"} className='p-[.8rem] font-space'>
                Criar conta
              </Link>
            </Popup>}
          </>}
          {signed && <>
            <Link href={"/usuario/carrinho"} className='relative'>
              <ShoppingCart  className='text-zinc-900 dark:text-zinc-100'/>
              <span className='absolute tabular-nums bg-zinc-100 text-zinc-900 block p-[.2rem] right-[-30%] bottom-[70%] rounded-full font-medium text-[1.5rem]'>{cart.reduce((acc, c) => acc + c.quantity, 0)}</span>
            </Link>
            <Link href={"/usuario/favoritos"} className='relative'>
              <Heart className='text-zinc-900 dark:text-zinc-100'/>
              <span className='absolute bg-zinc-100 tabular-nums text-zinc-900 block p-[.2rem] right-[-30%] bottom-[70%] rounded-full font-medium text-[1.5rem]'>{favorites.length}</span>
            </Link>
            <button onClick={() => setUserPopup(v => !v)} className='text-zinc-100 block relative text-start size-[30px]'>
              {user && !user?.avatar && <>
                <div className='size-[4rem] flex items-center justify-center border dark:border-zinc-800 rounded-full'>
                  <span className='text-[1.4rem] font-semibold uppercase'>
                    {user?.name && user?.name[0].toUpperCase()}
                    {user?.name && user?.name.split(" ")[user?.name.split(" ").length - 1][0]}
                  </span>
                </div>
              </>
              }
              {user && user.avatar && <Image src={user?.avatar as string} className='object-cover rounded-full h-full w-full' alt='' width={100} height={100} />}
              {userPopup &&
                <Popup className='dark:bg-zinc-900 border dark:border-zinc-800 dark:text-zinc-100 absolute right-0 top-[110%] w-[16rem]  rounded-[.5rem] z-[3]'>
                  <div className='border-b dark:border-zinc-800 p-[.8rem] '>
                    <span className='text-[1.5rem] font-semibold'>{user?.name}</span>
                    <p className='text-[1.3rem] dark:text-zinc-300'>{user?.email}</p>
                  </div>
                  <div className={"p-[.4rem]"}>
                    <Link href={"/usuario/conta/perfil"} className='flex items-center gap-[.6rem] text-[1.4rem] p-[.6rem] duration-200 rounded-[.6rem] hover:dark:bg-zinc-800'>
                      <User className='size-[1.8rem]' />
                      Minha conta
                    </Link>
                    <div onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")} className='flex items-center gap-[.6rem] text-[1.4rem] p-[.6rem] duration-200 rounded-[.6rem] hover:dark:bg-zinc-800'>
                      {theme === "dark" ? <MoonStar className='size-[1.8rem]' /> : <SunDim className='size-[1.8rem]' />}
                      {theme === "dark" ? "Tema escuro" : "Tema claro"}
                    </div>
                    <div onClick={logOut} className='flex items-center gap-[.6rem] text-[1.4rem] p-[.6rem] duration-200 rounded-[.6rem] hover:dark:bg-zinc-800'>
                      <LogOut className='size-[1.8rem]' />
                      Sair
                    </div>
                  </div>
                </Popup>}
            </button>
          </>}
        </nav>
      </div>
    </header>
  )
}

export default Header
