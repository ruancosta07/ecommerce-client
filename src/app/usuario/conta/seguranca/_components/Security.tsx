"use client"
import { useSwitch } from '@/app/_components/Switch'
import { useUser } from '@/store/User'
import React, { useEffect } from 'react'
import * as SwitchPrimitive from "@radix-ui/react-switch"
import Cookies from 'js-cookie'
import { User } from '@/types/User'
const Security = () => {
  const { user, setUser } = useUser()
  const { checked, setChecked } = useSwitch()

  useEffect(()=> {
    setChecked(user?.twoStepsAuth as boolean)
  },[setChecked, user])

  async function switchTwoStepsAuth(checked:boolean){
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/users/${user?.id}/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${Cookies.get("authTokenUser")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({user:{...user, twoStepsAuth:checked}}),
      })
      const data = await response.json() as User

      setUser(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <section>
      <div>
        <div className="flex gap-[1rem]">
          <SwitchPrimitive.Root aria-checked={checked} checked={checked} onCheckedChange={(e) => {
            switchTwoStepsAuth(e)
          }} className={'bg-zinc-800 w-[5rem] h-[2.5rem] relative p-[.2rem] rounded-full aria-checked:bg-zinc-100 duration-200'}>
            <SwitchPrimitive.Thumb className='bg-zinc-100 size-[2.1rem] block rounded-full duration-200 relative data-[state=checked]:translate-x-[2.5rem] translate-x-[.2rem] data-[state=checked]:bg-zinc-900' />
          </SwitchPrimitive.Root>
        <div>
        <h1 className='text-[2rem] font-semibold text-zinc-100'>Verificação em duas etapas</h1>
        <p className='text-zinc-300 text-[1.4rem]'>Receba um email com um código para fazer login</p>
        </div>
        </div>
      </div>
    </section>
  )
}

export default Security
