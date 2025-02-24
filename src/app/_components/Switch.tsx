"use client"
import React, { ComponentProps, HTMLAttributes, useState } from 'react'
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { twMerge } from 'tailwind-merge'


export const useSwitch = ()=> {
    const [checked, setChecked] = useState(false)
    return {checked, setChecked}
}


